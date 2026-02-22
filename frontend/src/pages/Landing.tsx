import HeroHeadline from '../components/landing/HeroHeadline';
import BubbleClusterVisual from '../components/landing/BubbleClusterVisual';
import GatewayActions from '../components/landing/GatewayActions';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-surface gap-4 md:gap-8">
      <HeroHeadline />
      <BubbleClusterVisual />
      <GatewayActions />

      <footer className="mt-auto pt-12 text-xs text-gray-400">
        Surfaced &mdash; making student thinking visible
      </footer>
    </div>
  );
}
