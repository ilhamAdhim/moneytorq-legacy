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
import { useEffect, useMemo, useState } from "react";
import { MONTHS } from "@/constants";
import { isAfter } from "date-fns";
import TableTransactionView from "./TableTransaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ModalManageTransaction, {
  IFormDataManageTransaction,
} from "@/components/composites/Modals/ModalManageTransaction";
import { RadarChartCustom } from "@/components/composites/Charts/RadarChart";
import { ITransaction } from "@/types/transaction";
import { useDisclosure } from "@/hooks/useDisclosure";
import { toast } from "sonner";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/actions/transactions";
import { Flex } from "@radix-ui/themes";
import ModalManageCategory, {
  IFormDataManageCategory,
} from "@/components/composites/Modals/ModalManageCategory";
import { createCategory, getCategories } from "@/actions/categories";
import { COLORS } from "@/types/common";
import { ICategory, ICategoryResponse } from "@/types/category";
import ResponsiveManageTransaction from "@/components/composites/ResponsiveView/ResponsiveManageTransaction";

const availableYearsHistory = [2024, 2023, 2022];

interface ITransactionView {
  dataTransaction: ITransaction[];
}

function TransactionView({ dataTransaction }: ITransactionView) {
  const [transactionList, setTransactionList] = useState<ITransaction[]>([]);

  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);

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

  useEffect(() => {
    console.log(processMonths, selectedYear);
  }, [processMonths, selectedYear]);

  const refetchDataTransaction = async () => {
    const { data } = await getTransactions({});
    if (data) setTransactionList(data);
  };

  useEffect(() => {
    if (dataTransaction) setTransactionList(dataTransaction);
  }, [dataTransaction]);

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

  useEffect(() => {
    const fetchDataCategory = async () => {
      const {
        queryCategories: { data: dataCategory },
        queryTotalPercentage: { data: dataTotalPercent },
      } = await getCategories({});
      if (dataCategory)
        setCategoryList(
          dataCategory?.map((item: ICategoryResponse) => {
            return {
              id: item.category_id,
              budgetPercentage: item.percentage_amount,
              category_title: item.category_title,
              colorBadge: item.color_badge as COLORS,
            };
          })
        );
      if (dataTotalPercent) setTotalPercentage(dataTotalPercent);
    };

    fetchDataCategory();
  }, []);

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
        <h2 className="text-3xl font-bold tracking-tight">Transaction</h2>
        <div className="flex items-center space-x-2 gap-4">
          <Button onClick={handleOpenCreateTransaction} className="flex gap-2">
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

      <div className={`flex flex-col md:flex-row gap-4`}>
        <Card className="w-full md:w-2/5">
          <CardHeader>
            <CardTitle>
              Money Spent at {selectedMonth} {selectedYear}{" "}
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-full sm:h-[400px]">
            <RadarChartCustom />
          </CardContent>
        </Card>
        <Card className="w-full md:w-3/5">
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
          </CardHeader>
          <CardContent className="px-8">
            <TableTransactionView
              withFilters
              dataTransaction={transactionList || []}
              categoryList={categoryList}
              modalManageCategory={modalManageCategory}
              handleOpenModalEdit={handleOpenEditTransaction}
              handleOpenModalDelete={handleOpenDeleteTransaction}
            />
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
        />
      )}
    </>
  );
}

export default TransactionView;
