import Hero from '../components/Hero'
import TrustBadges from '../components/TrustBadges'
import FeaturedProducts from '../components/FeaturedProducts'
import BrandStory from '../components/BrandStory'

export default function Home({ addToCart }) {
  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts addToCart={addToCart} />
      <BrandStory />
    </>
  )
}
