import { DialogFooter } from "@/components/ui/dialog";
import DialogModal from "../DialogModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseDisclosureType } from "@/types/common";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Box } from "@radix-ui/themes";
import { useForm } from "react-hook-form";

interface IModalEditIncome {
  disclosure: UseDisclosureType;
  handleSubmit: (formData: any) => any;
}

function ModalEditIncome({ disclosure, handleSubmit }: IModalEditIncome) {
  const { register, handleSubmit: submitForm } = useForm();
  return (
    <DialogModal
      onOpenChange={disclosure.toggle}
      isOpen={disclosure.isOpen}
      title="Edit Income"
      desc="Roughly estimate your income after tax. Then, we do the budgeting for you"
      size="xl"
    >
      <form onSubmit={submitForm(handleSubmit)}>
        <Box>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="income">Income (Rp)</Label>
            <Input {...register("income")} id="income" placeholder="Input your income" />
          </div>
        </Box>
        <DialogFooter className="mt-8">
          <Button type="submit" variant="outline" className="ml-auto">
            <CheckIcon className="mr-2 h-4 w-4" /> Submit
          </Button>
        </DialogFooter>
      </form>
    </DialogModal>
  );
}

export default ModalEditIncome;
