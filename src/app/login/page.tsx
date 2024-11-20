import SignIn from "@/components/supaauth/login";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { Box } from "@radix-ui/themes";
import AuthIllustration from "@/components/supaauth/AuthIllustration";

export const metadata: Metadata = {
  title: "MoneytorQ | Login",
  description: "Login to MoneytorQ Dashboard. Your personal finance and budgeting app",
  icons: {
    icon: "/moneytorq.png",
  },
};

export default function AuthenticationPage() {
  return (
    <>
      {/* Mobile + Tablet View */}
      <div className="flex align-center justify-center min-h-[100vh] block lg:hidden">
        <Box className="m-auto p-4">
          <div className="flex justify-center space-x-2">
            <Wallet className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">MoneytorQ</span>
          </div>
          <SignIn />
        </Box>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block">
        <div className="container relative hidden h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <Link href="/register" className={cn("absolute right-4 top-4 md:right-8 md:top-8")}>
            Register
          </Link>
          <div className="relative hidden h-full flex-col bg-muted dark:border-r lg:flex">
            <Link href="/">
              <div className="sticky top-4 z-20 flex items-center px-10 text-lg font-medium py-4 space-x-2">
                <Wallet className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold">MoneytorQ</span>
              </div>
            </Link>
            <AuthIllustration />
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
