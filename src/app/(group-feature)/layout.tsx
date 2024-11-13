import { MainNav } from "@/components/composites/MainNav";
import MenuDropdown from "@/components/composites/Navigations/MenuDropdown";
import ThemeSwitcher from "@/components/composites/ThemeSwitcher";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import React from "react";

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
      <div className="flex-col md:flex top-0 sticky bg-inherit z-10">
        <div className="border-b">
          <div className="flex justify-between h-16 items-center px-4 ">
            {/* <Image
              src={"/moneytorq.png"}
              alt="supabase logo"
              width={100}
              height={100}
              className="rounded-full p-2"
            /> */}
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold">MoneytorQ</span>
            </div>
            <MainNav navList={navList} className="hidden md:block mx-6" />
            <div className="hidden ml-auto md:flex items-center space-x-4">
              <ThemeSwitcher />
              <MenuDropdown />
            </div>

            <div className="md:hidden flex gap-4">
              <ThemeSwitcher />
              <MenuDropdown navList={navList} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </>
  );
}

export default LayoutGroupFeature;
