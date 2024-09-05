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
import { useState } from "react";
import { DataTableDemo } from "@/components/composites/DataTable";
import { Input } from "@/components/ui/input";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ICategory } from "@/types/category";
import { Badge, Box } from "@radix-ui/themes";
import { UseDisclosureType } from "@/types/common";
import { ITransaction } from "@/types/transaction";
import { format } from "date-fns";

export const columns: ColumnDef<ITransaction>[] = [
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
    accessorKey: "date",
    header: ({ column }) => (
      <Box className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </Box>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("date") ? format(row.getValue("date"), "dd MMM yyyy") : "-"}
      </div>
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
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-center">
          <Badge key={row.id} color={row.original.color_badge}>
            {row.original.category_title}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
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
    cell: ({ row, column }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("ID-id", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

      return (
        <div
          className={`text-center font-medium ${
            row.original.transaction_type === "expenses" ? "text-red-500" : "text-green-500"
          }`}
        >
          {row.original.transaction_type === "expenses" ? "-" : "+"}
          {formatted}
        </div>
      );
    },
  },
];

interface ITableTransactionView {
  dataTransaction: ITransaction[];
  categoryList: ICategory[];
  modalManageCategory: UseDisclosureType;
  handleOpenModalEdit: (item: ITransaction) => void;
  handleOpenModalDelete: (item: ITransaction) => void;
}

function TableTransactionView({
  dataTransaction,
  categoryList,
  modalManageCategory,
  handleOpenModalEdit,
  handleOpenModalDelete,
}: ITableTransactionView) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: dataTransaction,
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
      columnVisibility,
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
            <div className="flex flex-col md:flex-row justify-between w-full gap-4">
              <Input
                placeholder="Filter titles..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={event => table.getColumn("title")?.setFilterValue(event.target.value)}
                className="w-full"
              />

              <div className="flex gap-4 justify-between">
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
            </div>
          </div>
        }
      />
    </>
  );
}

export default TableTransactionView;
