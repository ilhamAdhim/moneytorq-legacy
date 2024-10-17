import { useScreenDetector } from "@/hooks/useScreenWidth";
import { ICategoryResponse } from "@/types/category";
import { UseDisclosureType } from "@/types/common";
import SheetManageCategory from "../Sheets/SheetManageCategory";
import ModalManageCategory from "../Modals/ModalManageCategory";
import { PROCESSED_COLORS_ATOM } from "@/store";
import { useAtomValue } from "jotai/react";

interface IResponsiveManageCategory {
  disclosure: UseDisclosureType;
  handleSubmit: (formData: any) => void;
  role: "delete" | "edit" | "create";
  selectedCategory?: ICategoryResponse | null;
}

function ResponsiveManageCategory({
  disclosure,
  handleSubmit,
  role,
  selectedCategory,
}: IResponsiveManageCategory) {
  const COLORS = useAtomValue(PROCESSED_COLORS_ATOM);
  const { isDesktop } = useScreenDetector();

  if (!isDesktop)
    return (
      <SheetManageCategory
        role={role}
        selectedCategory={selectedCategory}
        disclosure={disclosure}
        handleSubmit={handleSubmit}
        processedColors={COLORS}
      />
    );

  return (
    <ModalManageCategory
      role={role}
      selectedCategory={selectedCategory}
      disclosure={disclosure}
      handleSubmit={handleSubmit}
      processedColors={COLORS}
    />
  );
}

export default ResponsiveManageCategory;
