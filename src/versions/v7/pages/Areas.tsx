import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite, site } from '../../../data/site'
import { usePageHref } from '../../../shared/BilingualVersion'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { AreaBody, PartnerFlags } from '../components/AreaBits'
import { ParticipateCta } from '../components/ParticipateCta'
import { PageOpening, Photo } from '../components/Story'
import { COPY } from '../lib/copy'
import { countriesForArea } from '../lib/content'
import { CONTAINER, FLIP } from '../lib/ui'

export default function AreasPage() {
  const lang = useLang()
  const t = useT(COPY)
  const href = usePageHref()
  const { areas } = getSite(lang)
  const linked = new Set(site.areas.flatMap((a) => countriesForArea('en', a.slug).map((c) => c.id))).size

  return (
    <main id="main" data-page="areas" tabIndex={-1}>
      <PageOpening
        page="areas"
        eyebrow={UI.exchange[lang]}
        title={UI.areasOfCooperation[lang]}
        lead={t('areasLead')}
        facts={[
          { label: UI.areasOfCooperation[lang], value: <bdi>{formatNumber(areas.length, lang)}</bdi> },
          { label: t('partnersLinked'), value: <bdi>{formatNumber(linked, lang)}</bdi> },
        ]}
      >
        <nav aria-label={t('areaIndex')} className="mt-14">
          <ol className="grid gap-x-10 border-t border-[var(--egeep-gold)] sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => (
              <li key={a.slug} className="border-b border-[var(--v7-hairline)]">
                <a href={`#${a.slug}`} className="v7-index-link py-3 text-xl">
                  <span className="flex items-baseline gap-4">
                    <span aria-hidden="true" className="v7-numeral-sm">
                      {formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}
                    </span>
                    {a.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageOpening>

      {areas.map((area, i) => {
        const count = countriesForArea(lang, area.slug).length
        return (
          <section
            key={area.slug}
            id={area.slug}
            aria-labelledby={`${area.slug}-title`}
            className={`scroll-mt-4 py-16 md:py-24 ${i % 2 ? 'bg-[var(--v7-surface)]' : ''}`}
          >
            <div className={CONTAINER}>
              {area.image && (
                <Photo
                  src={area.image}
                  alt={`${t('photoFrom')} ${area.title}`}
                  width={930}
                  height={600}
                  lazy={i > 0}
                  parallax
                  className="v7-reveal"
                  imgClassName="aspect-[16/9] md:aspect-[21/9]"
                />
              )}
              <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
                <div className="v7-reveal">
                  <div className="mb-5 flex items-center gap-4">
                    <span aria-hidden="true" className="v7-numeral text-primary-700">
                      {formatNumber(i + 1, 'en', { minimumIntegerDigits: 2 })}
                    </span>
                    <span aria-hidden="true" className="v7-rule w-12" />
                  </div>
                  <h2 id={`${area.slug}-title`} className="v7-h2 text-[var(--egeep-charcoal)]">
                    {area.title}
                  </h2>
                  {area.logo && (
                    <img src={area.logo} alt="" width={240} height={96} loading="lazy" className="mt-8 h-16 w-auto max-w-[14rem] object-contain" />
                  )}
                </div>
                <div className="v7-reveal space-y-10">
                  <AreaBody area={area} className="text-[var(--egeep-charcoal)]" />
                  <PartnerFlags area={area} />
                  {count > 0 && (
                    <Link to={`${href('countries')}?area=${area.slug}`} className="aegov-link v7-link">
                      {t('seePartnersIn')} {area.title}
                      <ArrowRight aria-hidden="true" className={`link-icon ${FLIP}`} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <ParticipateCta />
    </main>
  )
}
