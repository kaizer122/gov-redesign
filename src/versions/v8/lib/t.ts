import type { Bilingual } from '../../../shared/i18n'
import type { Region } from '../../../shared/geo'
import type { PartnershipStatus } from './content'

/** v8 UI copy shared across components. Page-specific copy lives with each page. */
export const T = {
  // Chrome
  homeLink: { en: 'Home page', ar: 'الصفحة الرئيسية' },
  searchSite: { en: 'Search the site', ar: 'ابحث في الموقع' },
  searchShortcut: { en: 'Keyboard shortcut', ar: 'اختصار لوحة المفاتيح' },
  paletteHint: {
    en: 'Arrow keys to move, Enter to open, Esc to close',
    ar: 'مفاتيح الأسهم للتنقل، و Enter للفتح، و Esc للإغلاق',
  },
  kindPage: { en: 'Page', ar: 'صفحة' },
  kindArea: { en: 'Area of cooperation', ar: 'مجال تعاون' },
  kindCountry: { en: 'Partner country', ar: 'دولة شريكة' },
  groupPages: { en: 'Pages', ar: 'الصفحات' },
  groupAreas: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  groupCountries: { en: 'Partner countries', ar: 'الدول الشريكة' },
  resultCount: { en: '{n} results', ar: 'عدد النتائج: {n}' },
  noMatch: { en: 'No matches. Try a country or area name.', ar: 'لا توجد نتائج مطابقة. جرّب اسم دولة أو مجال.' },
  footerProgramme: { en: 'The programme', ar: 'البرنامج' },
  footerPartnerships: { en: 'Partnerships', ar: 'الشراكات' },
  footerMedia: { en: 'Media and contact', ar: 'الإعلام والتواصل' },
  footerNav: { en: 'Footer', ar: 'روابط التذييل' },
  onThisPage: { en: 'On this page', ar: 'في هذه الصفحة' },
  dialogClose: { en: 'Close dialog', ar: 'أغلق النافذة' },

  // Partnerships
  status: { en: 'Status', ar: 'الحالة' },
  region: { en: 'Region', ar: 'المنطقة' },
  allStatuses: { en: 'All statuses', ar: 'جميع الحالات' },
  allRegions: { en: 'All regions', ar: 'جميع المناطق' },
  allAreas: { en: 'All areas', ar: 'جميع المجالات' },
  allYears: { en: 'All years', ar: 'جميع السنوات' },
  notReported: { en: 'Not reported', ar: 'غير متوفر' },
  recordedResults: { en: 'Recorded results', ar: 'النتائج المسجلة' },
  areasInPartnership: { en: 'Areas of cooperation in this partnership', ar: 'مجالات التعاون في هذه الشراكة' },
  workstreamsListed: { en: 'Workstreams listed', ar: 'مسارات العمل المدرجة' },
  askAboutPartnership: { en: 'Ask about this partnership', ar: 'استفسر عن هذه الشراكة' },
  seeSignings: { en: 'See partnership signings', ar: 'اطّلع على توقيعات الشراكات' },
  partnersCount: { en: '{n} partner countries', ar: 'الدول الشريكة: {n}' },
  sharedWith: { en: 'Shared with {n} partner countries', ar: 'مجال مشترك مع {n} من الدول الشريكة' },
  moreCountries: { en: '+{n} more', ar: '+{n} أخرى' },
  noPartnersYet: {
    en: 'No partner country lists this area by name in its workstreams.',
    ar: 'لم تُدرج أي دولة شريكة هذا المجال باسمه ضمن مسارات العمل.',
  },
  signedIn: { en: 'Signed in {year}', ar: 'وُقّعت في {year}' },

  // Charts
  showTable: { en: 'Show data table', ar: 'اعرض جدول البيانات' },
  hideTable: { en: 'Hide data table', ar: 'أخفِ جدول البيانات' },
  chartKeys: { en: 'Use the arrow keys to read each value.', ar: 'استخدم مفاتيح الأسهم لقراءة كل قيمة.' },

  // Participate
  ctaBody: {
    en: 'Registration opens on an external platform. Every partnership then follows the same five stages, starting with agreeing the areas of cooperation.',
    ar: 'يتم التسجيل عبر منصة خارجية، ثم تمر كل شراكة بالمراحل الخمس نفسها، بدءًا بالاتفاق على مجالات التعاون.',
  },
  talkToOffice: { en: 'Talk to the office', ar: 'تواصل مع المكتب' },

  // Workflow
  stage: { en: 'Stage {n}', ar: 'المرحلة {n}' },

  // Video
  filmNotice: { en: 'Playing loads the film from YouTube.', ar: 'يؤدي التشغيل إلى تحميل الفيلم من يوتيوب.' },
  watchOnYoutube: { en: 'Watch on YouTube', ar: 'شاهد على يوتيوب' },
  filmLabel: { en: 'Film', ar: 'فيلم' },
} satisfies Record<string, Bilingual>

export const STATUS_LABEL: Record<PartnershipStatus, Bilingual> = {
  active: { en: 'Active', ar: 'سارية' },
  completed: { en: 'Completed', ar: 'مكتملة' },
}

export const REGIONS: Region[] = ['africa', 'americas', 'asia', 'europe', 'middle-east']

/** Plain-language labels for the figures in `site.stats`, keyed by the English label. */
export const STAT_LABEL: Record<string, Bilingual> = {
  Country: { en: 'Partner countries', ar: 'الدول الشريكة' },
  'UAE Government Entity': { en: 'UAE government entities', ar: 'الجهات الحكومية الإماراتية' },
  Expert: { en: 'Experts', ar: 'الخبراء' },
  'Training Hour': { en: 'Training hours', ar: 'ساعات التدريب' },
  Workshop: { en: 'Workshops', ar: 'ورش العمل' },
  Trainee: { en: 'Trainees', ar: 'المتدربون' },
  Countries: { en: 'Countries', ar: 'الدول' },
  'Area of cooperation': { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  'Workshops delivered': { en: 'Workshops delivered', ar: 'ورش العمل المنفذة' },
  Trainees: { en: 'Trainees', ar: 'المتدربون' },
}

/** Labels for the per-country metrics, keyed by the English stat label. */
export const METRIC_LABEL: Record<string, Bilingual> = {
  Workstreams: { en: 'Workstreams', ar: 'مسارات العمل' },
  'Training hours': { en: 'Training hours', ar: 'ساعات التدريب' },
  Workshops: { en: 'Workshops', ar: 'ورش العمل' },
  Trainees: { en: 'Trainees', ar: 'المتدربون' },
}
