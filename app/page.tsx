import HeroSlider from "@/components/home/HeroSlider";
import WordmarkVideoReveal from "@/components/home/WordmarkVideoReveal";
import LifeTechSection from "@/components/home/LifeTechSection";
import InspiredSection from "@/components/home/InspiredSection";
import ChooseExperience from "@/components/home/ChooseExperience";
import OffersSlider from "@/components/home/OffersSlider";
import AlGhurairSection from "@/components/home/AlGhurairSection";
import FeaturedNews from "@/components/home/FeaturedNews";
import InstagramFeed from "@/components/home/InstagramFeed";

// Section order follows lepasuae.com; Testimonials, BestOfBothWorlds and ModelsSection stay
// available as components but have no Lepas counterpart on the home page.
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <WordmarkVideoReveal />
      <LifeTechSection />
      <InspiredSection />
      <ChooseExperience />
      <OffersSlider />
      <AlGhurairSection />
      <FeaturedNews />
      <InstagramFeed />
    </>
  );
}
