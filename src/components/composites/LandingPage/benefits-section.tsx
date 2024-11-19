import { BarChart, DollarSign, PieChart, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Smart Budgeting",
    description:
      "Create and manage custom budgets that adapt to your spending patterns and financial goals.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Income Tracking",
    description: "Monitor multiple income streams and analyze your earning patterns over time.",
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "30-Day Insights",
    description:
      "Get detailed breakdowns of your spending habits with interactive charts and reports.",
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "Expense Analysis",
    description:
      "Identify overspending categories and get actionable insights to optimize your finances.",
  },
];

export function BenefitsSection() {
  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/10 py-16">
      <div className="container mx-auto px-4">
        <h2 data-aos="fade-up" className="text-3xl font-bold text-center mb-12">
          Why Choose MoneytorQ?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              data-aos-delay={(index + 1) * 200}
              data-aos="fade-right"
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
