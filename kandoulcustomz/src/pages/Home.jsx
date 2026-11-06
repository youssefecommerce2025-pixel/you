import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import FeaturedProducts from '../components/FeaturedProducts'
import BundleDeals from '../components/BundleDeals'
import BrandStory from '../components/BrandStory'
import GiftSection from '../components/GiftSection'

export default function Home({ addToCart }) {
  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts addToCart={addToCart} />
      <BundleDeals addToCart={addToCart} />
      <BrandStory />
      <GiftSection />
    </>
  )
}
