"use client";
import DialogModal from "@/components/composites/DialogModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchableSelect } from "../SearchableSelect";
import { COLORS_OPTION } from "@/constants";
import { Badge } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { COLORS } from "@/types/common";
import { useAtom } from "jotai/react";
import { categories } from "@/store";

interface IModalNewCategories {
  isModalOpenNewCategories: boolean;
  setIsModalOpenNewCategories: Dispatch<SetStateAction<boolean>>;
}

function ModalNewCategory({
  isModalOpenNewCategories,
  setIsModalOpenNewCategories,
}: IModalNewCategories) {
  const { register, handleSubmit, watch } = useForm();
  const watchCategoryName = watch("category_title");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryList, setCategories] = useAtom(categories);

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

  const onSubmit = (formData: any) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setCategories(prev => [
        ...prev,
        {
          id: Math.floor(Math.random() * 1000),
          ...formData,
          colorBadge: selectedValue,
        },
      ]);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <DialogModal
      title="Create New Category"
      isOpen={isModalOpenNewCategories}
      onOpenChange={setIsModalOpenNewCategories}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <Input
              type="number"
              id="percentage"
              className="col-span-3"
              {...register("percentage")}
            />
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
  );
}

export default ModalNewCategory;
