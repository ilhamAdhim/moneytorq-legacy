"use client";

import DialogModal from "../DialogModal";
import { UseDisclosureType } from "@/types/common";
import { ITransaction } from "@/types/transaction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { NumericFormat } from "react-number-format";
import { Box } from "@radix-ui/themes";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { CheckIcon } from "@radix-ui/react-icons";
import { ICategory } from "@/types/category";
import { DatePicker } from "../DatePicker";
import { usePathname } from "next/navigation";
import { formatRupiah, parseRupiah } from "@/utils/common";

export interface IFormDataManageTransaction {
  amount: string;
  title: string;
  date: string;
  description: string;
  category_id: number;
  category_title?: string;
  type: "income" | "expenses";
}

interface IModalManageTransaction {
  isExpense?: boolean;
  disclosure: UseDisclosureType;
  handleSubmit: (formData: any) => void;
  role: "delete" | "edit" | "create";
  selectedTransaction?: ITransaction | null;
  categoryList?: ICategory[];
}

function ModalManageTransaction({
  isExpense = true,
  disclosure,
  handleSubmit,
  role,
  selectedTransaction,
  categoryList,
}: IModalManageTransaction) {
  const path = usePathname();

  const useFormAttributes = useForm<FieldValues>({
    mode: "all",
    ...(selectedTransaction && {
      defaultValues: {
        amount: selectedTransaction.amount,
        title: selectedTransaction.title,
        date: selectedTransaction.date,
        description: selectedTransaction.description,
        type: isExpense ? selectedTransaction.transaction_type : "income",
        category_id: selectedTransaction.category_id,
      },
    }),
  });

  const {
    watch,
    register,
    control,
    setValue,
    getValues,
    handleSubmit: submitForm,
    formState: { isValid, errors, isSubmitting },
  } = useFormAttributes;

  if (role === "delete")
    return (
      <DialogModal
        onOpenChange={disclosure.toggle}
        isOpen={disclosure.isOpen}
        title={`Delete Transaction`}
        desc={`Are you sure want to delete ${selectedTransaction?.title}?`}
      >
        <DialogFooter className="mt-8">
          <Button onClick={disclosure.close} variant="outline" className="ml-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="outline" className="ml-auto">
            <CheckIcon className="mr-2 h-4 w-4" /> Delete
          </Button>
        </DialogFooter>
      </DialogModal>
    );

  return (
    <DialogModal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.toggle}
      title={`${selectedTransaction ? "Edit" : "Create"} Transaction Records`}
    >
      <form onSubmit={submitForm(handleSubmit)}>
        <div className="grid gap-4 pt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Title
            </Label>
            <Box className="col-span-3 space-y-1">
              <Input
                id="title"
                className="col-span-3"
                {...register("title", {
                  required: { value: true, message: "Required" },
                })}
              />
              {errors.title && (
                <div className="text-red-500 text-sm">{errors?.title?.message as any}</div>
              )}
            </Box>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="percentage" className="text-left">
              IDR Amount
            </Label>
            <Box className="col-span-3 space-y-1">
              {/* <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                {...register("amount", {
                  required: { value: true, message: "Required" },
                  min: { value: 1, message: "Please enter a positive number" },
                })}
                customInput={Input}
              /> */}

              <Controller
                name="amount"
                control={control}
                rules={{
                  required: true,
                  min: { value: 1, message: "Please enter a positive number" },
                }}
                render={({ field }) => (
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    customInput={Input}
                    {...field} // Spread the field props from Controller
                    value={getValues("amount") || ""}
                    onChange={event => {
                      setValue("amount", parseRupiah(event.target.value));
                    }}
                  />
                )}
              />
              {errors.amount && (
                <div className="text-red-500 text-sm">{errors?.amount?.message as any}</div>
              )}
            </Box>
          </div>
          {isExpense && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Type
              </Label>
              <div className="col-span-3">
                <Controller
                  name="type"
                  control={control as any}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Transaction Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="income">Income</SelectItem>
                          {!path.includes("budgeting") && (
                            <SelectItem value="expenses">Expenses</SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Category
            </Label>
            <div className="col-span-3">
              <Controller
                name="category_id"
                control={control as any}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categoryList?.map(item => (
                          <SelectItem key={item.id} value={`${item.id}`}>
                            {item.category_title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-left">
              Transaction Date
            </Label>
            <div className="col-span-3">
              <DatePicker useFormAttributes={useFormAttributes} />
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
    </DialogModal>
  );
}

export default ModalManageTransaction;
