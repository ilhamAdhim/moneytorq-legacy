import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLORS, UseDisclosureType } from "@/types/common";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Badge, Box } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import { SearchableSelect } from "../SearchableSelect";
import { ICategoryResponse } from "@/types/category";
import { Loader2 } from "lucide-react";
import { SheetFooter } from "@/components/ui/sheet";
import { capitalize, formatRupiah, parseRupiah } from "@/utils/common";
import DialogSheet from "../DialogSheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtomValue } from "jotai/react";
import { availableBudgetPercentageAtom, availableBudgetRupiahAtom } from "@/store";
import { useEffect, useMemo } from "react";
import { NumericFormat } from "react-number-format";

export interface IFormDataManageCategory {
  percentage_amount?: number;
  rupiah_amount?: number;
  category_title: string;
  color_badge?: COLORS;
  description?: string;
  category_type?: "expenses" | "income";
  budget_type: "percentage" | "rupiah";
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
  const availableBudgetPercentage = useAtomValue(availableBudgetPercentageAtom);
  const availableBudgetRupiah = useAtomValue(availableBudgetRupiahAtom);

  const {
    watch,
    register,
    control,
    handleSubmit: submitForm,
    getValues,
    setValue,
    formState: { isValid, errors, isSubmitting },
    resetField,
  } = useForm<IFormDataManageCategory>({
    mode: "all",
    ...(selectedCategory
      ? {
          defaultValues: {
            category_title: selectedCategory.category_title,
            color_badge: selectedCategory.color_badge as COLORS,
            description: selectedCategory.description,
            percentage_amount: selectedCategory.percentage_amount,
            rupiah_amount: selectedCategory.rupiah_amount,
            budget_type: selectedCategory.is_using_percentage ? "percentage" : "rupiah",
          },
        }
      : {
          defaultValues: {
            budget_type: "percentage",
          },
        }),
  });

  const watchCategoryName = watch("category_title");
  const watchBudgetType = watch("budget_type");
  const watchColorBadge = watch("color_badge");

  const AVAILABLE_AMOUNT = useMemo(() => {
    if (selectedCategory && role === "edit") {
      return watchBudgetType === "percentage"
        ? availableBudgetPercentage + selectedCategory.percentage_amount || 70
        : availableBudgetRupiah + selectedCategory.rupiah_amount || 1000000;
    }
    return watchBudgetType === "percentage"
      ? availableBudgetPercentage || 70
      : availableBudgetRupiah || 1000000;
  }, [watchBudgetType, selectedCategory]);

  useEffect(() => {
    resetField("percentage_amount");
    resetField("rupiah_amount");
  }, [watchBudgetType]);

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
              <Label htmlFor="name" className="text-left">
                Budget Type
              </Label>
              <div className="col-span-3">
                <Controller
                  name="budget_type"
                  defaultValue={watchBudgetType}
                  control={control as any}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Budget Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Budget Type</SelectLabel>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="rupiah">Rupiah Amount</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="percentage" className="text-left">
                {capitalize(watchBudgetType || "")} Amount
              </Label>
              <Box className="col-span-3 space-y-1">
                <Controller
                  name={watchBudgetType === "percentage" ? "percentage_amount" : "rupiah_amount"}
                  control={control}
                  rules={{
                    required: { value: true, message: "Required" },
                    min: { value: 1, message: "Please enter a positive number" },
                    max: {
                      value: AVAILABLE_AMOUNT,
                      message: `It's better to have reasonable allocation for various budgets :) [Remaining value ${
                        watchBudgetType === "percentage"
                          ? `${AVAILABLE_AMOUNT}%`
                          : formatRupiah(AVAILABLE_AMOUNT)
                      }]`,
                    },
                  }}
                  render={({ field }) => (
                    <NumericFormat
                      {...field} // Spread the field props from Controller
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix={watchBudgetType === "rupiah" ? "Rp " : ""}
                      suffix={watchBudgetType === "percentage" ? "%" : ""}
                      customInput={Input}
                      value={
                        getValues(
                          watchBudgetType === "percentage" ? "percentage_amount" : "rupiah_amount"
                        ) || ""
                      }
                      onChange={event => {
                        setValue(
                          watchBudgetType === "percentage" ? "percentage_amount" : "rupiah_amount",
                          parseRupiah(event.target.value)
                        );
                      }}
                    />
                  )}
                />
                {(errors.percentage_amount || errors.rupiah_amount) && (
                  <div className="text-red-500 text-sm">
                    {errors?.percentage_amount?.message || errors?.rupiah_amount?.message}
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
