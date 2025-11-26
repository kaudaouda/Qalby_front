import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { PopularCampaigns } from './components/PopularCampaigns';
import { Stats } from './components/Stats';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <PopularCampaigns />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
};
