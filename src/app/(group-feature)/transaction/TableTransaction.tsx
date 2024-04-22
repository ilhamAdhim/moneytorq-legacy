import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { SortingState, ColumnFiltersState, VisibilityState, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, PlusCircle, Settings2Icon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTableDemo } from "@/components/composites/data-table"
import { Input } from "@/components/ui/input"
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { ICategory } from "@/types/categoryTypes"
import { dataTransaction } from "@/store/mockData"
import { Badge } from "@radix-ui/themes"
import { useAtomValue } from "jotai/react"
import { categories } from "@/store"
import ModalNewCategory from "@/components/composites/Modals/ModalNewCategory"

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <div className="flex gap-2 w-[100px]">
                {(row.getValue("category") as ICategory[]).map(item => (
                    <Badge key={item.id} color={item.colorBadge}>
                        {item.category_title}
                    </Badge>
                ))}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("ID-id", {
                style: "currency",
                currency: "IDR",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

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
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export type Payment = {
    id: string
    amount: number
    email: string
    category: ICategory[]
    status: "pending" | "processing" | "success" | "failed"
}

function TableTransactionView() {
    const categoryList = useAtomValue(categories)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [isModalOpenNewCategories, setIsModalOpenNewCategories] = useState(false)

    const [rowSelection, setRowSelection] = useState({})

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
    })

    useEffect(() => {
        console.log(categoryList, "categoryList")
    }, [categoryList]);

    return (
        <>
            <DataTableDemo tableInstance={table} headers={
                <div className="flex space-between py-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Filter emails..."
                            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("email")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <TagsIcon className="h-4 w-4 mr-2" />  Categories
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {
                                    categoryList.map(item => (
                                        <DropdownMenuItem key={item.id}>
                                            <Badge className="p-1 rounded-lg" color={item.colorBadge}>
                                                {item.category_title}
                                            </Badge>
                                        </DropdownMenuItem>
                                    ))
                                }
                                <DropdownMenuSeparator />
                                <div onClick={() => setIsModalOpenNewCategories(true)}>
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
                                <Settings2Icon className="mr-2 h-4 w-4" />  Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            } />

            <ModalNewCategory
                isModalOpenNewCategories={isModalOpenNewCategories}
                setIsModalOpenNewCategories={setIsModalOpenNewCategories}
            />
        </>);
}

export default TableTransactionView;