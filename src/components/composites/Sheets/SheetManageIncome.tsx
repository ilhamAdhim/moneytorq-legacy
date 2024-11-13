import { COLORS, UseDisclosureType } from "@/types/common";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useScreenDetector } from "@/hooks/useScreenWidth";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/actions/transactions";
import { useEffect, useState } from "react";
import { ITransaction } from "@/types/transaction";
import { ICategoryResponse } from "@/types/category";
import TableTransactionView from "@/app/(group-feature)/transaction/TableTransaction";
import { useDisclosure } from "@/hooks/useDisclosure";
import { toast } from "sonner";
import ModalManageTransaction, {
  IFormDataManageTransaction,
} from "../Modals/ModalManageTransaction";
import { format, subDays } from "date-fns";
import { formatRupiah } from "@/utils/common";
import { Box } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/actions/categories";
import TableCategoriesView from "@/app/(group-feature)/budgeting/TableCategories";
import { Separator } from "@/components/ui/separator";
import ModalManageCategory from "../Modals/ModalManageCategory";
import { IFormDataManageCategory } from "./SheetManageCategory";
import { useAtomValue } from "jotai/react";
import { PROCESSED_COLORS_ATOM } from "@/store";

interface ISheetManageIncome {
  disclosure: UseDisclosureType;
}

function SheetManageIncome({ disclosure }: ISheetManageIncome) {
  const COLORS = useAtomValue(PROCESSED_COLORS_ATOM);

  const { isDesktop } = useScreenDetector();
  const [dataIncomeList, setDataIncomeList] = useState<ITransaction[]>([]);
  const [categoryListIncome, setCategoryListIncome] = useState<ICategoryResponse[]>([]);

  const modalManageTransaction = useDisclosure();
  const modalDeleteTransaction = useDisclosure();
  const modalManageCategory = useDisclosure();
  const modalDeleteCategory = useDisclosure();

  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategoryResponse | null>(null);

  const fetchIncomes = async () => {
    const { data, error } = await getTransactions({
      type: "income",
      startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    });

    if (!error) setDataIncomeList(data || []);
  };

  const fetchCategoryIncome = async () => {
    const {
      queryCategories: { data, error },
    } = await getCategories({
      type: "income",
    });

    if (!error) setCategoryListIncome(data || []);
  };

  useEffect(() => {
    fetchIncomes();
    fetchCategoryIncome();
  }, []);

  // On Submits
  const handleSubmit = async (formData: IFormDataManageTransaction) => {
    // ? Actually exclude the category_title
    const { category_title, ...restFormData } = formData;
    const payload: IFormDataManageTransaction = { ...restFormData, type: "income" };
    try {
      let query;
      if (selectedTransaction) query = await updateTransaction(payload, selectedTransaction.id);
      else query = await createTransaction(payload);
      fetchIncomes();
      fetchCategoryIncome();
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
        fetchIncomes();
        fetchCategoryIncome();
        toast.success(`Transaction ${selectedTransaction.title} deleted!`);
      }
    } catch (error) {
      toast.error(`Cannot delete Transaction`, {
        description: `${error}`,
      });
    }
  };

  const handleSubmitCategory = async (formData: IFormDataManageCategory) => {
    const payload: IFormDataManageCategory = { ...formData, category_type: "income" };
    try {
      let query;
      if (selectedCategory) query = await updateCategory(payload, selectedCategory.category_id);
      else query = await createCategory(payload);
      fetchIncomes();
      fetchCategoryIncome();
      toast.success(`Category ${selectedCategory ? "Updated" : "Created"}!`);
    } catch (error) {
      console.error(error);
      toast.error(`Cannot ${selectedCategory ? "Update" : "Create"} Category | ${error}`);
    } finally {
      modalManageCategory.close();
    }
  };

  const handleRemoveCategory = async () => {
    try {
      if (selectedCategory) {
        const { error } = await deleteCategory(selectedCategory.category_id);
        if (error) throw Error(error.message);

        modalDeleteCategory.close();
        fetchIncomes();
        fetchCategoryIncome();
        toast.success(`Category ${selectedCategory.category_title} deleted!`);
      }
    } catch (error) {
      toast.error(`Cannot delete category`, {
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

  const handleOpenCreateCategory = () => {
    setSelectedCategory(null);
    modalManageCategory.open();
  };

  const handleOpenEditCategory = (item: ICategoryResponse) => {
    setSelectedCategory(item);
    modalManageCategory.open();
  };

  const handleOpenDeleteCategory = (item: ICategoryResponse) => {
    setSelectedCategory(item);
    modalDeleteCategory.open();
  };

  return (
    <>
      <Sheet onOpenChange={disclosure.toggle} open={disclosure.isOpen}>
        <SheetContent
          side={isDesktop ? "right" : "bottom"}
          className={`${isDesktop ? "!max-w-[800px]" : "max-w-full"} overflow-auto max-h-full`}
        >
          <div className="">
            <SheetHeader className="my-4 w-full flex flex-col sm:flex-row space-between">
              <Box className="flex-1">
                <SheetTitle>Income Stream</SheetTitle>
                <SheetDescription>
                  Here are your income stream. Try expand it more later!
                </SheetDescription>
              </Box>
              <Button
                onClick={handleOpenCreateCategory}
                className="flex gap-2  bg-[var(--button-solid)]"
              >
                <PlusIcon color="white" />
                <div className="my-auto text-white">Add Stream Income</div>
              </Button>
            </SheetHeader>

            <TableCategoriesView
              dataCategoryList={categoryListIncome}
              handleOpenModalDelete={handleOpenDeleteCategory}
              handleOpenModalEdit={handleOpenEditCategory}
            />

            <Separator className="my-4" />

            <Box className="my-4 w-full flex flex-col gap-4 sm:flex-row space-between">
              <Box className="flex-1">
                <Box className="font-semibold text-lg">Manage Income</Box>
                <div className="text-sm text-muted-foreground">
                  Roughly estimate your income after tax. Then, we do the budgeting for you.
                </div>
              </Box>
              <Button
                onClick={handleOpenCreateTransaction}
                className="flex gap-2 bg-[var(--button-solid)]"
              >
                <PlusIcon color="white" />
                <div className="my-auto text-white">Add Income</div>
              </Button>
            </Box>

            <TableTransactionView
              withFilters={false}
              dataTransaction={dataIncomeList || []}
              handleOpenModalEdit={handleOpenEditTransaction}
              handleOpenModalDelete={handleOpenDeleteTransaction}
              tableCaption="Your income last 30 days"
            />
            <SheetFooter className="my-4">
              Total Income:{" "}
              {formatRupiah(
                dataIncomeList
                  ? dataIncomeList?.map(item => item?.amount)?.reduce((a, b) => a + b, 0)
                  : 0
              )}
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Modals */}
      {modalManageTransaction.isOpen && (
        <ModalManageTransaction
          isExpense={false}
          role={selectedTransaction ? "edit" : "create"}
          categoryList={categoryListIncome.map(item => {
            const { category_title, color_badge, category_id } = item;
            return {
              category_title,
              id: category_id,
              colorBadge: color_badge as COLORS,
            };
          })}
          selectedTransaction={selectedTransaction}
          disclosure={modalManageTransaction}
          handleSubmit={handleSubmit}
        />
      )}

      {modalDeleteTransaction.isOpen && (
        <ModalManageTransaction
          isExpense={false}
          role={"delete"}
          selectedTransaction={selectedTransaction}
          disclosure={modalDeleteTransaction}
          handleSubmit={handleRemoveTransaction}
        />
      )}

      {modalManageCategory.isOpen && (
        <ModalManageCategory
          isForExpense={false}
          role={selectedCategory ? "edit" : "create"}
          selectedCategory={selectedCategory}
          disclosure={modalManageCategory}
          handleSubmit={handleSubmitCategory}
          processedColors={COLORS}
        />
      )}

      {modalDeleteCategory.isOpen && (
        <ModalManageCategory
          role={"delete"}
          selectedCategory={selectedCategory}
          disclosure={modalDeleteCategory}
          handleSubmit={handleRemoveCategory}
        />
      )}
    </>
  );
}

export default SheetManageIncome;
