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

interface IDrawerEditIncome {
  disclosure: UseDisclosureType;
  handleSubmit: (formData: any) => any;
}

function DrawerEditIncome({ disclosure, handleSubmit }: IDrawerEditIncome) {
  const { isSmallViewport } = useViewports();
  const { register, handleSubmit: submitForm } = useForm();
  return (
    <Sheet onOpenChange={disclosure.toggle} open={disclosure.isOpen}>
      <SheetContent side={isSmallViewport ? "bottom" : "right"} className="w-full lg:w-[800px]">
        <SheetHeader>
          <SheetTitle>Edit Income</SheetTitle>
          <SheetDescription>
            Roughly estimate your income after tax. Then, we do the budgeting for you
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={submitForm(handleSubmit)}>
          <Box className="my-4">
            <div className="flex flex-col space-y-4">
              <Label htmlFor="income">Income (Rp)</Label>
              <Input {...register("income")} id="income" placeholder="Input your income" />
            </div>
          </Box>
        </form>
        <SheetFooter className="my-4">
          <SheetClose asChild>
            <Button type="submit" variant="outline" className="ml-auto">
              <CheckIcon className="mr-2 h-4 w-4" /> Submit
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default DrawerEditIncome;
