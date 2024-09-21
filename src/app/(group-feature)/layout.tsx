import { MainNav } from "@/components/composites/MainNav";
import MenuDropdown from "@/components/composites/Navigations/MenuDropdown";
import ThemeSwitcher from "@/components/composites/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { createSupabaseServer } from "@/lib/supabase/server";
import { INavList } from "@/types/common";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { FaUser } from "react-icons/fa6";

interface ILayoutGroupFeature {
  children: React.ReactNode;
}

const navList = [
  {
    href: "/dashboard",
    label: "Overview",
  },
  {
    href: "/budgeting",
    label: "Budgeting",
  },
  {
    href: "/transaction",
    label: "Transactions",
  },
  // {
  //   href: "/investment-portfolio",
  //   label: 'Investment Portfolio'
  // },
];

async function LayoutGroupFeature({ children }: ILayoutGroupFeature) {
  // All protected routes
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex justify-between h-16 items-center px-4">
            <Image
              src={"/moneytorq.png"}
              alt="supabase logo"
              width={100}
              height={100}
              className="rounded-full p-2"
            />
            <MainNav navList={navList} className="hidden md:block mx-6" />
            <div className="hidden ml-auto md:flex items-center space-x-4">
              <MenuDropdown />
              <ThemeSwitcher />
            </div>

            <div className="md:hidden flex gap-4">
              <MenuDropdown navList={navList} />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </>
  );
}

export default LayoutGroupFeature;
