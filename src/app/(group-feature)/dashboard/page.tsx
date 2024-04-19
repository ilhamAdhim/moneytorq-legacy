import { Metadata } from "next"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/composites/date-range-picker"
import { Overview } from "@/components/composites/overview"
import { MainNav } from "@/components/composites/main-nav"
import { RecentTransaction } from "@/components/composites/recent-transaction"
import { Search } from "@/components/composites/search"
import TeamSwitcher from "@/components/composites/team-switcher"
import OverviewScreen from "@/views/dashboard/OverviewScreen"
// import { UserNav } from "@/app/(app)/examples/dashboard/components/user-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div> */}
     
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
                <OverviewScreen />
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident corrupti quia, perferendis omnis quas, vel asperiores fuga incidunt animi rem culpa architecto quae aspernatur dolores esse neque sint obcaecati! Hic?
            </TabsContent>
          </Tabs>
      </div>
    </>
  )
}