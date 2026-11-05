import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '../../../data/site'
import type { Area } from '../../../data/site'
import { Flag } from '../../../shared/Flag'
import { formatNumber, useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { PageHero } from '../components/PageHero'
import { ParticipateCta } from '../components/ParticipateCta'
import { Reveal } from '../components/Reveal'
import { countryIdsForArea, structureBody, useLinks, useSite } from '../lib/content'
import { S } from '../lib/strings'
import { CONTAINER } from '../lib/ui'

const T = {
  lead: {
    en: 'The fields in which the UAE Government shares its experience, methods and practices with partner governments. Each area lists the partner countries that have included it in their partnership.',
    ar: 'المجالات التي تشارك فيها حكومة دولة الإمارات خبراتها ومنهجياتها وممارساتها مع الحكومات الشريكة. ويعرض كل مجال الدول الشريكة التي أدرجته في شراكتها.',
  },
  takenUp: { en: 'Areas taken up by partners', ar: 'مجالات اعتمدتها دول شريكة' },
  jump: { en: 'Jump to an area', ar: 'انتقل إلى مجال' },
  partners: { en: 'Shared with {n} partner countries', ar: 'مشترك مع {n} دولة شريكة' },
  photo: { en: 'Programme event photograph for', ar: 'صورة من فعاليات البرنامج في مجال' },
}

const MAX_FLAGS = 12

export default function AreasPage() {
  const lang = useLang()
  const t = useT(T)
  const data = useSite()
  const linked = site.areas.filter((a) => countryIdsForArea(a.slug).length > 0).length

  return (
    <main id="main" data-page="areas" tabIndex={-1}>
      <PageHero
        page="areas"
        title={UI.areasOfCooperation[lang]}
        lead={t('lead')}
        facts={[
          { label: UI.areasOfCooperation[lang], value: formatNumber(data.areas.length, lang) },
          { label: t('takenUp'), value: formatNumber(linked, lang) },
        ]}
      />

      <nav aria-label={t('jump')} className="v6-ivory sticky top-0 z-20 border-b border-primary-600/20">
        <ul className={`${CONTAINER} v6-snap flex gap-2 overflow-x-auto py-4`}>
          {data.areas.map((area) => (
            <li key={area.slug}>
              <a href={`#${area.slug}`} className="v6-chip bg-whitely-50 text-[color:var(--egeep-charcoal)] no-underline">
                {area.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {data.areas.map((area, i) => (
        <AreaSection key={area.slug} area={area} index={i} />
      ))}

      <ParticipateCta />
    </main>
  )
}

function AreaSection({ area, index }: { area: Area; index: number }) {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const data = useSite()
  const links = useLinks()
  const en = site.areas[index]
  const partners = countryIdsForArea(area.slug).map((cid) => data.countries.find((c) => c.id === cid)!)
  const flipped = index % 2 === 1

  return (
    <section id={area.slug} aria-labelledby={`${area.slug}-title`} className={`scroll-mt-20 ${flipped ? 'v6-ivory' : 'bg-whitely-50'}`}>
      <div className={`${CONTAINER} grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-20`}>
        <Reveal className={flipped ? 'lg:order-2' : ''}>
          {area.image && (
            <figure className="relative">
              <img
                src={area.image}
                alt={`${t('photo')} ${area.title}`}
                width={930}
                height={600}
                loading={index < 1 ? 'eager' : 'lazy'}
                className="aspect-[31/20] w-full rounded-3xl object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-5 -start-5 size-24 rounded-full border border-primary-600/60 max-sm:hidden"
              />
            </figure>
          )}
        </Reveal>
        <div className="space-y-6">
          <p className="v6-eyebrow">
            <bdi>{formatNumber(index + 1, lang, { minimumIntegerDigits: 2 })}</bdi>
          </p>
          <h2 id={`${area.slug}-title`} className="v6-gold-heading text-4xl md:text-5xl">
            {area.title}
          </h2>
          <div className="space-y-4 text-lg">
            {structureBody(en.body, area.body).map((block) =>
              block.kind === 'p' ? (
                <p key={block.text}>{block.text}</p>
              ) : (
                <div key={block.intro}>
                  <p className="mb-2">{block.intro}</p>
                  <ul className="space-y-1">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
          {partners.length > 0 && (
            <div>
              <p className="v6-muted mb-3 text-base">{t('partners').replace('{n}', formatNumber(partners.length, lang))}</p>
              <ul className="flex flex-wrap items-center gap-2">
                {partners.slice(0, MAX_FLAGS).map((c) => (
                  <li key={c.id}>
                    <Link to={links.country(c.id)} title={c.name} className="block rounded-sm p-1">
                      <Flag iso={c.iso} alt={c.name} className="h-6 w-9 rounded-sm object-cover ring-1 ring-aeblack-900/10" />
                    </Link>
                  </li>
                ))}
                {partners.length > MAX_FLAGS && (
                  <li>
                    <Link to={`${links.href('countries')}?area=${area.slug}&view=list`} className="px-2 text-base">
                      +{formatNumber(partners.length - MAX_FLAGS, lang)} {st('more')}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-primary-600/20 pt-5">
            {partners.length > 0 && (
              <Link to={`${links.href('countries')}?area=${area.slug}`} className="aegov-link">
                {st('viewPartnerCountries')}
                <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
              </Link>
            )}
            <Link to={links.href('contact')} className="aegov-link">
              {st('enquireArea')}
              <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
