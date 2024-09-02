import { getTransactions } from "@/actions/transactions";
import TransactionView from "./TransactionView";
import { Metadata } from "next";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Transaction",
  description: "Example dashboard app built using the components.",
};

async function TransactionPage() {
  const now = new Date();
  const currentYear = now.getFullYear;

  const { data } = await getTransactions({
    // startDate: `01-01-${currentYear}`,
    // endDate: format(now, "dd-MM-yyyy"),
  });
  console.log("data new 77 ", data);
  return <TransactionView dataTransaction={data || []} />;
}

export default TransactionPage;
