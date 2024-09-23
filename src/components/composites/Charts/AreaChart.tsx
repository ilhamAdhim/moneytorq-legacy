"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalize, formatRupiah } from "@/utils/common";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface IOverview {
  data: any;
}

export function AreaChartCustom({ data }: IOverview) {
  return (
    <>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={value => value.slice(0, 3)}
          />
          <YAxis tickSize={5} tickFormatter={value => `${formatRupiah(value as any)}`} />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-[100px] md:w-[200px]"
                indicator="line"
                formatter={(value, name, item) => {
                  return (
                    <>
                      <div
                        className="h-3 w-1.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": item.stroke || "",
                          } as React.CSSProperties
                        }
                      />
                      {capitalize(name as string)}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {formatRupiah(value as number)}
                      </div>
                    </>
                  );
                }}
              />
            }
          />
          <Area
            dataKey="income"
            type="natural"
            fill="var(--color-budget)"
            fillOpacity={0.4}
            stroke="var(--color-budget)"
            stackId="a"
          />
          <Area
            dataKey="spent"
            type="natural"
            fill="var(--color-expense)"
            fillOpacity={0.4}
            stroke="var(--color-expense)"
            stackId="b"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </>
  );
}
