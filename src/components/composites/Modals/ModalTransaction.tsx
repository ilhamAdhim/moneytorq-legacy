import { Dispatch, SetStateAction } from "react";
import DialogModal from "../dialog-modal";

interface IModalTransaction {
    isOpen: boolean,
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

function ModalTransaction({ isOpen, onOpenChange }: IModalTransaction) {
    return (
        <>
            <DialogModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="Add Transaction Records"
                desc="Lorem ipsum">
                    <>Hello transactionRecords</>
            </DialogModal>
        </>);
}

export default ModalTransaction;