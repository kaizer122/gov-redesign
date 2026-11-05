import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { usePageHref } from '../../../shared/BilingualVersion'
import { useLang, useT } from '../../../shared/i18n'
import { UI } from '../../../shared/strings'
import { REGISTER_URL, useSite } from '../lib/content'
import { S } from '../lib/strings'
import { CONTAINER } from '../lib/ui'
import { ExternalLink } from './ExternalLink'

const T = {
  lead: {
    en: 'Registration opens on the programme platform. Every partnership then follows the same five stages, starting with agreeing the areas of cooperation.',
    ar: 'يبدأ التسجيل عبر منصة البرنامج، ثم تمر كل شراكة بالمراحل الخمس نفسها، بدءًا بالاتفاق على مجالات التعاون.',
  },
  alt: { en: 'The Earth at night seen from space, with city lights across continents', ar: 'الأرض ليلًا من الفضاء وأضواء المدن تمتد عبر القارات' },
}

/** Closing call to action over the earth-at-night photograph. */
export function ParticipateCta() {
  const lang = useLang()
  const t = useT(T)
  const st = useT(S)
  const href = usePageHref()
  const data = useSite()
  return (
    <section aria-labelledby="v6-participate-title" className="v6-dark relative isolate overflow-hidden">
      <img
        src="/media/hero/participate.jpg"
        alt={t('alt')}
        width={1920}
        height={1200}
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-[color:var(--egeep-charcoal)] via-[color:var(--egeep-charcoal)]/85 to-[color:var(--egeep-charcoal)]/30 md:bg-linear-to-r md:rtl:bg-linear-to-l" />
      <div className={`${CONTAINER} py-20 md:py-28`}>
        <div className="max-w-2xl">
          <p className="v6-eyebrow mb-5">{data.about.slogan.join(' · ')}</p>
          <h2 id="v6-participate-title" className="text-4xl text-[color:var(--egeep-ivory)] md:text-6xl">
            {data.hero.title}
          </h2>
          <p className="mt-6 text-xl text-[color:var(--v6-on-dark-muted)]">{t('lead')}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ExternalLink href={REGISTER_URL} className="aegov-btn btn-lg">
              {UI.participateNow[lang]}
            </ExternalLink>
            <Link to={href('contact')} className="aegov-link">
              {st('talkToOffice')}
              <ArrowRight aria-hidden="true" className="link-icon rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
