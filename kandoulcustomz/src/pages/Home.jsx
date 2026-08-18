import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import FeaturedProducts from '../components/FeaturedProducts'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import BrandStory from '../components/BrandStory'
import GiftSection from '../components/GiftSection'
import Newsletter from '../components/Newsletter'
import SocialProof from '../components/SocialProof'

export default function Home({ addToCart }) {
  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts addToCart={addToCart} />
      <HowItWorks />
      <BrandStory />
      <Testimonials />
      <GiftSection />
      <SocialProof />
      <Newsletter />
    </>
  )
}
