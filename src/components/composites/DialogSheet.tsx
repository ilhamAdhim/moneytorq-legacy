import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ISheet {
  title?: string | React.ReactElement;
  desc?: string;
  children?: React.ReactElement;
  buttonContent?: React.ReactElement;
  footer?: any;
  isOpen?: boolean;
  onOpenChange?: any;
  side?: "top" | "bottom" | "left" | "right";
  classNameContent?: string;
}

const defaultContent = (
  <div className="grid gap-4 py-4">
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="name" className="text-right">
        Name
      </Label>
      <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
    </div>
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="username" className="text-right">
        Username
      </Label>
      <Input id="username" defaultValue="@peduarte" className="col-span-3" />
    </div>
  </div>
);

export default function DialogSheet({
  title,
  desc,
  side = "left",
  footer,
  isOpen,
  onOpenChange,
  children = defaultContent,
  classNameContent,
}: ISheet) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={cn(classNameContent)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {desc && <SheetDescription>{desc}</SheetDescription>}
        </SheetHeader>

        {children}

        {footer && (
          <SheetFooter>{footer || <Button type="submit">Save changes</Button>}</SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
