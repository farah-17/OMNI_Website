import { useEffect } from "react";
import ParticleField from "@/components/ParticleField";
import MouseSpotlight from "@/components/MouseSpotlight";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ExplodedSection from "@/components/ExplodedSection";
import SpecsSection from "@/components/SpecsSection";
import FooterSection from "@/components/FooterSection";

// Critical above-the-fold images
import omniHero from "@/assets/omni-hero.png";

// All configurator combination images
import SilverWhite from "@/assets/Silver_White.png";
import SilverBlack from "@/assets/silver_black.png";
import SilverBlue from "@/assets/Silver_blue.png";
import SilverPurple from "@/assets/Silver_Purple.png";
import MatteeWhite from "@/assets/Matte_White.png";
import MatteeBlack from "@/assets/Matte_Black.png";
import MatteeBlue from "@/assets/Matte_Blue.png";
import MatteePurple from "@/assets/Matte_Purple.png";
import MidnightWhite from "@/assets/Midnight_White.png";
import MidnightBlue from "@/assets/Midnight_Blue.png";
import MidnightPurple from "@/assets/Midnight_Purple.png";
import MidnightBlueBlack from "@/assets/MidnightBlue_Black.png";
import PurpleWhite from "@/assets/Purple_White.png";
import PurpleBlack from "@/assets/Purple_Black.png";
import PurpleBlue from "@/assets/Purple_Blue.png";
import PurplePurple from "@/assets/Purple_Purple.png";

// Detail closeup images
import closeupKeycaps from "@/assets/closeup-keycaps.jpeg";
import closeupOled from "@/assets/closeup-oled.jpeg";
import closeupEncoders from "@/assets/closeup-encoders.jpeg";
import closeupMic from "@/assets/closeup-mic.jpeg";
import closeupUsbc from "@/assets/closeup-usbc.jpeg";
import omniExploded from "@/assets/omni-exploded-nobg.png";

// Preload hero first, then all others
const CRITICAL_IMAGES = [omniHero];
const ALL_OTHER_IMAGES = [
  SilverWhite, SilverBlack, SilverBlue, SilverPurple,
  MatteeWhite, MatteeBlack, MatteeBlue, MatteePurple,
  MidnightWhite, MidnightBlue, MidnightPurple, MidnightBlueBlack,
  PurpleWhite, PurpleBlack, PurpleBlue, PurplePurple,
  closeupKeycaps, closeupOled, closeupEncoders, closeupMic, closeupUsbc,
  omniExploded,
];

const Index = () => {
  useEffect(() => {
    // Load critical images immediately
    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    // Load rest after a short delay so they don't compete with critical render
    const timer = setTimeout(() => {
      ALL_OTHER_IMAGES.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <ParticleField />
      <MouseSpotlight />
      <Navbar />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ExplodedSection />
        <SpecsSection />
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
