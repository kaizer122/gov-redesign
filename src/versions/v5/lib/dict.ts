import type { Bilingual } from '../../../shared/i18n'

/** v5 UI copy. Shared strings (identity, nav chrome, form labels) come from `UI` in shared/strings. */
export const T = {
  // Hero
  carousel: { en: 'carousel', ar: 'عرض متتابع' },
  slide: { en: 'slide', ar: 'شريحة' },
  heroLabel: { en: 'Words of leadership', ar: 'كلمات القيادة' },
  heroParticipateName: { en: 'Participate in the programme', ar: 'المشاركة في البرنامج' },
  heroParticipateBody: {
    en: 'Partner with the UAE Government to exchange experience in government development and modernisation.',
    ar: 'شاركوا حكومة دولة الإمارات في تبادل الخبرات في مجال التطوير والتحديث الحكومي.',
  },
  joinProgramme: { en: 'Join the programme', ar: 'انضموا إلى البرنامج' },
  previousSlide: { en: 'Previous slide', ar: 'الشريحة السابقة' },
  nextSlide: { en: 'Next slide', ar: 'الشريحة التالية' },
  pauseSlideshow: { en: 'Pause slideshow', ar: 'إيقاف العرض المتتابع' },
  playSlideshow: { en: 'Play slideshow', ar: 'تشغيل العرض المتتابع' },
  wordsOfLeadership: { en: 'Words of leadership', ar: 'كلمات القيادة' },

  // Home
  aboutProgramme: { en: 'About the programme', ar: 'عن البرنامج' },
  sloganHeading: { en: 'The programme in three words', ar: 'البرنامج في ثلاث كلمات' },
  sloganCommunication: {
    en: 'Direct channels between the UAE Government and the governments of participating countries.',
    ar: 'قنوات مباشرة بين حكومة دولة الإمارات وحكومات الدول المشاركة.',
  },
  sloganExchange: {
    en: 'Experience, tools and best practices shared across the areas of cooperation.',
    ar: 'تبادل الخبرات والأدوات وأفضل الممارسات في مجالات التعاون.',
  },
  sloganDevelopment: {
    en: 'Institutional capacity built for government development and modernisation.',
    ar: 'بناء القدرات المؤسسية من أجل التطوير والتحديث الحكومي.',
  },
  atAGlance: { en: 'The programme at a glance', ar: 'البرنامج في أرقام' },
  whatWeShare: { en: 'What we share', ar: 'ما نتشاركه' },
  allAreas: { en: 'All areas of cooperation', ar: 'جميع مجالات التعاون' },
  howItWorks: { en: 'How it works', ar: 'آلية العمل' },
  fiveStagesTitle: { en: 'From agreement to results in five stages', ar: 'من الاتفاق إلى النتائج في خمس مراحل' },
  methodology: { en: 'Methodology', ar: 'المنهجية' },
  latestPartnerships: { en: 'Latest partnerships', ar: 'أحدث الشراكات' },
  exploreBestPractices: { en: 'Explore UAE best practices', ar: 'تعرّف على أفضل الممارسات الإماراتية' },
  featuredFilm: { en: 'Featured film', ar: 'فيلم مختار' },
  filmHeading: { en: 'The programme on film', ar: 'البرنامج في فيلم' },
  filmIntro: {
    en: 'A film from the World Governments Summit on the Government Experience Exchange Forum.',
    ar: 'فيلم من القمة العالمية للحكومات عن منتدى تبادل الخبرات الحكومية.',
  },
  visitMediaCenter: { en: 'Visit the Media Center', ar: 'زيارة المركز الإعلامي' },
  watchOnYoutube: { en: 'Watch on YouTube', ar: 'المشاهدة على يوتيوب' },
  videoNotice: {
    en: 'The film loads from YouTube when you select play.',
    ar: 'يُحمَّل الفيلم من يوتيوب عند الضغط على زر التشغيل.',
  },
  ctaBody: {
    en: 'Registration opens on an external platform. Every partnership then follows the same five stages, starting with agreeing the areas of cooperation.',
    ar: 'يتم التسجيل عبر منصة خارجية، ثم تمر كل شراكة بالمراحل الخمس نفسها، بدءًا بالاتفاق على مجالات التعاون.',
  },
  talkToOffice: { en: 'Talk to the office', ar: 'تواصل مع المكتب' },

  // Page chrome
  onThisPage: { en: 'On this page', ar: 'في هذه الصفحة' },
  searchLabel: { en: 'Search the website', ar: 'البحث في الموقع' },
  kindPage: { en: 'Page', ar: 'صفحة' },
  kindArea: { en: 'Area of cooperation', ar: 'مجال تعاون' },
  kindCountry: { en: 'Partner country', ar: 'دولة شريكة' },
  noMatches: { en: 'No matches. Try a country or area name.', ar: 'لا توجد نتائج. جرّب اسم دولة أو مجال.' },
  footerNav: { en: 'Footer', ar: 'تذييل الصفحة' },
  footerProgramme: { en: 'The programme', ar: 'البرنامج' },
  footerPartnerships: { en: 'Partnerships', ar: 'الشراكات' },
  footerMedia: { en: 'Media and contact', ar: 'الإعلام والتواصل' },

  // Partnerships
  partnerCountry: { en: 'Partner country', ar: 'دولة شريكة' },
  status: { en: 'Status', ar: 'الحالة' },
  recordedResults: { en: 'Recorded results', ar: 'النتائج المسجلة' },
  areasInPartnership: { en: 'Areas of cooperation in this partnership', ar: 'مجالات التعاون في هذه الشراكة' },
  askAboutPartnership: { en: 'Ask about this partnership', ar: 'استفسر عن هذه الشراكة' },
  seePartnershipActivity: { en: 'See partnership activity', ar: 'الاطلاع على أنشطة الشراكات' },

  // About
  aboutTitle: { en: 'About the programme', ar: 'عن البرنامج' },
  overview: { en: 'Overview', ar: 'نظرة عامة' },
  toolsTitle: { en: 'Knowledge-transfer tools', ar: 'أدوات نقل المعرفة' },
  howPartnershipsWork: { en: 'How partnerships work', ar: 'آلية عمل الشراكات' },
  howPartnershipsIntro: {
    en: 'Every partnership between the UAE Government and a participating country follows the same five stages.',
    ar: 'تمر كل شراكة بين حكومة دولة الإمارات ودولة مشاركة بالمراحل الخمس نفسها.',
  },
  byTheNumbers: { en: 'By the numbers', ar: 'بالأرقام' },
  byTheNumbersTitle: { en: 'The programme by the numbers', ar: 'البرنامج بالأرقام' },
  launched: { en: 'Launched', ar: 'سنة الإطلاق' },
  participatingCountries: { en: 'Participating countries', ar: 'الدول المشاركة' },
  partnershipStages: { en: 'Partnership stages', ar: 'مراحل الشراكة' },
  programmesTitle: { en: 'Programme streams', ar: 'مسارات البرنامج' },
  programmesIntro: {
    en: 'EGEEP runs four programmes. Each has its own colour, used across the website only to identify that programme.',
    ar: 'يضم البرنامج أربعة مسارات، لكل منها لون خاص لا يُستخدم في الموقع إلا للدلالة على ذلك المسار.',
  },
  howKnowledgeTransfers: { en: 'How knowledge is transferred', ar: 'كيف تُنقل المعرفة' },
  partnershipLifecycle: { en: 'Partnership lifecycle', ar: 'دورة الشراكة' },

  // Areas
  areasLead: {
    en: 'The fields in which the UAE Government shares its experience, methods and best practices with partner governments. Each area lists the partner countries that have included it in their partnership.',
    ar: 'المجالات التي تتشارك فيها حكومة دولة الإمارات خبراتها ومنهجياتها وأفضل ممارساتها مع الحكومات الشريكة. ويعرض كل مجال الدول الشريكة التي أدرجته في شراكتها.',
  },
  areasTakenUp: { en: 'Areas taken up by partners', ar: 'مجالات اعتمدها الشركاء' },
  jumpToArea: { en: 'Jump to an area', ar: 'الانتقال إلى مجال' },
  viewPartnerCountries: { en: 'View partner countries', ar: 'عرض الدول الشريكة' },
  enquireArea: { en: 'Enquire about this area', ar: 'استفسر عن هذا المجال' },

  // Countries
  countriesTitle: { en: 'Participating countries', ar: 'الدول المشاركة' },
  countriesLead: {
    en: 'Governments that have signed partnerships with the UAE Government through the programme. Filter by area of cooperation or status, and select a country for its partnership period, workstreams and recorded results.',
    ar: 'الحكومات التي وقّعت شراكات مع حكومة دولة الإمارات عبر البرنامج. يمكنك التصفية حسب مجال التعاون أو الحالة، واختيار دولة للاطلاع على فترة الشراكة ومسارات العمل والنتائج المسجلة.',
  },
  activePartnerships: { en: 'Active partnerships', ar: 'الشراكات السارية' },
  firstSigned: { en: 'First partnerships signed', ar: 'توقيع أولى الشراكات' },
  countryList: { en: 'Country list', ar: 'قائمة الدول' },
  filterCountries: { en: 'Filter participating countries', ar: 'تصفية الدول المشاركة' },
  countryName: { en: 'Country name', ar: 'اسم الدولة' },
  countryNameExample: { en: 'For example, Egypt', ar: 'مثلًا: مصر' },
  areaOfCooperation: { en: 'Area of cooperation', ar: 'مجال التعاون' },
  partnershipStatus: { en: 'Partnership status', ar: 'حالة الشراكة' },
  allStatuses: { en: 'All statuses', ar: 'جميع الحالات' },
  sortName: { en: 'Name', ar: 'الاسم' },
  sortNewest: { en: 'Newest partnership first', ar: 'الأحدث شراكةً أولًا' },
  sortOldest: { en: 'Oldest partnership first', ar: 'الأقدم شراكةً أولًا' },
  noCountryMatch: {
    en: 'No country matches these filters. Clear the filters or try another name.',
    ar: 'لا توجد دولة تطابق عوامل التصفية. امسح عوامل التصفية أو جرّب اسمًا آخر.',
  },

  // Best practices
  bestPracticesTitle: { en: 'Best practices', ar: 'أفضل الممارسات' },
  bestPracticesLead: {
    en: 'Proven UAE government practices that partner governments can learn from, adapt and build on, drawn from each area of cooperation.',
    ar: 'ممارسات حكومية إماراتية مجرّبة يمكن للحكومات الشريكة التعلم منها وتكييفها والبناء عليها، مستمدة من كل مجال من مجالات التعاون.',
  },
  ourApproach: { en: 'Our approach', ar: 'نهجنا' },
  featuredPractices: { en: 'Featured practices', ar: 'ممارسات مختارة' },
  featuredPracticesIntro: {
    en: 'One flagship practice from each area of cooperation. Expand a practice to read how it works in the UAE and which partner countries have taken it up.',
    ar: 'ممارسة رئيسية من كل مجال تعاون. افتح أي ممارسة لتتعرف على تطبيقها في دولة الإمارات والدول الشريكة التي اعتمدتها.',
  },
  howTransferred: { en: 'How practices are transferred', ar: 'كيف تُنقل الممارسات' },
  transferFormats: { en: 'Transfer formats', ar: 'أشكال نقل المعرفة' },
  whatPartnersAdopt: { en: 'What partners can adopt', ar: 'ما يمكن للشركاء اعتماده' },
  fromUaeToPartners: { en: 'From the UAE to partner governments', ar: 'من الإمارات إلى الحكومات الشريكة' },
  fiveStagesLink: { en: 'The five partnership stages', ar: 'مراحل الشراكة الخمس' },

  // Activities
  activitiesTitle: { en: 'Activities', ar: 'الأنشطة' },
  activitiesLead: {
    en: 'How the programme turns signed partnerships into workshops, training and field work, and what each partnership has recorded so far.',
    ar: 'كيف يحوّل البرنامج الشراكات الموقعة إلى ورش عمل وتدريب وعمل ميداني، وما سجلته كل شراكة حتى الآن.',
  },
  activityFormats: { en: 'Activity formats', ar: 'أشكال الأنشطة' },
  activityFormatsIntro: {
    en: 'Knowledge is exchanged through virtual and physical formats, from design-thinking workshops and field visits to capacity-building programmes and publications.',
    ar: 'تُتبادل المعرفة بأشكال افتراضية وحضورية، من ورش التفكير التصميمي والزيارات الميدانية إلى برامج بناء القدرات والإصدارات.',
  },
  whatHappens: { en: 'What happens in a partnership', ar: 'ما يجري في الشراكة' },
  lifecycleTitle: { en: 'Five stages, from agreement to documented achievements', ar: 'خمس مراحل، من الاتفاق إلى توثيق الإنجازات' },
  partnershipRecord: { en: 'Partnership record', ar: 'سجل الشراكات' },
  recordTitle: { en: 'Partnerships by year and results', ar: 'الشراكات حسب السنة والنتائج' },
  recordIntro: {
    en: 'Browse partnerships by the year they were signed, or compare the training hours, workshops and trainees each partnership has reported.',
    ar: 'تصفح الشراكات حسب سنة توقيعها، أو قارن ساعات التدريب وورش العمل وأعداد المتدربين التي سجلتها كل شراكة.',
  },
  recordViews: { en: 'Partnership record views', ar: 'طرق عرض سجل الشراكات' },
  timelineTab: { en: 'Timeline by signing year', ar: 'حسب سنة التوقيع' },
  resultsTab: { en: 'Results by partnership', ar: 'النتائج حسب الشراكة' },
  resultsCaption: {
    en: 'Recorded results by partnership. Select a column heading to sort.',
    ar: 'النتائج المسجلة حسب الشراكة. اختر عنوان عمود للترتيب.',
  },
  resultsNote: {
    en: 'Figures are as reported for each partnership. A dash means the partnership has not reported that figure.',
    ar: 'الأرقام كما أعلنتها كل شراكة. وتعني الشرطة أن الشراكة لم تعلن هذا الرقم.',
  },
  notReported: { en: 'Not reported', ar: 'غير معلن' },
  reportingResults: { en: 'Partnerships reporting results', ar: 'شراكات أعلنت نتائجها' },
  inTheMedia: { en: 'In the media', ar: 'في الإعلام' },
  latestFromMedia: { en: 'Latest from the Media Center', ar: 'أحدث ما في المركز الإعلامي' },
  typePhoto: { en: 'Photo', ar: 'صورة' },

  // Media
  mediaTitle: { en: 'Media Center', ar: 'المركز الإعلامي' },
  mediaLead: {
    en: "News and photos from the programme, leadership messages, the featured film and the programme's official channels.",
    ar: 'أخبار البرنامج وصوره، وكلمات القيادة، والفيلم المختار، والقنوات الرسمية للبرنامج.',
  },
  latest: { en: 'Latest', ar: 'الأحدث' },
  fromTheProgramme: { en: 'From the programme', ar: 'من البرنامج' },
  photoGallery: { en: 'Photo gallery', ar: 'معرض الصور' },
  programmeImagery: { en: 'Programme imagery', ar: 'صور البرنامج' },
  galleryIntro: {
    en: 'Official portraits that accompany leadership messages, and photography from each area of cooperation. Select a photo to enlarge it.',
    ar: 'الصور الرسمية المرافقة لكلمات القيادة، وصور من كل مجال من مجالات التعاون. اختر صورة لتكبيرها.',
  },
  galleryPhotos: { en: 'Gallery photos', ar: 'صور المعرض' },
  officialChannels: { en: 'Official channels', ar: 'القنوات الرسمية' },
  channelsIntro: {
    en: "Follow the programme's official accounts for news, events and updates.",
    ar: 'تابعوا الحسابات الرسمية للبرنامج للاطلاع على الأخبار والفعاليات والمستجدات.',
  },
  mediaEnquiries: { en: 'Media enquiries', ar: 'الاستفسارات الإعلامية' },
  openContactForm: { en: 'Open the contact form', ar: 'فتح نموذج التواصل' },
  viewPhoto: { en: 'View photo', ar: 'عرض الصورة' },

  // Contact
  faqTitle: { en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
  faqIntro: { en: "Quick answers drawn from the programme's published information.", ar: 'إجابات سريعة مستمدة من المعلومات المنشورة عن البرنامج.' },
  faqWhat: { en: 'What is the Government Experience Exchange Programme?', ar: 'ما برنامج تبادل الخبرات الحكومية؟' },
  faqJoin: { en: 'How can my government take part?', ar: 'كيف يمكن لحكومتي المشاركة؟' },
  faqJoinAnswer: {
    en: "Register on the programme's participation platform, or contact the office using the details on this page.",
    ar: 'سجّل عبر منصة المشاركة في البرنامج، أو تواصل مع المكتب باستخدام البيانات الواردة في هذه الصفحة.',
  },
  faqStages: { en: 'What happens once a partnership is agreed?', ar: 'ماذا يحدث بعد الاتفاق على الشراكة؟' },
  faqAreas: { en: 'Which areas can we cooperate on?', ar: 'ما المجالات التي يمكن التعاون فيها؟' },
  faqFormats: { en: 'How is knowledge shared with partner governments?', ar: 'كيف تُنقل المعرفة إلى الحكومات الشريكة؟' },
  exploreAreas: { en: 'Explore the areas of cooperation', ar: 'استكشف مجالات التعاون' },
  sendMessage: { en: 'Send us a message', ar: 'أرسل إلينا رسالة' },
  requiredNote: { en: 'Fields marked with * are required.', ar: 'الحقول المميزة بعلامة * إلزامية.' },
  chooseSubject: { en: 'Choose a reason', ar: 'اختر السبب' },
  consentShort: { en: 'Consent', ar: 'الموافقة' },
  consentError: {
    en: 'Confirm that the office may contact you about this request.',
    ar: 'يرجى تأكيد موافقتك على تواصل المكتب معك بشأن هذا الطلب.',
  },
  urgentCall: { en: 'For urgent matters, call', ar: 'للأمور العاجلة، اتصل على' },
  orEmail: { en: 'or email', ar: 'أو راسلنا على' },
  messageSubmitted: { en: 'Message submitted', ar: 'تم إرسال الرسالة' },
  contactDetails: { en: 'Contact details', ar: 'بيانات التواصل' },
  openingHours: { en: 'Opening hours', ar: 'ساعات العمل' },
  followProgramme: { en: 'Follow the programme', ar: 'تابعوا البرنامج' },
  readyToPartner: { en: 'Ready to partner with the UAE?', ar: 'هل أنتم مستعدون للشراكة مع دولة الإمارات؟' },
  readyToPartnerBody: {
    en: "Register your government's interest on the participation platform.",
    ar: 'سجّلوا اهتمام حكومتكم عبر منصة المشاركة.',
  },
} satisfies Record<string, Bilingual>

export type DictKey = keyof typeof T

type Format<A extends unknown[]> = Bilingual<(...args: A) => string>

/** Copy with values in it. Numbers are passed through as Western digits. */
export const F = {
  slideOf: {
    en: (n: number, total: number, name: string) => `${n} of ${total}: ${name}`,
    ar: (n: number, total: number, name: string) => `${n} من ${total}: ${name}`,
  } satisfies Format<[number, number, string]>,
  stage: {
    en: (n: number) => `Stage ${n}`,
    ar: (n: number) => `المرحلة ${n}`,
  } satisfies Format<[number]>,
  sinceLaunch: {
    en: (year: string) => `Since the programme's launch in ${year}`,
    ar: (year: string) => `منذ إطلاق البرنامج في عام ${year}`,
  } satisfies Format<[string]>,
  areasIntro: {
    en: (n: number) => `${n} fields in which the UAE Government transfers its experience, tools and best practices to partner governments.`,
    ar: (n: number) => `${n} مجالات تنقل فيها حكومة دولة الإمارات خبراتها وأدواتها وأفضل ممارساتها إلى الحكومات الشريكة.`,
  } satisfies Format<[number]>,
  partnershipsIntro: {
    en: (total: number, active: number) =>
      `${total} participating countries have partnered with the UAE through the programme, and ${active} partnerships are active. Select a country for its partnership details.`,
    ar: (total: number, active: number) =>
      `عدد الدول المشاركة التي عقدت شراكات مع دولة الإمارات عبر البرنامج: ${total}، منها ${active} شراكة سارية. اختر دولة للاطلاع على تفاصيل شراكتها.`,
  } satisfies Format<[number, number]>,
  allCountries: {
    en: (n: number) => `All ${n} countries`,
    ar: (n: number) => `جميع الدول (${n})`,
  } satisfies Format<[number]>,
  portraitOf: {
    en: (name: string) => `Portrait of ${name}`,
    ar: (name: string) => `صورة ${name}`,
  } satisfies Format<[string]>,
  sharedWith: {
    en: (n: number) => `Shared with ${n} partner ${n === 1 ? 'country' : 'countries'}`,
    ar: (n: number) => `عدد الدول الشريكة في هذا المجال: ${n}`,
  } satisfies Format<[number]>,
  searchStatus: {
    en: (n: number, q: string) => `${n} ${n === 1 ? 'result' : 'results'} for ${q}`,
    ar: (n: number, q: string) => `عدد النتائج عن "${q}": ${n}`,
  } satisfies Format<[number, string]>,
  toolsIntro: {
    en: (n: number) => `The programme shares UAE experience through ${n} formats, from hands-on workshops and field visits to published white papers.`,
    ar: (n: number) => `ينقل البرنامج الخبرة الإماراتية عبر ${n} أشكال، من ورش العمل التطبيقية والزيارات الميدانية إلى الأوراق البيضاء المنشورة.`,
  } satisfies Format<[number]>,
  showing: {
    en: (shown: number, total: number, area?: string) => `Showing ${shown} of ${total} countries${area ? ` with ${area}` : ''}`,
    ar: (shown: number, total: number, area?: string) => `عرض ${shown} من أصل ${total} دولة${area ? ` في مجال ${area}` : ''}`,
  } satisfies Format<[number, number, string?]>,
  areaLabel: {
    en: (area: string) => `Area: ${area}`,
    ar: (area: string) => `المجال: ${area}`,
  } satisfies Format<[string]>,
  goTo: {
    en: (name: string) => `Go to ${name}`,
    ar: (name: string) => `الانتقال إلى ${name}`,
  } satisfies Format<[string]>,
  timelineLegend: {
    en: (programme: string) => `Each partnership starts with a memorandum of understanding (${programme}).`,
    ar: (programme: string) => `تبدأ كل شراكة بتوقيع مذكرة تفاهم (${programme}).`,
  } satisfies Format<[string]>,
  signedCount: {
    en: (n: number) => `${n} ${n === 1 ? 'partnership' : 'partnerships'} signed`,
    ar: (n: number) => `عدد الشراكات الموقعة: ${n}`,
  } satisfies Format<[number]>,
  workstreamCount: {
    en: (n: number) => `${n} workstreams`,
    ar: (n: number) => `مسارات العمل: ${n}`,
  } satisfies Format<[number]>,
  enquiriesBody: {
    en: (office: string) => `Journalists and partners can reach the ${office} directly, or send a message through the contact form.`,
    ar: (office: string) => `يمكن للصحفيين والشركاء التواصل مع ${office} مباشرة، أو إرسال رسالة عبر نموذج التواصل.`,
  } satisfies Format<[string]>,
  contactLead: {
    en: (office: string) =>
      `Questions about partnerships, training or the programme's areas of cooperation? Contact the ${office} by phone, email or the form below.`,
    ar: (office: string) =>
      `هل لديك استفسار عن الشراكات أو التدريب أو مجالات التعاون في البرنامج؟ تواصل مع ${office} عبر الهاتف أو البريد الإلكتروني أو النموذج أدناه.`,
  } satisfies Format<[string]>,
  minMessage: {
    en: (n: number) => `Enter a message of at least ${n} characters.`,
    ar: (n: number) => `أدخل رسالة لا تقل عن ${n} حرفًا.`,
  } satisfies Format<[number]>,
  consent: {
    en: (office: string) => `I agree that the ${office} may contact me about this request.`,
    ar: (office: string) => `أوافق على أن يتواصل معي ${office} بشأن هذا الطلب.`,
  } satisfies Format<[string]>,
  moreCountries: {
    en: (n: number) => `${n} more`,
    ar: (n: number) => `المزيد (${n})`,
  } satisfies Format<[number]>,
  thanks: {
    en: (office: string) => `Thank you for contacting the ${office}.`,
    ar: (office: string) => `شكرًا لتواصلك مع ${office}.`,
  } satisfies Format<[string]>,
}
