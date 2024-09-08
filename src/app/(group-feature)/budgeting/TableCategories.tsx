import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { DataTableDemo } from "@/components/composites/DataTable";
import { Input } from "@/components/ui/input";
import { ICategoryResponse } from "@/types/category";
import { Badge, Box } from "@radix-ui/themes";
import { COLORS } from "@/types/common";

export const columns: ColumnDef<ICategoryResponse>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={value => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "transaction_type",
  },

  {
    accessorKey: "category_title",
    header: () => <div className="text-center"> Category Name </div>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-center">
          <Badge key={row.id} color={row.original.color_badge as COLORS}>
            {row.original.category_title}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "percentage_amount",
    header: () => <div className="text-center">Budget (%)</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("percentage_amount")}%</div>,
  },
  {
    accessorKey: "rupiah_amount",
    header: ({ column }) => (
      <Box className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </Box>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("rupiah_amount"));

      const formatted = new Intl.NumberFormat("ID-id", {
        style: "currency",
        currency: "IDR",
      }).format(amount || 0);

      return <div className={`text-center font-medium`}>{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Description</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("description") || "-"}</div>,
  },
];

interface ITableCategoriesView {
  dataCategoryList: ICategoryResponse[];
  handleOpenModalEdit: (item: ICategoryResponse) => void;
  handleOpenModalDelete: (item: ICategoryResponse) => void;
}

function TableCategoriesView({
  dataCategoryList,
  handleOpenModalEdit,
  handleOpenModalDelete,
}: ITableCategoriesView) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: dataCategoryList,
    columns: [
      ...columns,
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => handleOpenModalEdit(row.original)}
                >
                  Edit Transaction
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => handleOpenModalDelete(row.original)}
                >
                  Delete Transaction
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
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
      columnVisibility: {
        transaction_type: false,
        ...columnVisibility,
      },
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <>
      <DataTableDemo
        tableInstance={table}
        headers={
          <div className="flex space-between py-4">
            <div className="flex flex-col lg:flex-row justify-between w-full gap-4">
              <Input
                placeholder="Filter Category Name..."
                value={(table.getColumn("category_title")?.getFilterValue() as string) ?? ""}
                onChange={event =>
                  table.getColumn("category_title")?.setFilterValue(event.target.value)
                }
                className="w-full"
              />

              {/* <div className="flex gap-2 flex-wrap lg:flex-nowrap w-full justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full lg:w-fit">
                      <CircleDollarSign className="h-4 w-4 mr-2" /> Expense Type
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={
                        (table.getColumn("transaction_type")?.getFilterValue() as string) ?? ""
                      }
                      onValueChange={value =>
                        table.getColumn("transaction_type")?.setFilterValue(value)
                      }
                    >
                      <DropdownMenuRadioItem value="expenses">Expenses</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="income">Income</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full lg:w-fit">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full lg:w-fit">
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
              </div> */}
            </div>
          </div>
        }
      />
    </>
  );
}

export default TableCategoriesView;
