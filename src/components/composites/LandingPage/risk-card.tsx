import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RiskCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function RiskCard({ title, description, icon, className }: RiskCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
          {icon}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}