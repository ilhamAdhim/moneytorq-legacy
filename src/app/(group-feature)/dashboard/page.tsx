import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/composites/DateRangePicker";
import OverviewScreen from "@/views/dashboard/OverviewScreen";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getTransactions } from "@/actions/transactions";

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const currentYear = now.getFullYear;

  const { data: dataExpenses } = await getTransactions({
    limit: 5,
    orderBy: "amount",
    type: "expenses",
  });

  const { data: dataIncome } = await getTransactions({
    limit: 2,
    orderBy: "amount",
    type: "income",
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Howdy, {user?.user_metadata?.user_name ?? user?.user_metadata?.full_name ?? "User"}!
        </h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="md:inline flex md:justify-start justify-center">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverviewScreen dataTransaction={[...(dataExpenses || []), ...(dataIncome || [])]} />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident corrupti quia,
          perferendis omnis quas, vel asperiores fuga incidunt animi rem culpa architecto quae
          aspernatur dolores esse neque sint obcaecati! Hic?
        </TabsContent>
      </Tabs>
    </>
  );
}
