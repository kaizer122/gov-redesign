import type { Bilingual } from './i18n'

/**
 * UI strings shared by the bilingual versions (v5–v8). Versions add their own copy in their
 * own folder with the same `Record<key, Bilingual>` shape and read both through `useT`.
 */
export const UI = {
  // Identity (DESIGN.md: EGEEP brand; the office runs the programme)
  programmeName: { en: 'Emirates Government Experience Exchange Programme', ar: 'برنامج الإمارات للتبادل المعرفي الحكومي' },
  programmeShort: { en: 'EGEEP', ar: 'برنامج التبادل المعرفي' },
  officeName: { en: 'Government Experience Exchange Office', ar: 'مكتب التبادل المعرفي الحكومي' },
  parentEntity: {
    en: "Prime Minister's Office at the Ministry of Cabinet Affairs",
    ar: 'مكتب رئاسة مجلس الوزراء بوزارة شؤون مجلس الوزراء',
  },
  country: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
  logoAlt: { en: 'Emirates Government Experience Exchange Programme', ar: 'برنامج الإمارات للتبادل المعرفي الحكومي' },

  // Slogan (site.about.slogan)
  communication: { en: 'Communication', ar: 'تواصل' },
  exchange: { en: 'Exchange', ar: 'تبادل' },
  development: { en: 'Development', ar: 'تطوير' },

  // Navigation and chrome
  skipToContent: { en: 'Skip to main content', ar: 'انتقل إلى المحتوى الرئيسي' },
  mainNavigation: { en: 'Main navigation', ar: 'القائمة الرئيسية' },
  menu: { en: 'Menu', ar: 'القائمة' },
  openMenu: { en: 'Open menu', ar: 'افتح القائمة' },
  closeMenu: { en: 'Close menu', ar: 'أغلق القائمة' },
  close: { en: 'Close', ar: 'إغلاق' },
  more: { en: 'More', ar: 'المزيد' },
  breadcrumb: { en: 'Breadcrumb', ar: 'مسار التنقل' },
  switchLanguage: { en: 'العربية', ar: 'English' },
  switchLanguageLabel: { en: 'Switch to Arabic', ar: 'التبديل إلى الإنجليزية' },
  search: { en: 'Search', ar: 'بحث' },
  searchPlaceholder: { en: 'Search countries, areas, pages', ar: 'ابحث في الدول والمجالات والصفحات' },
  searchResults: { en: 'Search results', ar: 'نتائج البحث' },
  noResults: { en: 'No results found', ar: 'لا توجد نتائج' },
  backToTop: { en: 'Back to top', ar: 'العودة إلى الأعلى' },
  opensInNewTab: { en: '(opens in a new tab)', ar: '(يفتح في علامة تبويب جديدة)' },

  // Actions
  readMore: { en: 'Read more', ar: 'اقرأ المزيد' },
  learnMore: { en: 'Learn more', ar: 'اعرف المزيد' },
  viewAll: { en: 'View all', ar: 'عرض الكل' },
  viewDetails: { en: 'View details', ar: 'عرض التفاصيل' },
  previous: { en: 'Previous', ar: 'السابق' },
  next: { en: 'Next', ar: 'التالي' },
  play: { en: 'Play', ar: 'تشغيل' },
  pause: { en: 'Pause', ar: 'إيقاف مؤقت' },
  playVideo: { en: 'Play video', ar: 'شغّل الفيديو' },
  pauseBackgroundVideo: { en: 'Pause background video', ar: 'أوقف فيديو الخلفية' },
  playBackgroundVideo: { en: 'Play background video', ar: 'شغّل فيديو الخلفية' },
  participateNow: { en: 'Participate with us', ar: 'شاركوا معنا' },
  register: { en: 'Register to participate', ar: 'سجّل للمشاركة' },
  filter: { en: 'Filter', ar: 'تصفية' },
  all: { en: 'All', ar: 'الكل' },
  sortBy: { en: 'Sort by', ar: 'ترتيب حسب' },
  clearFilters: { en: 'Clear filters', ar: 'مسح عوامل التصفية' },

  // Partnerships
  partnership: { en: 'Partnership', ar: 'الشراكة' },
  partnershipPeriod: { en: 'Partnership period', ar: 'فترة الشراكة' },
  signed: { en: 'Signed', ar: 'تاريخ التوقيع' },
  active: { en: 'Active', ar: 'سارية' },
  completed: { en: 'Completed', ar: 'مكتملة' },
  workstreams: { en: 'Workstreams', ar: 'مسارات العمل' },
  trainingHours: { en: 'Training hours', ar: 'ساعات التدريب' },
  workshops: { en: 'Workshops', ar: 'ورش العمل' },
  trainees: { en: 'Trainees', ar: 'المتدربون' },
  countries: { en: 'Countries', ar: 'الدول' },
  partnerCountries: { en: 'Partner countries', ar: 'الدول الشريكة' },
  areasOfCooperation: { en: 'Areas of cooperation', ar: 'مجالات التعاون' },
  since: { en: 'Since', ar: 'منذ' },

  // Contact
  contactUs: { en: 'Contact us', ar: 'تواصل معنا' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  address: { en: 'Address', ar: 'العنوان' },
  followUs: { en: 'Follow us', ar: 'تابعونا' },
  formName: { en: 'Full name', ar: 'الاسم الكامل' },
  formEmail: { en: 'Email address', ar: 'البريد الإلكتروني' },
  formPhone: { en: 'Phone number', ar: 'رقم الهاتف' },
  formOrganisation: { en: 'Organisation', ar: 'الجهة' },
  formSubject: { en: 'Reason for contacting us', ar: 'سبب التواصل' },
  formMessage: { en: 'Message', ar: 'الرسالة' },
  formSubmit: { en: 'Send message', ar: 'أرسل الرسالة' },
  formRequired: { en: 'Required', ar: 'مطلوب' },
  formOptional: { en: 'Optional', ar: 'اختياري' },
  formErrorRequired: { en: 'This field is required.', ar: 'هذا الحقل مطلوب.' },
  formErrorEmail: { en: 'Enter a valid email address.', ar: 'أدخل بريدًا إلكترونيًا صحيحًا.' },
  formErrorSummary: { en: 'Please correct the highlighted fields.', ar: 'يرجى تصحيح الحقول المحددة.' },
  formSuccess: {
    en: 'Thank you. Your message has been received and the office will reply by email.',
    ar: 'شكرًا لك. تم استلام رسالتك، وسيرد عليك المكتب عبر البريد الإلكتروني.',
  },

  // Footer
  copyright: {
    en: 'Government Experience Exchange Office. All rights reserved.',
    ar: 'مكتب التبادل المعرفي الحكومي. جميع الحقوق محفوظة.',
  },
  contentSource: {
    en: 'Concept prototype. Content from Wayback Machine captures of governmentexchange.gov.ae (August 2025).',
    ar: 'نموذج تصميمي. المحتوى مأخوذ من نسخ أرشيف الإنترنت لموقع governmentexchange.gov.ae (أغسطس 2025).',
  },
} satisfies Record<string, Bilingual>

export type UIKey = keyof typeof UI

/**
 * The four EGEEP programmes and their identifying colours (DESIGN.md#secondary-programme-colours).
 * Use a programme colour only to identify that programme, never as decoration.
 */
export const PROGRAMMES = [
  {
    key: 'retreats',
    name: { en: 'International Retreats', ar: 'الخلوات الدولية' },
    color: '#2f5ca0',
    token: '--egeep-blue',
  },
  {
    key: 'vip',
    name: { en: 'VIP Meetings', ar: 'لقاءات كبار الشخصيات' },
    color: '#4b3b2a',
    token: '--egeep-espresso',
  },
  {
    key: 'mou',
    name: { en: 'MOU Signings', ar: 'توقيع مذكرات التفاهم' },
    color: '#7b1f2d',
    token: '--egeep-burgundy',
  },
  {
    key: 'leadership',
    name: { en: 'Leadership Programme', ar: 'برنامج القيادات' },
    color: '#417b5d',
    token: '--egeep-green',
  },
] as const satisfies readonly { key: string; name: Bilingual; color: string; token: string }[]

export type ProgrammeKey = (typeof PROGRAMMES)[number]['key']
