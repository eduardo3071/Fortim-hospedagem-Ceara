import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import PropertyHighlights from "@/components/PropertyHighlights";
import PhotoGallery from "@/components/PhotoGallery";
import WeatherWidget from "@/components/WeatherWidget";
import TouristGuide from "@/components/TouristGuide";

import LeadCapture from "@/components/LeadCapture";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <QuickActions />
      <PropertyHighlights />
      <PhotoGallery />
      <WeatherWidget />
      <TouristGuide />
      
      <LeadCapture />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
};

export default Index;
