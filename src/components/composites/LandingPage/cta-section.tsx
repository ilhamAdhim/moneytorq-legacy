"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-2xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Financial Life?</h2>
          <p className="text-lg text-muted-foreground">
            Join users who are already mastering their finances with MoneytorQ. Start your journey
            to financial freedom today.
          </p>
        </div>
        <Link href="/login">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
            Get Started Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
