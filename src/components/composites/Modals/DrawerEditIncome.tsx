import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseDisclosureType } from "@/types/common";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Box } from "@radix-ui/themes";
import { CheckIcon } from "lucide-react";
import useViewports from "@/hooks/useScreenWidth";
import { getCategories } from "@/actions/categories";
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
import ModalManageTransaction, { IFormDataManageTransaction } from "./ModalManageTransaction";

interface IDrawerEditIncome {
  disclosure: UseDisclosureType;
  handleSubmit: (formData: any) => any;
}

function DrawerEditIncome({ disclosure }: IDrawerEditIncome) {
  const { isSmallViewport } = useViewports();
  const [dataIncomeList, setDataIncomeList] = useState<ITransaction[]>([]);
  const [categoryListIncome, setCategoryListIncome] = useState<ICategoryResponse[]>([]);

  const modalManageTransaction = useDisclosure();
  const modalDeleteTransaction = useDisclosure();

  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);

  const refetchDataTransactionIncome = async () => {
    const { data } = await getTransactions({
      type: "income",
    });
    if (data) setDataIncomeList(data);
  };

  // On Submits
  const handleSubmit = async (formData: IFormDataManageTransaction) => {
    // ? Actually exclude the category_title
    const { category_title, ...restFormData } = formData;
    try {
      let query;
      if (selectedTransaction)
        query = await updateTransaction(restFormData, selectedTransaction.id);
      else query = await createTransaction(restFormData);
      refetchDataTransactionIncome();
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
        refetchDataTransactionIncome();
        toast.success(`Transaction ${selectedTransaction.title} deleted!`);
      }
    } catch (error) {
      toast.error(`Cannot delete Transaction`, {
        description: `${error}`,
      });
    }
  };

  const fetchIncomes = async () => {
    const { data, error } = await getTransactions({
      type: "income",
    });

    if (!error) setDataIncomeList(data || []);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  useEffect(() => {
    console.log("dataIncomeList", dataIncomeList);
  }, [dataIncomeList]);

  const handleOpenEditTransaction = (item: ITransaction) => {
    setSelectedTransaction(item);
    modalManageTransaction.open();
  };

  const handleOpenDeleteTransaction = (item: ITransaction) => {
    setSelectedTransaction(item);
    modalDeleteTransaction.open();
  };

  return (
    <Sheet onOpenChange={disclosure.toggle} open={disclosure.isOpen}>
      <SheetContent
        side={isSmallViewport ? "bottom" : "right"}
        className="max-w-full lg:max-w-[800px]"
      >
        <SheetHeader>
          <SheetTitle>Edit Income</SheetTitle>
          <SheetDescription>
            Roughly estimate your income after tax. Then, we do the budgeting for you
          </SheetDescription>
        </SheetHeader>

        <TableTransactionView
          withFilters={false}
          dataTransaction={dataIncomeList || []}
          handleOpenModalEdit={handleOpenEditTransaction}
          handleOpenModalDelete={handleOpenDeleteTransaction}
        />
        <SheetFooter className="my-4">
          <SheetClose asChild>
            <Button type="submit" variant="outline" className="ml-auto">
              <CheckIcon className="mr-2 h-4 w-4" /> Submit
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>

      {/* Modals */}

      {modalManageTransaction.isOpen && (
        <ModalManageTransaction
          role={selectedTransaction ? "edit" : "create"}
          categoryList={dataIncomeList.map(item => {
            return {
              id: item.category_id,
              category_title: item.category_title,
              colorBadge: item.color_badge,
            };
          })}
          selectedTransaction={selectedTransaction}
          disclosure={modalManageTransaction}
          handleSubmit={handleSubmit}
        />
      )}

      {modalDeleteTransaction.isOpen && (
        <ModalManageTransaction
          role={"delete"}
          selectedTransaction={selectedTransaction}
          disclosure={modalDeleteTransaction}
          handleSubmit={handleRemoveTransaction}
        />
      )}
    </Sheet>
  );
}

export default DrawerEditIncome;
