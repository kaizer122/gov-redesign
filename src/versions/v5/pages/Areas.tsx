import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { getSite } from '../../../data/site'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { PROGRAMMES, UI } from '../../../shared/strings'
import { AreaBody } from '../components/AreaBody'
import { FactList, PageHeader } from '../components/PageHeader'
import { ParticipateCta } from '../components/ParticipateCta'
import { PartnerFlags } from '../components/PartnerFlags'
import { Reveal } from '../components/Reveal'
import { countriesForArea, useLinks } from '../lib/content'
import { T } from '../lib/dict'
import { CONTAINER, SECTION } from '../lib/ui'

/** Areas whose content belongs to one EGEEP programme, identified with that programme's colour. */
const AREA_PROGRAMME: Record<string, (typeof PROGRAMMES)[number]> = {
  'leadership-and-capacity-building': PROGRAMMES[3],
}

export default function AreasPage() {
  const lang = useLang()
  const t = useT(T)
  const { href } = useLinks()
  const site = getSite(lang)
  const linked = site.areas.filter((a) => countriesForArea(a.slug, lang).length > 0).length

  return (
    <main id="main" data-page="areas" tabIndex={-1}>
      <PageHeader
        page="areas"
        title={UI.areasOfCooperation[lang]}
        lead={t('areasLead')}
        aside={
          <FactList
            facts={[
              { label: UI.areasOfCooperation[lang], value: formatNumber(site.areas.length, lang) },
              { label: t('areasTakenUp'), value: formatNumber(linked, lang) },
            ]}
          />
        }
      />

      <div className={`${CONTAINER} ${SECTION} grid gap-12 pt-4! lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-20`}>
        <nav aria-label={UI.areasOfCooperation[lang]} className="lg:sticky lg:top-6 lg:self-start">
          <p className="v5-eyebrow mb-4">{t('jumpToArea')}</p>
          <ul className="grid gap-0 border-s border-[var(--egeep-grey-light)] sm:max-lg:grid-cols-2">
            {site.areas.map((area) => (
              <li key={area.slug}>
                <a
                  href={`#${area.slug}`}
                  className="-ms-px block border-s-2 border-transparent px-4 py-2 text-lg text-[var(--egeep-charcoal)] no-underline hover:border-[var(--egeep-gold)] hover:text-[var(--color-primary-800)]"
                >
                  {area.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-20 md:space-y-24">
          {site.areas.map((area) => {
            const programme = AREA_PROGRAMME[area.slug]
            const partners = countriesForArea(area.slug, lang).length
            return (
              <section key={area.slug} id={area.slug} aria-labelledby={`${area.slug}-title`} className="scroll-mt-6">
                <Reveal>
                  {area.image && (
                    <img
                      src={area.image}
                      alt=""
                      width={930}
                      height={600}
                      loading="lazy"
                      className="aspect-[21/9] w-full object-cover"
                    />
                  )}
                  <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                    <h2 id={`${area.slug}-title`} className="text-4xl text-[var(--egeep-gold)] md:text-5xl">
                      {area.title}
                    </h2>
                    {area.logo && (
                      <img src={area.logo} alt="" loading="lazy" className="h-12 w-auto max-w-[14rem] object-contain" />
                    )}
                  </div>
                  <div className="v5-hairline mt-6 mb-8" aria-hidden="true" />
                  {programme && (
                    <p className="mb-6 inline-flex items-center gap-3 border-s-4 ps-3 text-lg text-[var(--egeep-charcoal)]" style={{ borderColor: programme.color }}>
                      {programme.name[lang]}
                    </p>
                  )}
                  <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_17rem]">
                    <AreaBody area={area} className="text-lg" />
                    <div className="space-y-6">
                      <PartnerFlags slug={area.slug} />
                      <div className="flex flex-col gap-3 border-t border-[var(--egeep-grey-light)] pt-5">
                        {partners > 0 && (
                          <Link to={`${href('countries')}?area=${area.slug}`} className="aegov-link">
                            {t('viewPartnerCountries')}
                            <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
                          </Link>
                        )}
                        <Link to={href('contact')} className="aegov-link">
                          {t('enquireArea')}
                          <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </section>
            )
          })}
        </div>
      </div>

      <ParticipateCta />
    </main>
  )
}
