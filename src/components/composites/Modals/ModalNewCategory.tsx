"use client"
import DialogModal from "@/components/composites/dialog-modal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SearchableSelect } from "../SearchableSelect"
import { COLORS_OPTION } from "@/constants"

interface IModalNewCategories {
    isModalOpenNewCategories: boolean
    setIsModalOpenNewCategories: Dispatch<SetStateAction<boolean>>
}

function ModalNewCategory({
    isModalOpenNewCategories,
    setIsModalOpenNewCategories
}: IModalNewCategories) {
    const [selectedValue, setSelectedValue] = useState("")
    const [processedColors, setProcessedColors] = useState<{value: string, label: string}[]>([])
    useEffect(() => {
        setProcessedColors(COLORS_OPTION.map(item => {
            return {
                value: item,
                label: item
            }
        }))
    }, []);

    return (
        <DialogModal title="Create New Category"
            isOpen={isModalOpenNewCategories}
            onOpenChange={setIsModalOpenNewCategories}
        >
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Category Name
                    </Label>
                    <Input
                        id="name"
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Choose Color
                    </Label>
                    <SearchableSelect
                        data={processedColors}
                        selectedValue={selectedValue}
                        entity="Colors"
                        setSelectedValue={setSelectedValue}
                    />
                </div>
            </div>
        </DialogModal>
    );
}

export default ModalNewCategory;