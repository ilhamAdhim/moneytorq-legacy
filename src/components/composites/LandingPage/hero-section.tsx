import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Take Control of Your <span className="text-emerald-600">Financial Future</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            MoneytorQ empowers you with advanced analytics and intuitive tools to manage your
            personal finances effectively. Track expenses, monitor income, and achieve your
            financial goals with ease.
          </p>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
              Start Your Journey
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-6 rounded-lg">
              <BarChart3 className="h-8 w-8 text-emerald-600 mb-2" />
              <h3 className="font-semibold">Expense Tracking</h3>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/50 p-6 rounded-lg">
              <PieChart className="h-8 w-8 text-amber-600 mb-2" />
              <h3 className="font-semibold">Budget Analysis</h3>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg">
              <TrendingUp className="h-8 w-8 text-emerald-600 mb-2" />
              <h3 className="font-semibold">Growth Insights</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
