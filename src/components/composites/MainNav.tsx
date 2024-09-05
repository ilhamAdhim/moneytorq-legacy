"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { INavList } from "@/types/common";

interface IMainNav extends INavList, React.HTMLAttributes<HTMLElement> {}

export function MainNav({ navList, className, ...props }: IMainNav) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {navList?.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            !pathname.includes(item.href) ? "text-muted-foreground" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
