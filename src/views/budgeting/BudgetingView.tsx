"use client"
import CategoryCards from "@/components/composites/Cards/CategoryCards";
import ModalEditIncome from "@/components/composites/Modals/ModalEditIncome";
import ModalManageCategory from "@/components/composites/Modals/ModalManageCategory";
import { Badge } from "@radix-ui/themes"
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/Typography/Heading4";
import { MONTHS } from "@/constants";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ICategory, ICategoryResponse } from "@/types/categoryTypes";
import { formatRupiah } from "@/utils/common";
import { Box, Flex } from "@radix-ui/themes";
import { isAfter } from "date-fns";
import { DollarSignIcon, UserIcon, CreditCardIcon, TrendingDownIcon, Edit2Icon, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getIncomeByID, updateIncome } from "@/actions/incomes";
import { toast } from "sonner";
import PieChartSpent from "@/app/(group-feature)/transaction/PiechartSpent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCategory, getCategories } from "@/actions/categories";
import useViewports from "@/hooks/useScreenWidth";
import { Separator } from "@/components/ui/separator";

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

interface IBudgetingView {
    data: ICategoryResponse[]
    error: any
}

function BudgetingView({ data, error }: IBudgetingView) {

    const { isSmallViewport } = useViewports()
    const [categoryList, setCategoryList] = useState<ICategory[]>([])
    const [selectedYear, setSelectedYear] = useState("2024")
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()])
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

    const dataPieChart = useMemo(() => {
        return categoryList.map(item => {
            return {
                id: item.category_title,
                label: item.category_title,
                value: item.budgetPercentage,
                color: item.colorBadge,
            }
        })
    }, [categoryList])


    const refetchDataCategories = async () => {
        const { data, error } = await getCategories({})
        if (data)
            setCategoryList(data?.map((item: ICategoryResponse) => {
                return {
                    id: item.category_id,
                    budgetPercentage: item.percentage_amount,
                    category_title: item.category_title,
                    colorBadge: item.color_badge as any,
                }
            }))
    }

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
    const modalDeleteCategory = useDisclosure()

    const [valueIncome, setValueIncome] = useState(0)

    const fetchIncome = async () => {
        const res = await getIncomeByID()
        setValueIncome(res.data?.income || 0)
    }

    useEffect(() => {
        fetchIncome()
        setCategoryList(data.map((item: ICategoryResponse) => {
            return {
                id: item.category_id,
                budgetPercentage: item.percentage_amount,
                category_title: item.category_title,
                colorBadge: item.color_badge as any,
            }
        }))
    }, [data]);

    const handleSubmit = () => {
        console.log("submitted")
        // TODO: Hit Supabase edit category
        // ...
    }

    const handleSubmitEditIncome = async (formData: any) => {
        try {
            await updateIncome(formData.income)

            modalEditIncome.close()
            fetchIncome()
            toast(`Data Updated!`, {
                description: `Income updated to ${formatRupiah(formData.income)}`
            })
        } catch (error) {
            console.error(error)
            toast(`Cannot update income ${error}`)
        }
    }

    const handleRemoveCategory = async () => {
        try {
            if (selectedCategory) {
                const { data, status, error } = await deleteCategory(selectedCategory.id)
                if (error) throw Error(error.message)

                modalDeleteCategory.close()
                refetchDataCategories()
                toast(`Category ${selectedCategory.category_title} deleted!`)
            }
        } catch (error) {
            toast(`Cannot delete category`, {
                description: `${error}`
            })
        }
    }

    const handleOpenCreateCategory = () => {
        setSelectedCategory(null)
        modalManageCategory.open()
    }

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Budgeting</h2>
                <Flex gap="4" className="justify-between md:justify-start">
                    <Box className="my-auto">
                        <TypographyH4> Fixed Income </TypographyH4>
                    </Box>
                    <Flex gap="4">
                        <div className="my-auto">
                            <Badge className="p-1 rounded-lg" color="green">
                                {formatRupiah(valueIncome)}
                            </Badge>
                        </div>
                        <Button className="mx-auto" variant="outline" onClick={() => {
                            setSelectedCategory(null)
                            modalEditIncome.open()
                        }}>
                            <Edit2Icon className="w-4" size="icon" />
                        </Button>
                    </Flex>
                </Flex>
            </div>

            <Separator />

            <Flex className="flex-col md:flex-row sm:flex-row" gap="8">
                <Card className="w-full md:w-1/2 sm:w-1/3">
                    <CardHeader>
                        <CardTitle>Money Spent at {selectedMonth} {selectedYear} </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2 h-[400px]">
                        <PieChartSpent data={dataPieChart} />
                    </CardContent>
                </Card>
                <Box className="w-full md:w-1/2 sm:w-2/3">
                    <Flex justify="between">
                        <h2 className="my-auto text-xl font-bold tracking-tight">Allocations</h2>
                        <Button size={isSmallViewport ? "sm" : "default"} onClick={handleOpenCreateCategory} className="flex gap-2">
                            <PlusIcon color="white" />
                            <div className="my-auto text-white">
                                Add Records
                            </div>
                        </Button>
                    </Flex>
                    <Flex className="flex-col sm:flex-row my-6" gap="4">
                        {categoryList.map((item) => (
                            <CategoryCards
                                category={item}
                                withEditButton
                                withRemoveButton
                                handleClickEdit={
                                    () => {
                                        setSelectedCategory(item)
                                        modalManageCategory.open()
                                    }
                                }
                                handleClickRemove={
                                    () => {
                                        setSelectedCategory(item)
                                        modalDeleteCategory.open()
                                    }
                                }
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
                    handleSubmit={handleSubmitEditIncome}
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

            {modalDeleteCategory.isOpen && (
                <ModalManageCategory
                    role={"delete"}
                    disclosure={modalDeleteCategory}
                    handleSubmit={handleRemoveCategory}
                />
            )}
        </>
    );
}

export default BudgetingView;