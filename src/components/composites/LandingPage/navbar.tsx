import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import ThemeSwitcher from "../ThemeSwitcher";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b top-0 sticky bg-inherit z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold">MoneytorQ</span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />

          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Try it now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
