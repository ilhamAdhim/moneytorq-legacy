import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface IDialog {
    title?: string | React.ReactElement,
    desc?: string
    children?: React.ReactElement
    buttonContent?: React.ReactElement
    footer?: any
    isOpen?: boolean
    onOpenChange? : any
}

const defaultContent = <div className="grid gap-4 py-4">
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
            Name
        </Label>
        <Input
            id="name"
            defaultValue="Pedro Duarte"
            className="col-span-3"
        />
    </div>
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
            Username
        </Label>
        <Input
            id="username"
            defaultValue="@peduarte"
            className="col-span-3"
        />
    </div>
</div>

export default function DialogModal({
    title, desc, footer, isOpen, onOpenChange, children = defaultContent
}: IDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {desc && (
                        <DialogDescription>
                            {desc}
                        </DialogDescription>
                    )}
                    
                </DialogHeader>

                {children}

                {footer &&
                    <DialogFooter>
                        {footer || <Button type="submit">Save changes</Button>}
                    </DialogFooter>
                }

            </DialogContent>
        </Dialog>
    )
}
