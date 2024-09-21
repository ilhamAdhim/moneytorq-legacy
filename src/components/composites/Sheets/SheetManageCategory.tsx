import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLORS, UseDisclosureType } from "@/types/common";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Badge, Box } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import { SearchableSelect } from "../SearchableSelect";
import { COLORS_OPTION } from "@/constants";
import { ICategoryResponse } from "@/types/category";
import { Loader2 } from "lucide-react";
import { SheetFooter } from "@/components/ui/sheet";
import { capitalize } from "@/utils/common";
import DialogSheet from "../DialogSheet";

export interface IFormDataManageCategory {
  percentage_amount: number;
  category_title?: string;
  color_badge?: COLORS;
  description?: string;
  category_type?: "expenses" | "income";
}

interface ISheetManageCategory {
  disclosure: UseDisclosureType;
  handleSubmit: (formData: any) => void;
  role: "delete" | "edit" | "create";
  selectedCategory?: ICategoryResponse | null;
  processedColors: { value: string; label: string }[];
}

function SheetManageCategory({
  disclosure,
  handleSubmit,
  role,
  selectedCategory,
  processedColors,
}: ISheetManageCategory) {
  const {
    watch,
    register,
    control,
    handleSubmit: submitForm,
    formState: { isValid, errors, isSubmitting },
  } = useForm<IFormDataManageCategory>({
    mode: "all",
    ...(selectedCategory && {
      defaultValues: {
        category_title: selectedCategory.category_title,
        color_badge: selectedCategory.color_badge as COLORS,
        description: selectedCategory.description,
        percentage_amount: selectedCategory.percentage_amount,
      },
    }),
  });

  const watchCategoryName = watch("category_title");
  const watchColorBadge = watch("color_badge");

  if (role === "delete")
    return (
      <DialogSheet
        side="bottom"
        onOpenChange={disclosure.toggle}
        isOpen={disclosure.isOpen}
        title={`Delete Category`}
        desc={`Are you sure want to delete ${selectedCategory?.category_title}?`}
      >
        <SheetFooter className="flex flex-row gap-4 justify-center mt-4">
          <Button onClick={disclosure.close} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="outline">
            <CheckIcon className="mr-2 h-4 w-4" /> Delete
          </Button>
        </SheetFooter>
      </DialogSheet>
    );

  return (
    <>
      <DialogSheet
        side="bottom"
        onOpenChange={disclosure.toggle}
        isOpen={disclosure.isOpen}
        title={`${capitalize(role)} Category`}
      >
        <form onSubmit={submitForm(handleSubmit)}>
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Category Name
              </Label>
              <Box className="col-span-3 space-y-1">
                <Input
                  id="category_title"
                  className="col-span-3"
                  {...register("category_title", {
                    required: { value: true, message: "Required" },
                  })}
                />
                {errors.category_title && (
                  <div className="text-red-500 text-sm">
                    {errors?.category_title?.message as any}
                  </div>
                )}
              </Box>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="percentage" className="text-left">
                Percentage Amount
              </Label>
              <Box className="col-span-3 space-y-1">
                <Input
                  type="number"
                  id="percentage"
                  {...register("percentage_amount", {
                    required: { value: true, message: "Required" },
                    min: { value: 1, message: "Please enter a positive number" },
                    max: {
                      value: 70,
                      message: "It's better to have reasonable allocation for various budgets :)",
                    },
                  })}
                />
                {errors.percentage_amount && (
                  <div className="text-red-500 text-sm">
                    {errors?.percentage_amount?.message as any}
                  </div>
                )}
              </Box>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Choose Color
              </Label>
              <div className="col-span-3">
                <Controller
                  name="color_badge"
                  rules={{
                    required: {
                      message: "Please choose color badge",
                      value: true,
                    },
                  }}
                  control={control as any}
                  render={({ field }) => (
                    <SearchableSelect
                      data={processedColors}
                      selectedValue={field.value}
                      entity="Colors"
                      setSelectedValue={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            <hr />
            <div className="flex gap-4">
              <div className="text-center text-lg font-semibold">Preview</div>
              <div className="flex">
                <Badge className="p-1 rounded-md text-sm" color={watchColorBadge}>
                  {watchCategoryName}
                </Badge>
              </div>
            </div>
            <hr />
            <div className="flex justify-end">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </DialogSheet>
    </>
  );
}

export default SheetManageCategory;
