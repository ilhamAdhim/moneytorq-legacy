import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface IDialog {
  title?: string | React.ReactElement;
  desc?: string;
  children?: React.ReactElement;
  buttonContent?: React.ReactElement;
  footer?: any;
  isOpen?: boolean;
  onOpenChange?: any;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
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

export default function DialogModal({
  title,
  desc,
  size = "lg",
  footer,
  isOpen,
  onOpenChange,
  children = defaultContent,
  classNameContent,
}: IDialog) {
  const modalSizeClass = {
    xs: "max-w-[100px]",
    sm: "max-w-[300px]",
    md: "max-w-[400px]",
    lg: "max-w-[500px]",
    xl: "max-w-[600px]",
    "2xl": "max-w-[700px]",
    full: "max-w-full",
  }[size];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(classNameContent, modalSizeClass)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>

        {children}

        {footer && (
          <DialogFooter>{footer || <Button type="submit">Save changes</Button>}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
