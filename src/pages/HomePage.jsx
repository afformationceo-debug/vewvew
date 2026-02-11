import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import CountryConsultSection from '../components/home/CountryConsultSection';
import PopularPackages from '../components/home/PopularPackages';
import ExploreByTreatment from '../components/home/ExploreByTreatment';
import FlashDeals from '../components/home/FlashDeals';
import ReviewsHighlight from '../components/home/ReviewsHighlight';
import EventBanners from '../components/home/EventBanners';
import AppDownload from '../components/home/AppDownload';

export default function HomePage() {
  return (
    <div className="pb-16 md:pb-0">
      <HeroSection />
      <section className="max-w-3xl md:max-w-5xl mx-auto px-4 py-5 md:py-6"><CategoryGrid /></section>
      <section className="max-w-3xl md:max-w-5xl mx-auto px-4 py-1"><CountryConsultSection /></section>
      <section className="max-w-3xl md:max-w-5xl mx-auto px-4 py-5 md:py-6"><PopularPackages /></section>
      <section className="max-w-3xl md:max-w-5xl mx-auto px-4 py-5 md:py-6"><ExploreByTreatment /></section>
      <FlashDeals />
      <section className="max-w-3xl md:max-w-5xl mx-auto px-4 py-5 md:py-6"><ReviewsHighlight /></section>
      <section className="max-w-3xl md:max-w-5xl mx-auto px-4 py-5 md:py-6"><EventBanners /></section>
      <AppDownload />
    </div>
  );
}
