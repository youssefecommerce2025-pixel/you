import { useLang } from '../lib/i18n'

export function Terms() {
  const { t } = useLang()
  return (
    <section id="cgv" className="bg-white py-24 sm:py-28">
      <div className="container-luxe max-w-3xl">
        <span className="eyebrow">{t.cgv.eyebrow}</span>
        <h2 className="font-display mt-5 text-4xl leading-tight font-semibold sm:text-5xl">{t.cgv.title}</h2>
        <p className="mt-4 text-sm text-ink-soft">{t.cgv.updated}</p>
        <p className="mt-6 text-base leading-relaxed text-ink-soft">{t.cgv.intro}</p>
        <ol className="mt-10 space-y-8">
          {t.cgv.articles.map((article, index) => (
            <li key={article.title} className="border-t border-violet/10 pt-8">
              <h3 className="text-lg font-semibold text-violet-deep">
                {index + 1}. {article.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{article.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
