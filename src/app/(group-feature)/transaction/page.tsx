import { getTransactions } from "@/actions/transactions";
import TransactionView from "./TransactionView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MoneytorQ | Transaction",
  icons: {
    icon: "/moneytorq.png",
  },
};
async function TransactionPage() {
  const now = new Date();
  const currentYear = now.getFullYear;

  const { data } = await getTransactions({
    // startDate: `01-01-${currentYear}`,
    // endDate: format(now, "dd-MM-yyyy"),
  });
  return <TransactionView dataTransaction={data || []} />;
}

export default TransactionPage;
