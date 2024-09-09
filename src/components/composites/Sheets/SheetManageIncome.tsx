import { UseDisclosureType } from "@/types/common";
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

interface ISheetManageIncome {
  disclosure: UseDisclosureType;
}

function SheetManageIncome({ disclosure }: ISheetManageIncome) {
  const { isDesktop } = useScreenDetector();
  const [dataIncomeList, setDataIncomeList] = useState<ITransaction[]>([]);
  const [categoryListIncome, setCategoryListIncome] = useState<ICategoryResponse[]>([]);

  const modalManageTransaction = useDisclosure();
  const modalDeleteTransaction = useDisclosure();

  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);

  const refetchDataTransactionIncome = async () => {
    const { data } = await getTransactions({
      type: "income",
      startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
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
      startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    });

    console.log("data", data);

    if (!error) setDataIncomeList(data || []);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

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
        side={isDesktop ? "right" : "bottom"}
        className={isDesktop ? "!max-w-[800px]" : "max-w-full"}
      >
        <SheetHeader>
          <SheetTitle>Manage Income</SheetTitle>
          <SheetDescription>
            Roughly estimate your income after tax. Then, we do the budgeting for you.
          </SheetDescription>
        </SheetHeader>

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

export default SheetManageIncome;
