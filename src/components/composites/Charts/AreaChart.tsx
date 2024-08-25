"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { formatRupiah } from "@/utils/common"
const chartData = [
    { month: "January", income: 186, spent: 80 },
    { month: "February", income: 305, spent: 200 },
    { month: "March", income: 237, spent: 120 },
    { month: "April", income: 73, spent: 190 },
    { month: "May", income: 209, spent: 130 },
    { month: "June", income: 214, spent: 140 },
]

const chartConfig = {
    income: {
        label: "Income",
        color: "hsl(var(--chart-1))",
    },
    spent: {
        label: "Spent",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

interface IOverview {
    data: any
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
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis tickSize={5} tickFormatter={(value) => `${formatRupiah(value as any)}`} />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                        dataKey="income"
                        type="natural"
                        fill="var(--color-income)"
                        fillOpacity={0.4}
                        stroke="var(--color-income)"
                        stackId="a"
                    />
                    <Area
                        dataKey="spent"
                        type="natural"
                        fill="var(--color-spent)"
                        fillOpacity={0.4}
                        stroke="var(--color-spent)"
                        stackId="a"
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ChartContainer>
        </>
    )
}
