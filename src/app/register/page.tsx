import SignUp from "@/components/supaauth/register";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";

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
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link href="/login" className={cn("absolute right-4 top-4 md:right-8 md:top-8")}>
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="sticky top-4 z-20 flex items-center text-lg font-medium">
            <div className="py-4 flex justify-center space-x-2">
              <Wallet className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold">MoneytorQ</span>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
            <SignUp />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
