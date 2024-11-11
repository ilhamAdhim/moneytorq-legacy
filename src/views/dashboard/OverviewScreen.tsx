"use client";

import { AreaChartCustom } from "@/components/composites/Charts/AreaChart";
import { RecentTransaction } from "@/components/composites/recent-transaction";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyH3 } from "@/components/ui/Typography/Heading3";
import { MONTHS } from "@/constants";
import { ITransaction } from "@/types/transaction";
import { formatRupiah } from "@/utils/common";
import { CreditCardIcon, DollarSignIcon, TrendingDownIcon, UserIcon, Wallet } from "lucide-react";
import Link from "next/link";
import { ReactElement, useEffect, useMemo, useState } from "react";
interface IOverviewScreen {
  dataTransaction: ITransaction[];
  dataSummary?: {
    user_id: string;
    total_income: number;
    total_expenses: number;
    remaining_amount: number;
    month_name: string;
  }[];
}

interface IMappedDataStats {
  title: string;
  description: string;
  value: string;
  icon: ReactElement;
}

function OverviewScreen({ dataSummary, dataTransaction }: IOverviewScreen) {
  console.log("dataSummary", dataSummary);
  const [mappedDataStats, setMappedDataStats] = useState<IMappedDataStats[]>([]);
  const [isLoadingDataStats, setIsLoadingDataStats] = useState(true);

  useEffect(() => {
    setIsLoadingDataStats(true);
    if (dataSummary) {
      const lastSavingsToIncomeRatio = Math.round(
        (dataSummary[dataSummary.length - 1].remaining_amount /
          dataSummary[dataSummary.length - 1].total_income) *
          100
      );
      const prevSavingsToIncomeRatio = Math.round(
        (dataSummary[dataSummary.length - 2].remaining_amount /
          dataSummary[dataSummary.length - 2].total_income) *
          100
      );

      const lastSavingsToExpenseRatio = Math.round(
        (dataSummary[dataSummary.length - 1].remaining_amount /
          dataSummary[dataSummary.length - 1].total_expenses) *
          100
      );

      const prevSavingsToExpenseRatio = Math.round(
        (dataSummary[dataSummary.length - 2].remaining_amount /
          dataSummary[dataSummary.length - 2].total_expenses) *
          100
      );
      setMappedDataStats([
        {
          title: "Total Revenue",
          description: `${
            dataSummary[dataSummary.length - 1].remaining_amount >= 0 ? "+" : "-"
          }${formatRupiah(dataSummary[dataSummary.length - 1].remaining_amount)} from last month`,
          value: `${formatRupiah(
            dataSummary?.map(item => item.total_income).reduce((a, b) => a + b, 0)
          )}`,
          icon: <DollarSignIcon fontSize={12} color="gray" />,
        },
        {
          title: "Total Expense",
          description: `${
            dataSummary[dataSummary.length - 1].remaining_amount >= 0 ? "+" : "-"
          }${formatRupiah(dataSummary[dataSummary.length - 1].total_expenses)} from last month`,
          value: `${formatRupiah(
            dataSummary?.map(item => item.total_expenses).reduce((a, b) => a + b, 0)
          )}`,
          icon: <UserIcon fontSize={12} color="gray" />,
        },
        {
          title: "Savings to Income Ratio",
          description: `${Math.round(
            (lastSavingsToIncomeRatio / prevSavingsToIncomeRatio) * 100
          )}% from last month`,
          value: `${lastSavingsToIncomeRatio}%`,
          icon: <CreditCardIcon fontSize={12} color="gray" />,
        },
        {
          title: "Savings to Expense Ratio",
          description: `${Math.round(
            (lastSavingsToExpenseRatio / prevSavingsToExpenseRatio) * 100
          )}% from last month`,
          value: `${lastSavingsToExpenseRatio}%`,
          icon: <Wallet fontSize={12} color="gray" />,
        },
      ]);
      setIsLoadingDataStats(false);
    }
  }, [dataSummary]);

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
        {!isLoadingDataStats &&
          mappedDataStats.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold`}>{item.value}</div>
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
