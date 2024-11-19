import { AlertTriangle, PiggyBank, TrendingDown, Wallet } from "lucide-react";
import { RiskCard } from "./risk-card";

const risks = [
  {
    icon: <PiggyBank className="h-6 w-6" />,
    title: "Poor Savings Growth",
    description:
      "Without proper tracking, your savings potential remains untapped, leading to missed opportunities for wealth building.",
  },
  {
    icon: <TrendingDown className="h-6 w-6" />,
    title: "Overspending Traps",
    description:
      "Unmonitored spending habits can lead to budget overruns and accumulating debt that becomes harder to manage.",
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "Financial Uncertainty",
    description:
      "Lack of clear financial insights makes it difficult to plan for future expenses and emergency situations.",
  },
  {
    icon: <Wallet className="h-6 w-6" />,
    title: "Missed Goals",
    description:
      "Without proper financial planning, achieving important life goals becomes challenging and often delayed.",
  },
];

export function RisksSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 data-aos="fade-down" className="text-3xl font-bold text-center mb-12">
        The Cost of Poor Financial Management
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {risks.map((risk, index) => (
          <div key={index} data-aos="fade-left" data-aos-delay={(index + 1) * 200}>
            <RiskCard {...risk} />
          </div>
        ))}
      </div>
    </div>
  );
}
