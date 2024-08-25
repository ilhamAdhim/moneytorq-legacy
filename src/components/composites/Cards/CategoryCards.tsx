import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ICategory } from "@/types/categoryTypes";
import { Edit2Icon, TrashIcon } from "lucide-react";

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
                <CardTitle className="text-sm font-medium">
                    {category.category_title}
                </CardTitle>
                {category.icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{category.category_title}</div>
                <p className="text-xs text-muted-foreground">
                    {category.desc}
                </p>
            </CardContent>
            <CardFooter className="flex gap-4">
                {withEditButton &&
                    <Button onClick={handleClickEdit} className="mx-auto" variant="outline" >
                        <Edit2Icon className="w-4" size="icon" />
                    </Button>}
                {withRemoveButton &&
                    <Button onClick={handleClickRemove} className="mx-auto" variant="outline">
                        <TrashIcon className="w-4" size="icon" />
                    </Button>}
            </CardFooter>
        </Card>);
}

export default CategoryCards;
