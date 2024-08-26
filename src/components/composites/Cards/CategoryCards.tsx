import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ICategory } from "@/types/categoryTypes";
import { Badge } from "@radix-ui/themes"
import { Edit2Icon, EllipsisIcon, TrashIcon } from "lucide-react";

interface ICategoryCards {
    category: ICategory
    withEditButton?: boolean
    withRemoveButton?: boolean
    handleClickEdit?: () => void
    handleClickRemove?: () => void
    onSubmitEdit?: () => void
    onSubmitRemove?: () => void
}

function CategoryCards({
    category,
    withEditButton,
    withRemoveButton,
    handleClickEdit,
    handleClickRemove
}: ICategoryCards) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Badge className="p-1 rounded-lg" color={category.colorBadge}>
                    {category.category_title}
                </Badge>
                {category.icon}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* <div className="text-xl font-bold">{category.category_title}</div>
                <p className="text-xs text-muted-foreground">
                    {category.desc ?? "Lorem ipsum"}
                </p> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <EllipsisIcon size={14} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex justify-between" onClick={handleClickEdit}>
                            Edit
                            <Edit2Icon className="w-4" size="icon" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex justify-between" onClick={handleClickRemove}>
                            Delete
                            <TrashIcon className="w-4" size="icon" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
        </Card>);
}

export default CategoryCards;
