import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import FeaturedProducts from '../components/FeaturedProducts'
import BundleDeals from '../components/BundleDeals'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import BrandStory from '../components/BrandStory'
import GiftSection from '../components/GiftSection'
import Newsletter from '../components/Newsletter'

export default function Home({ addToCart }) {
  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts addToCart={addToCart} />
      <BundleDeals addToCart={addToCart} />
      <HowItWorks />
      <BrandStory />
      <Testimonials />
      <GiftSection />
      <Newsletter />
    </>
  )
}
