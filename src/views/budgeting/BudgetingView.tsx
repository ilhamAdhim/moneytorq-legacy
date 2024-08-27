"use client";
import ModalEditIncome from "@/components/composites/Modals/ModalEditIncome";
import ModalManageCategory, {
  IFormDataManageCategory,
} from "@/components/composites/Modals/ModalManageCategory";
import { Badge } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/Typography/Heading4";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ICategory, ICategoryResponse } from "@/types/categoryTypes";
import { formatRupiah } from "@/utils/common";
import { Box, Flex } from "@radix-ui/themes";
import { Edit2Icon, PlusIcon, EllipsisIcon, TrashIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getIncomeByID, updateIncome } from "@/actions/incomes";
import { toast } from "sonner";
import PieChartSpent from "@/app/(group-feature)/transaction/PiechartSpent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/actions/categories";
import useViewports from "@/hooks/useScreenWidth";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLORS } from "@/types/common";

interface IBudgetingView {
  data: ICategoryResponse[];
  dataTotalPercentage: any;
  error: any;
}

function BudgetingView({ data, dataTotalPercentage }: IBudgetingView) {
  const { isSmallViewport } = useViewports();
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [totalPercentage, setTotalPercentage] = useState(dataTotalPercentage);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const dataPieChart = useMemo(() => {
    return categoryList.map(item => {
      return {
        id: item.category_title,
        label: item.category_title,
        value: item.budgetPercentage,
        color: "blue",
      };
    });
  }, [categoryList]);

  const refetchDataCategories = async () => {
    const {
      queryCategories: { data },
      queryTotalPercentage: { data: dataPercentage },
    } = await getCategories({});
    if (data)
      setCategoryList(
        data?.map((item: ICategoryResponse) => {
          return {
            id: item.category_id,
            budgetPercentage: item.percentage_amount,
            category_title: item.category_title,
            colorBadge: item.color_badge as COLORS,
          };
        })
      );

    if (dataPercentage) setTotalPercentage(dataPercentage);
  };

  const modalEditIncome = useDisclosure();
  const modalManageCategory = useDisclosure();
  const modalDeleteCategory = useDisclosure();

  const [valueIncome, setValueIncome] = useState(0);

  const fetchIncome = async () => {
    const res = await getIncomeByID();
    setValueIncome(res.data?.income || 0);
  };

  useEffect(() => {
    fetchIncome();
    setCategoryList(
      data.map((item: ICategoryResponse) => {
        return {
          id: item.category_id,
          budgetPercentage: item.percentage_amount,
          category_title: item.category_title,
          colorBadge: item.color_badge as any,
        };
      })
    );
  }, [data]);

  const handleSubmit = async (formData: IFormDataManageCategory) => {
    try {
      if (Number(totalPercentage) + Number(formData.percentage_amount) > 100)
        throw Error("Your budget is more than 100% ?");
      let query;
      if (selectedCategory) query = await updateCategory(formData, selectedCategory.id);
      else query = await createCategory(formData);
      refetchDataCategories();
      toast.success(`Category ${selectedCategory ? "Updated" : "Created"}!`);
    } catch (error) {
      console.error(error);
      toast.error(`Cannot ${selectedCategory ? "Update" : "Create"} Category | ${error}`);
    } finally {
      modalManageCategory.close();
    }
  };

  const handleSubmitEditIncome = async (formData: any) => {
    try {
      await updateIncome(formData.income);

      modalEditIncome.close();
      fetchIncome();
      toast.success(`Data Updated!`, {
        description: `Income updated to ${formatRupiah(formData.income)}`,
      });
    } catch (error) {
      console.error(error);
      toast.error(`Cannot update income ${error}`);
    }
  };

  const handleRemoveCategory = async () => {
    try {
      if (selectedCategory) {
        const { error } = await deleteCategory(selectedCategory.id);
        if (error) throw Error(error.message);

        modalDeleteCategory.close();
        refetchDataCategories();
        toast.success(`Category ${selectedCategory.category_title} deleted!`);
      }
    } catch (error) {
      toast.error(`Cannot delete category`, {
        description: `${error}`,
      });
    }
  };

  const handleOpenCreateCategory = () => {
    setSelectedCategory(null);
    modalManageCategory.open();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
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
            <Button
              className="mx-auto"
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                modalEditIncome.open();
              }}
            >
              <Edit2Icon className="w-4" size="icon" />
            </Button>
          </Flex>
        </Flex>
      </div>

      <Separator />

      <Flex className="flex-col md:flex-row sm:flex-row" gap="6">
        <Card className="w-full md:w-1/2 sm:w-1/3">
          <CardHeader>
            <CardTitle> Overview </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[400px]">
            <PieChartSpent data={dataPieChart} />
          </CardContent>
        </Card>
        <Card className="p-4 w-full md:w-1/2 sm:w-2/3">
          <Flex justify="between">
            <h2 className="my-auto text-xl font-bold tracking-tight">Allocations</h2>
            <Button
              size={isSmallViewport ? "sm" : "default"}
              onClick={handleOpenCreateCategory}
              className="flex gap-2"
            >
              <PlusIcon color="white" />
              <div className="my-auto text-white">Add Records</div>
            </Button>
          </Flex>
          <Flex className="flex-col flex-wrap sm:flex-row my-6" gap="4">
            <Table>
              <TableCaption>A list of your recent budgetings.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead> Category Name </TableHead>
                  <TableHead> Budget (%) </TableHead>
                  <TableHead> Budget (Rp) </TableHead>
                  <TableHead> Description </TableHead>
                  <TableHead className="text-center"> Action </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryList.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Badge className="p-1 rounded-lg my-auto" color={item.colorBadge}>
                        {item.icon} {item.category_title}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.budgetPercentage}%</TableCell>
                    <TableCell>
                      {item.budgetPercentage
                        ? formatRupiah((item.budgetPercentage / 100) * valueIncome)
                        : 0}
                    </TableCell>
                    <TableCell>{item.desc || "-"}</TableCell>
                    <TableCell className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="my-auto cursor-pointer">
                            <EllipsisIcon size={24} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex justify-between cursor-pointer"
                            onClick={() => {
                              setSelectedCategory(item);
                              modalManageCategory.open();
                            }}
                          >
                            Edit
                            <Edit2Icon className="w-4" size="icon" />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="flex justify-between cursor-pointer"
                            onClick={() => {
                              setSelectedCategory(item);
                              modalDeleteCategory.open();
                            }}
                          >
                            Delete
                            <TrashIcon className="w-4" size="icon" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={1}> Total </TableCell>
                  <TableCell> {totalPercentage}% </TableCell>
                  <TableCell colSpan={3}> </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Flex>
        </Card>
      </Flex>

      {modalEditIncome.isOpen && (
        <ModalEditIncome handleSubmit={handleSubmitEditIncome} disclosure={modalEditIncome} />
      )}

      {modalManageCategory.isOpen && (
        <ModalManageCategory
          role={selectedCategory ? "edit" : "create"}
          selectedCategory={selectedCategory}
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
