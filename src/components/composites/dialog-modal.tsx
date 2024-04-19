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
    title: string,
    desc: string
    children?: React.ReactElement
    footer?: any
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
    title, desc, footer, children = defaultContent
}: IDialog) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">{title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {desc}
                    </DialogDescription>
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
