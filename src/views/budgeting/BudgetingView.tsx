"use client";
import ModalEditIncome from "@/components/composites/Modals/ModalEditIncome";
import ModalManageCategory, {
  IFormDataManageCategory,
} from "@/components/composites/Modals/ModalManageCategory";
import { Badge } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/Typography/Heading4";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ICategory, ICategoryResponse } from "@/types/category";
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
  const [valueIncome, setValueIncome] = useState(0);

  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [totalPercentage, setTotalPercentage] = useState(dataTotalPercentage);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const availableBudgetPercentage = useMemo(() => 100 - totalPercentage, [totalPercentage]);
  const availableBudgetRupiah = useMemo(
    () => formatRupiah(((100 - totalPercentage) / 100) * valueIncome),
    [totalPercentage, valueIncome]
  );

  const dataPieChart = useMemo(() => {
    const dataCategory = categoryList.map(item => {
      return {
        id: item.category_title,
        label: item.category_title,
        value: item.budgetPercentage,
      };
    });

    return [
      ...dataCategory,
      {
        id: "available",
        label: "Available",
        value: 100 - totalPercentage,
      },
    ];
  }, [categoryList, totalPercentage]);

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
            desc: item.description,
          };
        })
      );

    if (dataPercentage) setTotalPercentage(dataPercentage);
  };

  const modalEditIncome = useDisclosure();
  const modalManageCategory = useDisclosure();
  const modalDeleteCategory = useDisclosure();

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
          desc: item.description,
        };
      })
    );
  }, [data]);

  const handleSubmit = async (formData: IFormDataManageCategory) => {
    try {
      let percentageBelow100 = selectedCategory
        ? Number(totalPercentage) -
            Number(selectedCategory.budgetPercentage) +
            Number(formData.percentage_amount) >
          100
        : Number(totalPercentage) + Number(formData.percentage_amount) > 100;

      if (percentageBelow100) throw Error("Your budget is more than 100% ?");

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

  const handleOpenEditCategory = (item: ICategory) => {
    setSelectedCategory(item);
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
      <Flex className="flex-col lg:flex-row" gap="6">
        <Card className="w-full lg:w-1/4">
          <CardHeader>
            <CardTitle> Overview </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[400px]">
            <PieChartSpent data={dataPieChart} />
          </CardContent>
        </Card>
        <Card className="w-full lg:w-1/2">
          <Flex className="p-4" justify="between">
            <h2 className="my-auto text-xl font-bold tracking-tight">Expense Allocations</h2>
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
              <TableCaption>
                {" "}
                Your Available budget is
                <b> {availableBudgetPercentage}% </b>
                {" or "}
                <b> {availableBudgetRupiah} </b>{" "}
              </TableCaption>
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
                            onClick={() => handleOpenEditCategory(item)}
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
        <Card className="w-full lg:w-1/4">
          <CardHeader>
            <CardTitle> Income Stream </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[400px]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil magnam cum minus
            assumenda praesentium earum nesciunt hic tenetur id cupiditate? Eaque ad at recusandae
            asperiores veritatis esse quasi, in aut.
          </CardContent>
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
          selectedCategory={selectedCategory}
          disclosure={modalDeleteCategory}
          handleSubmit={handleRemoveCategory}
        />
      )}
    </>
  );
}

export default BudgetingView;
