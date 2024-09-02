import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, PlusCircle, Settings2Icon, TagsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTableDemo } from "@/components/composites/DataTable";
import { Input } from "@/components/ui/input";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ICategory, ICategoryResponse } from "@/types/categoryTypes";
import { dataTransaction } from "@/store/mockData";
import { Badge } from "@radix-ui/themes";
import ModalNewCategory from "@/components/composites/Modals/ModalNewCategory";
import { createCategory, getCategories } from "@/actions/categories";
import ModalManageCategory, {
  IFormDataManageCategory,
} from "@/components/composites/Modals/ModalManageCategory";
import { useDisclosure } from "@/hooks/useDisclosure";
import { toast } from "sonner";
import { COLORS } from "@/types/common";
import { ITransaction } from "@/types/transactionTypes";
import { format } from "date-fns";

export const columns: ColumnDef<ITransaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => (
      <div className="capitalize text-center">{format(row.getValue("date"), "dd MMM yyyy")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: () => <div className="text-center">Transaction Title</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center"> Category </div>,
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
        <Badge key={row.id} color={"green"}>
          {row.getValue("title")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, column }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("ID-id", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// export type Payment = {
//   id: string;
//   amount: number;
//   title: string;
//   category: ICategory[];
//   status: "pending" | "processing" | "success" | "failed";
// };

interface ITableTransactionView {
  dataTransaction: ITransaction[];
}

function TableTransactionView({ dataTransaction }: ITableTransactionView) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const modalManageCategory = useDisclosure();

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: dataTransaction,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const {
        queryCategories: { data: dataCategory },
        queryTotalPercentage: { data: dataTotalPercent },
      } = await getCategories({});
      if (dataCategory)
        setCategoryList(
          dataCategory?.map((item: ICategoryResponse) => {
            return {
              id: item.category_id,
              budgetPercentage: item.percentage_amount,
              category_title: item.category_title,
              colorBadge: item.color_badge as COLORS,
            };
          })
        );
      if (dataTotalPercent) setTotalPercentage(dataTotalPercent);
    };

    fetchData();
  }, []);

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

  const handleSubmit = async (formData: IFormDataManageCategory) => {
    try {
      if (Number(totalPercentage) + Number(formData.percentage_amount) > 100)
        throw Error("Your budget is more than 100% ?");
      const query = await createCategory(formData);
      refetchDataCategories();
      toast.success(`Category Created!`);
    } catch (error) {
      console.error(error);
      toast.error(`Cannot Create Category <br/> | ${error}`);
    } finally {
      modalManageCategory.close();
    }
  };

  return (
    <>
      <DataTableDemo
        tableInstance={table}
        headers={
          <div className="flex space-between py-4">
            <div className="flex gap-4">
              <Input
                placeholder="Filter titles..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={event => table.getColumn("title")?.setFilterValue(event.target.value)}
                className="max-w-sm"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <TagsIcon className="h-4 w-4 mr-2" /> Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categoryList?.map(item => (
                    <DropdownMenuItem key={item.id}>
                      <Badge className="p-1 rounded-lg" color={item.colorBadge as any}>
                        {item.category_title}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div onClick={modalManageCategory.open}>
                    <DropdownMenuItem>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span className="pr-2"> Create New... </span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings2Icon className="mr-2 h-4 w-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(column => column.getCanHide())
                  ?.map(column => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={value => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <ModalManageCategory
        role={"create"}
        disclosure={modalManageCategory}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default TableTransactionView;
