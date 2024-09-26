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
import { capitalize, formatRupiah } from "@/utils/common";
import { LoaderCircle } from "lucide-react";
import { memo } from "react";

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
  data?: any[];
  isLoading?: boolean;
}

function RadarChartCustom({ data, isLoading }: IRadarChartCustom) {
  if (data?.length === 0)
    return (
      <Box className="flex h-[400px] w-full">
        {" "}
        {isLoading ? (
          <LoaderCircle />
        ) : (
          <Text className="m-auto font-normal text-center text-muted-foreground">
            Please input your transactions on 3 different budgets{" "}
          </Text>
        )}
      </Box>
    );
  return (
    <>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square md:h-[400px] h-[350px]">
        <RadarChart data={data} margin={{}}>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-[200px]"
                formatter={(value, name, item) => {
                  return (
                    <>
                      <div
                        className="h-3 w-1.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": item.color || "",
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

export default memo(RadarChartCustom);
