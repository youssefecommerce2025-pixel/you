import { Header } from './components/Header'
import { LangProvider } from './lib/i18n'
import { StudioProvider } from './lib/studio'
import { Atelier } from './sections/Atelier'
import { Compare } from './sections/Compare'
import { Diagnostic } from './sections/Diagnostic'
import { Faq } from './sections/Faq'
import { Terms } from './sections/Terms'
import { FinalCta, Footer, WhatsAppFab } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Method } from './sections/Method'
import { Offers } from './sections/Offers'
import { Story } from './sections/Story'

export default function App() {
  return (
    <LangProvider>
      <StudioProvider>
        <Header />
        <main>
          <Hero />
          <Story />
          <Atelier />
          <Compare />
          <Offers />
          <Method />
          <Diagnostic />
          <Faq />
          <Terms />
          <FinalCta />
        </main>
        <Footer />
        <WhatsAppFab />
      </StudioProvider>
    </LangProvider>
  )
}
