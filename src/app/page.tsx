import { Navbar } from "@/components/composites/LandingPage/navbar";
import { HeroSection } from "@/components/composites/LandingPage/hero-section";
import { RisksSection } from "@/components/composites/LandingPage/risks-section";
import { BenefitsSection } from "@/components/composites/LandingPage/benefits-section";
import { CTASection } from "@/components/composites/LandingPage/cta-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MoneytorQ | Expense Tracker & Financial Goals",
  description:
    "MoneytorQ: Your all-in-one money management app. Track spending, create budgets, and reach your financial goals with ease.",
  icons: {
    icon: "/moneytorq.png",
  },
};

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <RisksSection />
        <BenefitsSection />
        <CTASection />
        <DonationForm />
      </main>
    </div>
  );
}

export default App;
