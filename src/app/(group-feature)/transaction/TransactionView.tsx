"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MONTHS } from "@/constants";
import { format, formatDate, isAfter, lastDayOfMonth } from "date-fns";
import TableTransactionView from "./TableTransaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Banknote, Calculator, PlusIcon, WalletCards } from "lucide-react";
import { IFormDataManageTransaction } from "@/components/composites/Modals/ModalManageTransaction";
import RadarChartCustom from "@/components/composites/Charts/RadarChart";
import { ITransaction } from "@/types/transaction";
import { useDisclosure } from "@/hooks/useDisclosure";
import { toast } from "sonner";
import {
  createTransaction,
  deleteTransaction,
  getRadarChartExpenses,
  getTransactions,
  updateTransaction,
} from "@/actions/transactions";
import { Box, Flex, Spinner } from "@radix-ui/themes";
import ModalManageCategory, {
  IFormDataManageCategory,
} from "@/components/composites/Modals/ModalManageCategory";
import { createCategory, getCategories } from "@/actions/categories";
import { COLORS } from "@/types/common";
import { ICategory, ICategoryResponse } from "@/types/category";
import ResponsiveManageTransaction from "@/components/composites/ResponsiveView/ResponsiveManageTransaction";
import LoaderCustom from "@/components/composites/Modals/Loaders";
import { PROCESSED_COLORS_ATOM } from "@/store";
import { useAtomValue } from "jotai/react";

const availableYearsHistory = [2024, 2023, 2022];

interface IExpenseVSBudget {
  user_id: string;
  month_name: string;
  category_title: string;
  total_expenses: number;
  budgeted_amount: number;
}
interface ITransactionView {
  dataTransaction: ITransaction[];
  dataRadarChart: IExpenseVSBudget[];
}

function TransactionView({ dataTransaction, dataRadarChart }: ITransactionView) {
  const COLORS = useAtomValue(PROCESSED_COLORS_ATOM);

  const [transactionList, setTransactionList] = useState<ITransaction[]>([]);
  const [expenseVSBudget, setExpenseVSBudget] = useState<IExpenseVSBudget[]>([]);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [renderFilterDate, setRenderFilterDate] = useState("");

  const modalManageTransaction = useDisclosure();
  const modalDeleteTransaction = useDisclosure();
  const modalManageCategory = useDisclosure();

  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);

  const processMonths = useMemo(() => {
    return MONTHS.map((month, idx) => {
      return {
        value: month,
        isAvailable: isAfter(new Date(), new Date(new Date(selectedYear).getFullYear(), idx, 1)),
      };
    });
  }, [selectedYear]);

  const processedDataChart = useMemo(() => {
    return expenseVSBudget.map(item => {
      return {
        category: item.category_title,
        budget: item.budgeted_amount,
        expenses: item.total_expenses,
      };
    });
  }, [expenseVSBudget]);

  const refetchDataTransaction = async (params?: { startDate: string; endDate: string }) => {
    setIsLoadingTransaction(true);
    const { data } = await getTransactions({
      ...(params?.startDate && { startDate: params?.startDate }),
      ...(params?.endDate && { endDate: params?.endDate }),
    });
    if (data) {
      setIsLoadingTransaction(false);
      setTransactionList(data);
    }
  };

  const refetchRadarChart = async (params?: { startDate: string; endDate: string }) => {
    setIsLoadingTransaction(true);
    const { data } = await getRadarChartExpenses({
      ...(params?.startDate && { startDate: params?.startDate || "" }),
      ...(params?.endDate && { endDate: params?.endDate || "" }),
    });
    if (data) {
      setIsLoadingTransaction(false);
      setExpenseVSBudget(data);
    }
  };

  useEffect(() => {
    const convertToMonthNumber = MONTHS.findIndex(item => item === selectedMonth) + 1;
    const month =
      convertToMonthNumber >= 10 ? `${convertToMonthNumber}` : `0${convertToMonthNumber}`;
    const startDate = format(
      new Date(`${selectedYear || new Date().getUTCFullYear()}-${month}-01`),
      "yyyy-MM-dd"
    );
    const endDate = format(lastDayOfMonth(startDate), "yyyy-MM-dd");

    setRenderFilterDate(`${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`);

    refetchDataTransaction({ endDate, startDate });
    refetchRadarChart({ endDate, startDate });
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (dataTransaction) setTransactionList(dataTransaction);
  }, [dataTransaction]);

  // ? Every times transactionList is changed (CRUD) => Update Radar chart
  // useEffect(() => {
  //   if (renderFilterDate && transactionList.length > 0) {
  //     const [start, end] = renderFilterDate.split("-");

  //     refetchRadarChart({
  //       endDate: format(new Date(end), "yyyy-MM-dd"),
  //       startDate: format(new Date(start), "yyyy-MM-dd"),
  //     });
  //   }
  // }, [transactionList, renderFilterDate]);

  // On Submits
  const handleSubmit = async (formData: IFormDataManageTransaction) => {
    // ? Actually exclude the category_title
    const { category_title, ...restFormData } = formData;
    try {
      let query;
      if (selectedTransaction)
        query = await updateTransaction(restFormData, selectedTransaction.id);
      else query = await createTransaction(restFormData);

      const { data, error, status } = query;
      refetchDataTransaction();
      toast.success(`Transaction ${selectedTransaction ? "Updated" : "Created"}!`);
    } catch (error) {
      console.error(error);
      toast.error(`Cannot ${selectedTransaction ? "Update" : "Create"} Category | ${error}`);
    } finally {
      modalManageTransaction.close();
    }
  };

  const handleRemoveTransaction = async () => {
    try {
      if (selectedTransaction) {
        const { error } = await deleteTransaction(selectedTransaction.id);
        if (error) throw Error(error.message);

        modalDeleteTransaction.close();
        refetchDataTransaction();
        toast.success(`Transaction ${selectedTransaction.title} deleted!`);
      }
    } catch (error) {
      toast.error(`Cannot delete Transaction`, {
        description: `${error}`,
      });
    }
  };

  // Modal Handlers
  const handleOpenCreateTransaction = () => {
    setSelectedTransaction(null);
    modalManageTransaction.open();
  };

  const handleOpenEditTransaction = (item: ITransaction) => {
    setSelectedTransaction(item);
    modalManageTransaction.open();
  };

  const handleOpenDeleteTransaction = (item: ITransaction) => {
    setSelectedTransaction(item);
    modalDeleteTransaction.open();
  };

  // Data Categories
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [totalPercentage, setTotalPercentage] = useState(0);

  const refetchDataCategories = async () => {
    const {
      queryCategories: { data },
      queryTotalPercentage: { data: dataPercentage },
    } = await getCategories({});
    if (data)
      setCategoryList(
        data?.map((item: ICategoryResponse) => {
          return {
            id: item.category_id,
            budgetPercentage: item.percentage_amount,
            category_title: item.category_title,
            colorBadge: item.color_badge as COLORS,
          };
        })
      );

    if (dataPercentage) setTotalPercentage(dataPercentage);
  };

  useEffect(() => {
    refetchDataCategories();
  }, []);

  const handleSubmitCreateCategory = async (formData: IFormDataManageCategory) => {
    try {
      if (Number(totalPercentage) + Number(formData.percentage_amount) > 100)
        throw Error("Your budget is more than 100% ?");
      const query = await createCategory(formData);
      refetchDataCategories();
      toast.success(`Category Created!`);
    } catch (error) {
      console.error(error);
      toast.error(`Cannot Create Category <br/> | ${error}`);
    } finally {
      modalManageCategory.close();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl lg:text-3xl font-bold tracking-tight">Transaction</h2>
        <div className="flex items-center space-x-2 gap-4">
          <Button
            onClick={handleOpenCreateTransaction}
            className="flex gap-2 bg-[var(--button-solid)]"
          >
            <PlusIcon color="white" />
            <div className="my-auto text-white">Add Records</div>
          </Button>
        </div>
      </div>
      <Flex gap="4" justify="between">
        <Select onValueChange={val => setSelectedYear(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year </SelectLabel>
              {availableYearsHistory.map(item => (
                <SelectItem key={item} value={`${item}`}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Only on Mobile view */}
        <div className="block lg:hidden">
          <Select onValueChange={val => setSelectedMonth(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel> Month </SelectLabel>
                {processMonths.map((item, idx) => (
                  <SelectItem key={idx} value={item.value}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Only on desktop view */}
        <Tabs defaultValue={selectedMonth} className="space-y-4 hidden lg:block">
          <TabsList>
            {processMonths.map((item, idx) => (
              <TabsTrigger
                // ? Especially this textContent
                // @ts-ignore-next-line
                onClick={val => setSelectedMonth(val.target.textContent)}
                disabled={!item.isAvailable}
                key={idx}
                value={`${item.value}`}
              >
                {item.value}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Flex>

      <div className={`flex flex-col lg:flex-row gap-4`}>
        <Card className="w-full lg:w-2/5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className=" flex gap-4">
              <Calculator />
              Money Spent at {selectedMonth} {selectedYear}
            </CardTitle>
          </CardHeader>
          <RadarChartCustom isLoading={isLoadingTransaction} data={processedDataChart} />
          <Box className="flex flex-col gap-4 my-4 pt-4 text-sm">
            <div className="flex items-center justify-center gap-2 font-medium leading-none">
              Your top 6 categories
              <WalletCards className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-center gap-2 leading-none text-muted-foreground">
              {renderFilterDate}
            </div>
          </Box>
        </Card>
        <Card className="w-full lg:w-3/5">
          <CardHeader>
            <CardTitle className="flex gap-4">
              <Banknote />
              Transaction Records
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8">
            {isLoadingTransaction ? (
              <Box className="h-[300px]">
                <LoaderCustom />
              </Box>
            ) : (
              <TableTransactionView
                withFilters
                dataTransaction={transactionList || []}
                categoryList={categoryList}
                modalManageCategory={modalManageCategory}
                handleOpenModalEdit={handleOpenEditTransaction}
                handleOpenModalDelete={handleOpenDeleteTransaction}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}

      {modalManageTransaction.isOpen && (
        <ResponsiveManageTransaction
          role={selectedTransaction ? "edit" : "create"}
          categoryList={categoryList}
          selectedTransaction={selectedTransaction}
          disclosure={modalManageTransaction}
          handleSubmit={handleSubmit}
        />
      )}

      {modalDeleteTransaction.isOpen && (
        <ResponsiveManageTransaction
          role={"delete"}
          selectedTransaction={selectedTransaction}
          disclosure={modalDeleteTransaction}
          handleSubmit={handleRemoveTransaction}
        />
      )}

      {modalManageCategory.isOpen && (
        <ModalManageCategory
          role={"create"}
          disclosure={modalManageCategory}
          handleSubmit={handleSubmitCreateCategory}
          processedColors={COLORS}
        />
      )}
    </>
  );
}

export default TransactionView;
