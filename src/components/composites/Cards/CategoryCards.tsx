import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ICategory } from "@/types/categoryTypes";
import { Badge, Box } from "@radix-ui/themes"
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
        <Card className="w-full">
            <CardHeader className="flex flex-nowrap p-2 gap-4 flex-row justify-between space-y-0">
                <Badge className="p-1 rounded-lg my-auto" color={category.colorBadge}>
                    {category.category_title}
                </Badge>
                <Box>
                    {category.icon}
                </Box>
                {(withEditButton || withRemoveButton) &&
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="my-auto cursor-pointer">
                                <EllipsisIcon size={24} />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {withEditButton &&
                                <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={handleClickEdit}>
                                    Edit
                                    <Edit2Icon className="w-4" size="icon" />
                                </DropdownMenuItem>
                            }

                            {withRemoveButton &&
                                <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={handleClickRemove}>
                                    Delete
                                    <TrashIcon className="w-4" size="icon" />
                                </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </CardHeader>
        </Card>);
}

export default CategoryCards;
