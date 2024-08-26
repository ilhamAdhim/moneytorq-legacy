import { DialogFooter } from "@/components/ui/dialog";
import DialogModal from "../DialogModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseDisclosureType } from "@/types/common";
import { Dispatch } from "react";
import { SetStateAction } from "jotai/vanilla";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Box } from "@radix-ui/themes";
import { capitalize } from "@/utils/common";

interface IModalManageCategory {
    disclosure: UseDisclosureType
    handleSubmit: () => any
    role: "delete" | "edit" | "create"
}

function ModalManageCategory({ disclosure, handleSubmit, role }: IModalManageCategory) {

    if (role === "delete") return (
        <DialogModal onOpenChange={disclosure.toggle}
            isOpen={disclosure.isOpen}
            title={`Delete Category`}
            desc="Are you sure?"
        >
            <DialogFooter className="mt-8">
                <Button onClick={disclosure.close} variant="outline" className="ml-auto">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="outline" className="ml-auto">
                    <CheckIcon className="mr-2 h-4 w-4" />  Delete
                </Button>
            </DialogFooter>
        </DialogModal>
    )

    return (
        <DialogModal
            onOpenChange={disclosure.toggle}
            isOpen={disclosure.isOpen}
            title={`${capitalize(role)} Category`}
            desc="Roughly estimate your income after tax. Then, we do the budgeting for you">
            <form onSubmit={handleSubmit}>
                <Box>
                    <div className="flex gap-2 flex-col space-y-1.5">
                        <Label htmlFor="income">Income (Rp)</Label>
                        <Input id="income" type="income" placeholder="Input your income" />
                    </div>
                </Box>
                <DialogFooter className="mt-8">
                    <Button type="submit" variant="outline" className="ml-auto">
                        <CheckIcon className="mr-2 h-4 w-4" />  Submit
                    </Button>
                </DialogFooter>
            </form>
        </DialogModal>
    );
}

export default ModalManageCategory;