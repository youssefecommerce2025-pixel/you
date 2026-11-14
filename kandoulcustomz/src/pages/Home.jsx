import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import FeaturedProducts from '../components/FeaturedProducts'
import BrandStory from '../components/BrandStory'
import HowItWorks from '../components/HowItWorks'
import GiftSection from '../components/GiftSection'

export default function Home({ addToCart }) {
  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts addToCart={addToCart} />
      <BrandStory />
      <HowItWorks />
      <GiftSection />
    </>
  )
}
