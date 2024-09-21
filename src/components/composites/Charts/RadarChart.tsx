"use client";
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Box } from "@radix-ui/themes";
const chartData = [
  { category: "Transportation", budget: 186, real: 80 },
  { category: "Groceries", budget: 305, real: 200 },
  { category: "Business", budget: 237, real: 120 },
  { category: "Personal", budget: 73, real: 190 },
  { category: "Entertainment", budget: 209, real: 130 },
  { category: "June", budget: 314, real: 440 },
];
const chartConfig = {
  budget: {
    label: "Budget",
    color: "var(--chart-1))",
  },
  real: {
    label: "Real",
    color: "var(--chart-10))",
  },
} satisfies ChartConfig;

interface IRadarChartCustom {
  title?: string;
  desc?: string;
}

export function RadarChartCustom({
  title = "Radar Chart - Legend",
  desc = "Showing total visitors for the last 6 months",
}: IRadarChartCustom) {
  return (
    <>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-full">
        <RadarChart
          data={chartData}
          margin={{
            top: 30,
            bottom: -10,
          }}
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <PolarAngleAxis dataKey="category" tickCount={chartData.length} />
          <PolarGrid gridType="circle" />
          <Radar dataKey="budget" fill="var(--color-budget)" fillOpacity={0.6} />
          <Radar dataKey="real" fill="var(--color-expense)" />
          <ChartLegend className="mt-8" content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
      {/* <Box className="flex-col gap-2 pt-4 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    January - June 2024
                </div>
            </Box> */}
    </>
  );
}
