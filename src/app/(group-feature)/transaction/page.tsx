"use client"

import DialogModal from "@/components/composites/dialog-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai/react";
import { transactionRecords } from "@/store";
import { QUARTERS, QUARTERS_MONTHS } from "@/constants";
import { isAfter, isSameQuarter, monthsToQuarters } from "date-fns";
import { DataTableDemo } from "@/components/composites/data-table";

const availableYearsHistory = [2024, 2023, 2022]

function TransactionPage() {
    const records = useAtomValue(transactionRecords)
    const [selectedYear, setSelectedYear] = useState("2024")

    const dataRecordInYear = useMemo(() => {
        records.filter(item => item.date.includes(selectedYear))
    }, [selectedYear])

    const processQuarters = useMemo(() => {
        return QUARTERS_MONTHS.map(monthIndex => {
            return {
                value: `Q${monthsToQuarters(monthIndex)}`,
                isAvailable:
                    isSameQuarter(new Date(), new Date(new Date(selectedYear).getFullYear(), monthIndex - 1, 1))
                    || isAfter(new Date(), new Date(new Date(selectedYear).getFullYear(), monthIndex - 1, 1))
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
        console.log(processQuarters, selectedYear)
    }, [processQuarters, selectedYear]);

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Transaction</h2>
                <div className="flex items-center space-x-2 gap-4">
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
                    <DialogModal title="Add Records" desc="Lorem ipsum">
                        {/* <>Test modal</> */}
                    </DialogModal>
                </div>
            </div >
            <Tabs defaultValue="Q1" className="space-y-4">
                <TabsList>
                    {processQuarters.map((item, idx) =>
                        <TabsTrigger disabled={!item.isAvailable} key={idx} value={`${item.value}`}>
                            {item.value}
                        </TabsTrigger>
                    )}
                </TabsList>
                {QUARTERS.map((item, idx) => (
                    <TabsContent key={idx} value={`${item}`} className="space-y-4">
                        {selectedYear} {item} content
                    </TabsContent>
                ))}
            </Tabs>

            <DataTableDemo />
        </>
    );
}

export default TransactionPage;