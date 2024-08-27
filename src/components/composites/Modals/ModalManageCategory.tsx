import { DialogFooter } from "@/components/ui/dialog";
import DialogModal from "../DialogModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLORS, UseDisclosureType } from "@/types/common";
import { Dispatch, useEffect, useState } from "react";
import { SetStateAction } from "jotai/vanilla";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Badge, Box } from "@radix-ui/themes";
import { capitalize } from "@/utils/common";
import { useForm } from "react-hook-form";
import { SearchableSelect } from "../SearchableSelect";
import { COLORS_OPTION } from "@/constants";

interface IModalManageCategory {
  disclosure: UseDisclosureType;
  handleSubmit: () => any;
  role: "delete" | "edit" | "create";
}

function ModalManageCategory({ disclosure, handleSubmit, role }: IModalManageCategory) {
  const {
    watch,
    register,
    handleSubmit: submitForm,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all",
  });

  const watchCategoryName = watch("category_title");

  const [selectedValue, setSelectedValue] = useState<COLORS>("gray");
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

  if (role === "delete")
    return (
      <DialogModal
        onOpenChange={disclosure.toggle}
        isOpen={disclosure.isOpen}
        title={`Delete Category`}
        desc="Are you sure?"
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
    <>
      <DialogModal
        isOpen={disclosure.isOpen}
        onOpenChange={disclosure.toggle}
        title={`${capitalize(role)} Category`}
      >
        <form onSubmit={submitForm(handleSubmit)}>
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Category Name
              </Label>
              <Input id="category_title" className="col-span-3" {...register("category_title")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="percentage" className="text-left">
                Percentage Amount
              </Label>
              <Box className="col-span-3 space-y-1">
                <Input
                  type="number"
                  id="percentage"
                  {...register("percentage", {
                    min: { value: 1, message: "Please enter a positive number" },
                    max: {
                      value: 70,
                      message: "It's better to have better allocation for various budgets :)",
                    },
                  })}
                />
                {errors.percentage && (
                  <div className="text-red-500 text-sm">{errors?.percentage?.message as any}</div>
                )}
              </Box>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Choose Color
              </Label>
              <div className="col-span-3">
                <SearchableSelect
                  data={processedColors}
                  selectedValue={selectedValue}
                  entity="Colors"
                  setSelectedValue={setSelectedValue}
                />
              </div>
            </div>
            <hr />
            <div className="flex gap-4">
              <div className="text-center text-lg font-semibold">Preview</div>
              <div className="flex">
                <Badge className="p-1 rounded-md text-sm" color={selectedValue}>
                  {watchCategoryName}
                </Badge>
              </div>
            </div>
            <hr />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    ></div>
                    <span className="ml-2"> Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogModal>
    </>
  );
}

export default ModalManageCategory;
