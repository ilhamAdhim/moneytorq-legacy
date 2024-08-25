"use client"
import CategoryCards from "@/components/composites/Cards/CategoryCards";
import { RadarChartCustom } from "@/components/composites/Charts/RadarChart";
import ModalEditIncome from "@/components/composites/Modals/ModalEditIncome";
import ModalManageCategory from "@/components/composites/Modals/ModalManageCategory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyH4 } from "@/components/ui/Typography/Heading4";
import { MONTHS } from "@/constants";
import { useDisclosure } from "@/hooks/useDisclosure";
import useSmallViewport from "@/hooks/useScreenWidth";
import { categories } from "@/store";
import { ICategory } from "@/types/categoryTypes";
import { formatRupiah } from "@/utils/common";
import { Box, Flex } from "@radix-ui/themes";
import { isAfter } from "date-fns";
import { useAtomValue } from "jotai/react";
import { DollarSignIcon, UserIcon, CreditCardIcon, TrendingDownIcon, Edit2Icon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

const dataStats = [
    {
        title: "Total Revenue",
        description: "+20.1% from last month",
        value: "$45,231.89",
        icon: <DollarSignIcon fontSize={12} color="gray" />
    },
    {
        title: "Subscriptions",
        description: "+180.1% from last month",
        value: "+2350",
        icon: <UserIcon fontSize={12} color="gray" />
    },
    {
        title: "Transaction",
        description: "+19% from last month",
        value: "+12,234",
        icon: <CreditCardIcon fontSize={12} color="gray" />
    },
    {
        title: "Active Now",
        description: "+201 since last month",
        value: "+573",
        icon: <TrendingDownIcon fontSize={12} color="gray" />
    },

]
const availableYearsHistory = [2024, 2023, 2022]


function BudgetingPage() {
    const { isSmallViewport } = useSmallViewport()
    const categoryList = useAtomValue(categories)
    const [selectedYear, setSelectedYear] = useState("2024")
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()])
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

    const processMonths = useMemo(() => {
        return MONTHS.map((month, idx) => {
            return {
                value: month,
                isAvailable: isAfter(new Date(), new Date(new Date(selectedYear).getFullYear(), idx, 1))
            }
        })
    }, [selectedYear])

    const modalEditIncome = useDisclosure()
    const modalManageCategory = useDisclosure()

    const [valueIncome, setValueIncome] = useState(0)

    const handleSubmit = () => {
        console.log("submitted")
        // TODO: Hit Supabase edit income
        // ...
    }

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Budgeting</h2>
            </div>

            <Flex gap="4" justify="between" className="flex-row">
                <Select onValueChange={(val) => setSelectedYear(val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Year" />
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

                {isSmallViewport ?
                    (<Select onValueChange={(val) => setSelectedMonth(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel> Month </SelectLabel>
                                {processMonths.map((item, idx) => (
                                    <SelectItem key={idx} value={item.value}>{item.value}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>)
                    :
                    (<Tabs defaultValue={selectedMonth} className="space-y-4">
                        <TabsList>
                            {processMonths.map((item, idx) =>
                                <TabsTrigger
                                    // ? Especially this textContent 
                                    // @ts-ignore-next-line
                                    onClick={(val) => setSelectedMonth(val.target.textContent)}
                                    disabled={!item.isAvailable} key={idx} value={`${item.value}`}>
                                    {item.value}
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </Tabs>)
                }
            </Flex>

            <Flex gap="4" className="justify-between md:justify-start">
                <Box className="my-auto">
                    <TypographyH4> Fixed Income </TypographyH4>
                </Box>
                <Flex gap="4">
                    <div className="my-auto">
                        <Badge className="p-1 rounded-lg" color="hsl(50, 70%, 50%)">
                            {formatRupiah(8000000)}
                        </Badge>
                    </div>
                    <Button className="mx-auto" variant="outline" onClick={modalEditIncome.open}>
                        <Edit2Icon className="w-4" size="icon" />
                    </Button>
                </Flex>
            </Flex>

            <Flex className="flex-col sm:flex-row" gap="8">
                <Box className="w-full sm:w-1/3">
                    <RadarChartCustom />
                </Box>
                <Box className="w-full sm:w-2/3">
                    <Flex justify="between">
                        <h2 className="my-auto text-xl font-bold tracking-tight">Categories</h2>
                        <Button size={isSmallViewport ? "sm" : "default"} onClick={modalManageCategory.open} className="flex gap-2">
                            <PlusIcon color="white" />
                            <div className="my-auto text-white">
                                Add Records
                            </div>
                        </Button>
                    </Flex>
                    <Flex className="flex-col sm:flex-row my-6" gap="4">
                        {categoryList.map((item) =>
                        (<CategoryCards
                            category={item}
                            withEditButton
                            withRemoveButton
                            handleClickEdit={
                                () => {
                                    setSelectedCategory(item)
                                    modalManageCategory.open()
                                }
                            }
                            handleClickRemove={modalManageCategory.open}
                        />)
                        )}
                    </Flex>
                </Box>
            </Flex>

            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {dataStats.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.title}
                            </CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div> */}

            {modalEditIncome.isOpen && (
                <ModalEditIncome
                    handleSubmit={handleSubmit}
                    setValueIncome={setValueIncome}
                    disclosure={modalEditIncome}
                />
            )}

            {modalManageCategory.isOpen && (
                <ModalManageCategory
                    role={selectedCategory ? "edit" : "create"}
                    disclosure={modalManageCategory}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    );
}

export default BudgetingPage;