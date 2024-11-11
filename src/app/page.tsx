import { Navbar } from "@/components/composites/LandingPage/navbar";
import { HeroSection } from "@/components/composites/LandingPage/hero-section";
import { RisksSection } from "@/components/composites/LandingPage/risks-section";
import { BenefitsSection } from "@/components/composites/LandingPage/benefits-section";
import { DonationForm } from "@/components/composites/LandingPage/donation-form";
import { CTASection } from "@/components/composites/LandingPage/cta-section";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
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
