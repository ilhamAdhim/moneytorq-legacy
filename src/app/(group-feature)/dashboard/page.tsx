import OverviewScreen from "@/views/dashboard/OverviewScreen";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getFinanceSummary, getTransactions } from "@/actions/transactions";
import { Metadata } from "next";
import { format, subDays } from "date-fns";

export const metadata: Metadata = {
  title: "MoneytorQ | Dashboard",
  icons: {
    icon: "/moneytorq.png",
  },
};

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = format(new Date(), "yyyy-MM-dd");
  const last30Days = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const { data: dataExpenses } = await getTransactions({
    limit: 5,
    orderBy: "amount",
    type: "expenses",
    startDate: last30Days,
    endDate: now,
  });

  const { data: dataIncome } = await getTransactions({
    limit: 3,
    orderBy: "amount",
    type: "income",
    startDate: last30Days,
    endDate: now,
  });

  const { data: dataSummary } = await getFinanceSummary();
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Howdy, {user?.user_metadata?.user_name ?? user?.user_metadata?.full_name ?? "User"}!
        </h2>
        {/* <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div> */}
      </div>

      <OverviewScreen
        dataSummary={dataSummary || []}
        dataTransaction={[...(dataExpenses || []), ...(dataIncome || [])]}
      />
    </>
  );
}
