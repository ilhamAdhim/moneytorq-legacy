"use client";

import { AreaChartCustom } from "@/components/composites/Charts/AreaChart";
import { RecentTransaction } from "@/components/composites/recent-transaction";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyH3 } from "@/components/ui/Typography/Heading3";
import { MONTHS } from "@/constants";
import { ITransaction } from "@/types/transaction";
import { CreditCardIcon, DollarSignIcon, TrendingDownIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const dataStats = [
  {
    title: "Total Revenue",
    description: "+20.1% from last month",
    value: "$45,231.89",
    icon: <DollarSignIcon fontSize={12} color="gray" />,
  },
  {
    title: "Subscriptions",
    description: "+180.1% from last month",
    value: "+2350",
    icon: <UserIcon fontSize={12} color="gray" />,
  },
  {
    title: "Savings to Income Ratio",
    description: "+19% from last month",
    value: "+12,234",
    icon: <CreditCardIcon fontSize={12} color="gray" />,
  },
  {
    title: "Savings to Expense Ratio",
    description: "+201 since last month",
    value: "+573",
    icon: <TrendingDownIcon fontSize={12} color="gray" />,
  },
];

interface IOverviewScreen {
  dataTransaction: ITransaction[];
  dataSummary?: {
    user_id: string;
    total_income: number;
    total_expenses: number;
    month_name: string;
  }[];
}

function OverviewScreen({ dataSummary, dataTransaction }: IOverviewScreen) {
  const dataAreaChart = useMemo(() => {
    return dataSummary
      ?.sort((a, b) => {
        return (
          MONTHS.findIndex(item => item === a.month_name) -
          MONTHS.findIndex(item => item === b.month_name)
        );
      })
      .map(item => {
        const { month_name, total_income, total_expenses } = item;
        return {
          month: month_name,
          income: total_income,
          spent: total_expenses,
        };
      });
  }, [dataSummary]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dataStats.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex lg:flex-row flex-col gap-4">
        <Card className="lg:w-3/5 w-full">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 p-8 md:min-h-[400px] min-h-auto">
            <AreaChartCustom data={dataAreaChart} />
          </CardContent>
        </Card>
        <Card className="lg:w-2/5 w-full">
          <div className="flex space-between">
            <CardHeader className="grow">
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <div className="p-4">
              <Link href="/transaction">
                <Button className="my-auto bg-[var(--button-solid)]">See more</Button>
              </Link>
            </div>
          </div>
          <CardContent>
            <RecentTransaction
              data={dataTransaction.filter(item => item.transaction_type === "expenses")}
            />
            <Separator className="my-4" />
            <TypographyH3> Recent Income </TypographyH3>
            <RecentTransaction
              data={dataTransaction.filter(item => item.transaction_type === "income")}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default OverviewScreen;
