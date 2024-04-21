import DialogModal from "@/components/composites/dialog-modal";
import { PlusIcon } from "lucide-react";
import TransactionView from "./TransactionView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transaction",
    description: "Example dashboard app built using the components.",
  }

function TransactionPage() {
    return (
        <>
        <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Transaction</h2>
                <div className="flex items-center space-x-2 gap-4">
                    <DialogModal title={
                        <div className="flex gap-2">
                            <PlusIcon />
                            <div className="my-auto">
                                Add Records
                            </div>
                        </div>}
                        desc="Lorem ipsum">
                        {/* <>Testing</> */}
                    </DialogModal>
                </div>
            </div >
            <TransactionView />
        </>
    );
}

export default TransactionPage;