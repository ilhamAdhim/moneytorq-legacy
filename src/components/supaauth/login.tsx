"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import SocialAuth from "./SocialAuth";
import { toast } from "sonner";
import { Spinner } from "@radix-ui/themes";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(6, { message: "Password is too short" }),
});

interface ISignIn {
  redirectTo: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("isLoading", isLoading);
  }, [isLoading]);

  return (
    <div className="w-full sm:w-[26rem] shadow sm:p-5 rounded-md">
      <div className="py-5 space-y-5">
        <div className="text-center space-y-3">
          {/* <Image
            src={"/moneytorq.png"}
            alt="supabase logo"
            width={100}
            height={100}
            className="rounded-full mx-auto"
          /> */}
          <h1 className="font-bold">Login to your Account</h1>
          <p className="text-sm">Welcome back! Please sign in to continue</p>
        </div>

        <SignInForm redirectTo={"/dashboard"} isLoading={isLoading} setIsLoading={setIsLoading} />

        <div className="flex items-center gap-5">
          <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
          <div className="text-sm">or</div>
          <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
        </div>
        <SocialAuth redirectTo={"/dashboard"} isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>
    </div>
  );
}

export function SignInForm({ redirectTo, isLoading, setIsLoading }: ISignIn) {
  const [passwordReveal, setPasswordReveal] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // TODO: Login Logic
    try {
      setIsLoading(true);
    } catch (error) {
      console.log("error", error);
      toast.error("Error occured...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" font-semibold  test-sm">Email Address</FormLabel>
              <FormControl>
                <Input className="h-8" placeholder="example@gmail.com" type="email" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Password</FormLabel>
              <FormControl>
                <div className=" relative">
                  <Input className="h-8" type={passwordReveal ? "text" : "password"} {...field} />
                  <div
                    className="absolute right-2 top-[30%] cursor-pointer group"
                    onClick={() => setPasswordReveal(!passwordReveal)}
                  >
                    {passwordReveal ? (
                      <FaRegEye className=" group-hover:scale-105 transition-all" />
                    ) : (
                      <FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-8 bg-green-600 hover:bg-green-700 transition-all text-white flex items-center gap-2"
        >
          {isLoading ? <Spinner /> : "Continue"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <h1>
          Doesn&apos;t not have account yet?{" "}
          <Link href="/register" className="text-blue-400">
            Register
          </Link>
        </h1>
      </div>
    </Form>
  );
}
