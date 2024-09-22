"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Box, Text } from "@radix-ui/themes";
const chartData = [
  { category: "Transportation", budget: 186, expenses: 80 },
  { category: "Groceries", budget: 305, expenses: 200 },
  { category: "Business", budget: 237, expenses: 120 },
  { category: "Personal", budget: 73, expenses: 190 },
  { category: "Entertainment", budget: 209, expenses: 130 },
  { category: "June", budget: 314, expenses: 440 },
];
const chartConfig = {
  budget: {
    label: "Budget",
    color: "var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-10))",
  },
} satisfies ChartConfig;

interface IRadarChartCustom {
  title?: string;
  desc?: string;
  data?: any[];
}

export function RadarChartCustom({
  title = "Radar Chart - Legend",
  desc = "Showing total visitors for the last 6 months",
  data,
}: IRadarChartCustom) {
  if (data?.length === 0)
    return (
      <Box className="flex h-full w-full">
        {" "}
        <Text className="m-auto font-normal text-center">
          Please input your transactions on 3 different budgets{" "}
        </Text>{" "}
      </Box>
    );
  return (
    <>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
        <RadarChart data={data}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <PolarAngleAxis dataKey="category" />
          <PolarGrid gridType="circle" />
          <Radar dataKey="budget" fill="var(--color-budget)" fillOpacity={0.6} />
          <Radar dataKey="expenses" fill="var(--color-expense)" fillOpacity={0.75} />
          <ChartLegend className="mt-8" content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
    </>
  );
}
