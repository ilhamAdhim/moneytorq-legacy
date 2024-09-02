"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai/react";
import { transactionRecords } from "@/store";
import { MONTHS } from "@/constants";
import { isAfter } from "date-fns";
import TableTransactionView from "./TableTransaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useScreenWidth from "@/hooks/useScreenWidth";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ModalTransaction from "@/components/composites/Modals/ModalTransaction";
import { Flex } from "@radix-ui/themes";
import { RadarChartCustom } from "@/components/composites/Charts/RadarChart";
import { ICategoryResponse } from "@/types/categoryTypes";
import { ITransaction } from "@/types/transactionTypes";

const availableYearsHistory = [2024, 2023, 2022];

interface ITransactionView {
  dataTransaction?: ITransaction[];
}

function TransactionView({ dataTransaction }: ITransactionView) {
  console.log("dataTransaction", dataTransaction);
  const records = useAtomValue(transactionRecords);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [isModalAddRecordOpen, setIsModalAddRecordOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const { isSmallViewport } = useScreenWidth();

  const dataRecordInYear = useMemo(() => {
    records.filter(item => item.date.includes(selectedYear));
  }, [selectedYear]);

  const processMonths = useMemo(() => {
    return MONTHS.map((month, idx) => {
      return {
        value: month,
        isAvailable: isAfter(new Date(), new Date(new Date(selectedYear).getFullYear(), idx, 1)),
      };
    });
  }, [selectedYear]);

  // TODO: Bug
  /* 
        1. Selecting 2023 -> Q1 - Q4 Available
        2. Return to 2024 -> Q4 is selected
        3. Expected: Q4 is not yet available, and returns selected to Q2 
    */

  useEffect(() => {
    console.log(processMonths, selectedYear);
  }, [processMonths, selectedYear]);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Transaction</h2>
        <div className="flex items-center space-x-2 gap-4">
          <Button onClick={() => setIsModalAddRecordOpen(true)} className="flex gap-2">
            <PlusIcon color="white" />
            <div className="my-auto text-white">Add Records</div>
          </Button>

          <ModalTransaction isOpen={isModalAddRecordOpen} onOpenChange={setIsModalAddRecordOpen} />
        </div>
      </div>
      <Flex gap="4" justify="between">
        <Select onValueChange={val => setSelectedYear(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year </SelectLabel>
              {availableYearsHistory.map(item => (
                <SelectItem key={item} value={`${item}`}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {isSmallViewport ? (
          <Select onValueChange={val => setSelectedMonth(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel> Month </SelectLabel>
                {processMonths.map((item, idx) => (
                  <SelectItem key={idx} value={item.value}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Tabs defaultValue={selectedMonth} className="space-y-4">
            <TabsList>
              {processMonths.map((item, idx) => (
                <TabsTrigger
                  // ? Especially this textContent
                  // @ts-ignore-next-line
                  onClick={val => setSelectedMonth(val.target.textContent)}
                  disabled={!item.isAvailable}
                  key={idx}
                  value={`${item.value}`}
                >
                  {item.value}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </Flex>

      <div className={`flex ${isSmallViewport ? "flex-col" : "flex-row"} gap-4`}>
        <Card className={`${isSmallViewport ? "w-full" : "w-2/5"}`}>
          <CardHeader>
            <CardTitle>
              Money Spent at {selectedMonth} {selectedYear}{" "}
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[400px]">
            <RadarChartCustom />
          </CardContent>
        </Card>
        <Card className={`${isSmallViewport ? "w-full" : "w-3/5"}`}>
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
          </CardHeader>
          <CardContent className="px-8">
            <TableTransactionView dataTransaction={dataTransaction || []} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default TransactionView;
