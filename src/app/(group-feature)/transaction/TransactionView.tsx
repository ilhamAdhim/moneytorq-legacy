"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai/react";
import { transactionRecords } from "@/store";
import { MONTHS } from "@/constants";
import { isAfter } from "date-fns";
import TableTransactionView from "./TableTransaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useScreenWidth from "@/hooks/useScreenWidth";
import PieChartSpent from "./PiechartSpent";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ModalTransaction from "@/components/composites/Modals/ModalTransaction";

const data = [
    {
        "id": "c",
        "label": "c",
        "value": 152,
        "color": "hsl(222, 70%, 50%)"
    },
    {
        "id": "rust",
        "label": "rust",
        "value": 183,
        "color": "hsl(50, 70%, 50%)"
    },
    {
        "id": "python",
        "label": "python",
        "value": 101,
        "color": "hsl(271, 70%, 50%)"
    },
    {
        "id": "haskell",
        "label": "haskell",
        "value": 26,
        "color": "hsl(42, 70%, 50%)"
    },
    {
        "id": "stylus",
        "label": "stylus",
        "value": 496,
        "color": "hsl(5, 70%, 50%)"
    }
]

const availableYearsHistory = [2024, 2023, 2022]
function TransactionView() {
    const records = useAtomValue(transactionRecords)
    const [selectedYear, setSelectedYear] = useState("2024")
    const [isModalAddRecordOpen, setIsModalAddRecordOpen] = useState(false)

    const [selectedMonth, setSelectedMonth] = useState("")
    const { isSmallViewport } = useScreenWidth()

    useEffect(() => {
        console.log(isSmallViewport)
    }, [isSmallViewport]);

    const dataRecordInYear = useMemo(() => {
        records.filter(item => item.date.includes(selectedYear))
    }, [selectedYear])

    const processMonths = useMemo(() => {
        return MONTHS.map((month, idx) => {
            return {
                value: month,
                isAvailable: isAfter(new Date(), new Date(new Date(selectedYear).getFullYear(), idx, 1))
            }
        })
    }, [selectedYear])

    // TODO: Bug
    /* 
        1. Selecting 2023 -> Q1 - Q4 Available
        2. Return to 2024 -> Q4 is selected
        3. Expected: Q4 is not yet available, and returns selected to Q2 
    */

    useEffect(() => {
        console.log(processMonths, selectedYear)
    }, [processMonths, selectedYear]);

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Transaction</h2>
                <div className="flex items-center space-x-2 gap-4">
                    <Button onClick={() => setIsModalAddRecordOpen(true)} className="flex gap-2">
                        <PlusIcon color="white" />
                        <div className="my-auto text-white">
                            Add Records
                        </div>
                    </Button>

                    <ModalTransaction
                        isOpen={isModalAddRecordOpen}
                        onOpenChange={setIsModalAddRecordOpen}
                    />
                </div>
            </div >
            <Select onValueChange={(val) => setSelectedYear(val)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Year </SelectLabel>
                        {availableYearsHistory.map(item => (
                            <SelectItem key={item} value={`${item}`}>{item}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Tabs defaultValue="Q1" className="space-y-4">
                <TabsList>
                    {processMonths.map((item, idx) =>
                        <TabsTrigger
                            // onClick={(test) => console.log(test.target.value)}
                            disabled={!item.isAvailable} key={idx} value={`${item.value}`}>
                            {item.value}
                        </TabsTrigger>
                    )}
                </TabsList>
                {processMonths.map((item, idx) => (
                    <TabsContent key={idx} value={`${item}`} className="space-y-4">
                        {selectedYear} {item.value} content
                    </TabsContent>
                ))}
            </Tabs>

            <div className={`flex ${isSmallViewport ? "flex-col" : "flex-row"} gap-4`}>
                <Card className={`${isSmallViewport ? "w-full" : "w-2/5"}`}>
                    <CardHeader>
                        <CardTitle>Money Spent at {selectedYear}, Month ... </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2 h-[500px]">
                        <PieChartSpent data={data} />
                    </CardContent>
                </Card>
                <Card className={`${isSmallViewport ? "w-full" : "w-3/5"}`}>
                    <CardHeader>
                        <CardTitle>Transaction Records</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8">
                        <TableTransactionView />
                    </CardContent>
                </Card>
            </div>

        </>
    );
}

export default TransactionView;