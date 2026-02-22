import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import PropertyHighlights from "@/components/PropertyHighlights";
import WeatherWidget from "@/components/WeatherWidget";
import TouristGuide from "@/components/TouristGuide";
import InstagramFeed from "@/components/InstagramFeed";
import LeadCapture from "@/components/LeadCapture";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <QuickActions />
      <PropertyHighlights />
      <WeatherWidget />
      <TouristGuide />
      <InstagramFeed />
      <LeadCapture />
      <Footer />
    </main>
  );
};

export default Index;
