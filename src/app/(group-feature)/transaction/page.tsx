import TransactionView from "./TransactionView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transaction",
    description: "Example dashboard app built using the components.",
  }

function TransactionPage() {
    return (
        <TransactionView />
    );
}

export default TransactionPage;