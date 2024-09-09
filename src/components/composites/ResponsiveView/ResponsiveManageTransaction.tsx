import { useScreenDetector } from "@/hooks/useScreenWidth";
import { ITransaction } from "@/types/transaction";
import { UseDisclosureType } from "@/types/common";
import ModalManageTransaction from "../Modals/ModalManageTransaction";
import SheetManageTransaction from "../Sheets/SheetManageTransaction";
import { ICategory } from "@/types/category";

interface IResponsiveManageTransaction {
  disclosure: UseDisclosureType;
  handleSubmit: (formData: any) => void;
  role: "delete" | "edit" | "create";
  selectedTransaction?: ITransaction | null;
  categoryList?: ICategory[];
}

function ResponsiveManageTransaction({
  disclosure,
  handleSubmit,
  role,
  selectedTransaction,
  categoryList,
}: IResponsiveManageTransaction) {
  const { isDesktop } = useScreenDetector();

  if (!isDesktop) {
    return (
      <SheetManageTransaction
        role={role}
        selectedTransaction={selectedTransaction}
        disclosure={disclosure}
        handleSubmit={handleSubmit}
        categoryList={categoryList}
      />
    );
  }

  return (
    <ModalManageTransaction
      role={role}
      selectedTransaction={selectedTransaction}
      disclosure={disclosure}
      handleSubmit={handleSubmit}
      categoryList={categoryList}
    />
  );
}

export default ResponsiveManageTransaction;
