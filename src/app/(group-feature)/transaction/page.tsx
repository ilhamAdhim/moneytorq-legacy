import { getRadarChartExpenses, getTransactions } from "@/actions/transactions";
import TransactionView from "./TransactionView";
import { Metadata } from "next";
import { MONTHS } from "@/constants";
import { format, lastDayOfMonth } from "date-fns";

export const metadata: Metadata = {
  title: "MoneytorQ | Transaction",
  icons: {
    icon: "/moneytorq.png",
  },
};
async function TransactionPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const convertToMonthNumber = now.getMonth() + 1;
  const month =
    Number(convertToMonthNumber) >= 10 ? `${convertToMonthNumber}` : `0${convertToMonthNumber}`;
  const startDate = format(
    new Date(`${currentYear || new Date().getUTCFullYear()}-${month}-01`),
    "yyyy-MM-dd"
  );
  const endDate = format(lastDayOfMonth(startDate), "yyyy-MM-dd");

  const { data } = await getTransactions({ startDate, endDate });
  const { data: dataRadarChart } = await getRadarChartExpenses({ startDate, endDate });
  return <TransactionView dataTransaction={data || []} dataRadarChart={dataRadarChart || []} />;
}

export default TransactionPage;
