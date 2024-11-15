"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import SocialAuth from "./SocialAuth";
import SignUp from "./signup";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const queryString = typeof window !== "undefined" ? window?.location.search : "";
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the 'next' parameter
  const next = urlParams.get("next");

  return (
    <div className="w-full sm:w-[26rem] shadow p-4 dark:border-zinc-800 rounded-md">
      <div className="py-5 space-y-5">
        <div className="text-center space-y-3">
          {/* <Image
            src={"/moneytorq.png"}
            alt="MoneytorQ Logo"
            width={100}
            height={100}
            className=" rounded-full m-auto"
          /> */}
          <h1 className="font-bold">Create Account</h1>
          <p className="text-sm">Welcome! Please fill in the details to get started.</p>
        </div>
      </div>
      <SignUp redirectTo={next || "/"} isLoading={isLoading} setIsLoading={setIsLoading} />

      <div className="flex items-center gap-5 mb-3">
        <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
        <div className="text-sm">or</div>
        <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
      </div>
      <SocialAuth
        redirectTo={next || "/dashboard"}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
