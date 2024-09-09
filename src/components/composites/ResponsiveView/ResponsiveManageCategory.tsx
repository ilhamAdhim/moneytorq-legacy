import { useScreenDetector } from "@/hooks/useScreenWidth";
import { ICategoryResponse } from "@/types/category";
import { UseDisclosureType } from "@/types/common";
import SheetManageCategory from "../Sheets/SheetManageCategory";
import ModalManageCategory from "../Modals/ModalManageCategory";
import { COLORS_OPTION } from "@/constants";
import { useState, useEffect } from "react";

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
  const { isDesktop } = useScreenDetector();

  const [processedColors, setProcessedColors] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    setProcessedColors(
      COLORS_OPTION.map(item => {
        return {
          value: item,
          label: item,
        };
      })
    );
  }, []);

  if (!isDesktop)
    return (
      <SheetManageCategory
        role={role}
        selectedCategory={selectedCategory}
        disclosure={disclosure}
        handleSubmit={handleSubmit}
        processedColors={processedColors}
      />
    );

  return (
    <ModalManageCategory
      role={role}
      selectedCategory={selectedCategory}
      disclosure={disclosure}
      handleSubmit={handleSubmit}
      processedColors={processedColors}
    />
  );
}

export default ResponsiveManageCategory;
