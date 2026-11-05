/**
 * Approximate map position of each partner, as [latitude, longitude] of its capital (Erbil for the
 * Kurdistan Region of Iraq), keyed by country id in data/site.json. Precise enough for markers on
 * a world-scale map or globe; not survey data.
 */
export const COUNTRY_COORDS: Record<number, readonly [lat: number, lon: number]> = {
  193: [-15.79, -47.88], // Federative Republic of Brazil
  194: [42.44, 19.26], // Republic of Montenegro
  195: [-6.21, 106.85], // Republic of Indonesia
  196: [23.11, -82.37], // Republic of Cuba
  197: [18.49, -69.93], // Dominican Republic
  3: [30.04, 31.24], // The Arab Republic of Egypt
  149: [44.79, 20.45], // Republic of Serbia
  18: [31.95, 35.93], // Hashemite Kingdom of Jordan
  25: [41.3, 69.24], // Republic of Uzbekistan
  146: [4.18, 73.51], // Republic of Maldives
  24: [9.93, -84.09], // Republic of Costa Rica
  153: [-1.95, 30.06], // Republic of Rwanda
  26: [14.72, -17.47], // Republic of Senegal
  147: [-4.62, 55.45], // Republic of Seychelles
  27: [37.98, 23.73], // Hellenic Republic
  88: [15.5, 32.56], // Republic of Sudan
  150: [6.8, -58.16], // Co-operative Republic of Guyana
  28: [33.31, 44.37], // Republic of Iraq
  143: [42.87, 74.59], // Kyrgyz Republic
  13: [4.71, -74.07], // Republic of Colombia
  182: [-18.88, 47.51], // Republic of Madagascar
  145: [40.42, -3.7], // Kingdom of Spain
  148: [13.1, -59.61], // Republic of Barbados
  183: [47.89, 106.91], // Mongolia
  151: [4.39, 18.56], // Central African Republic
  154: [-25.26, -57.58], // Republic of Paraguay
  155: [41.72, 44.79], // Republic of Georgia
  156: [41.33, 19.82], // Republic of Albania
  157: [35.9, 14.51], // Republic of Malta
  158: [36.19, 44.01], // Kurdistan Region of Iraq
  159: [51.17, 71.43], // Republic of Kazakhstan
  160: [37.96, 58.33], // Turkmenistan
  162: [-17.83, 31.05], // Republic of Zimbabwe
  161: [44.43, 26.1], // Romania
  180: [9.03, 38.74], // The Federal Democratic Republic of Ethiopia
  184: [0.35, 32.58], // The Republic Uganda
  188: [6.83, -5.29], // Côte d'Ivoire
  189: [14.6, 120.98], // The Republic of the Philippines
  163: [40.41, 49.87], // Republic of Azerbaijan
  181: [4.9, 114.94], // Brunei Darussalam
  190: [21.03, 105.85], // Socialist Republic of Vietnam
  185: [-26.31, 31.14], // Kingdom of Eswatini
  186: [32.29, -64.78], // Bermuda
  187: [-1.29, 36.82], // The Republic of Kenya
  192: [42.51, 1.52], // Principality of Andorra
}

/** The UAE (Abu Dhabi), origin of every partnership. */
export const UAE_COORDS = [24.45, 54.38] as const

export type Region = 'africa' | 'americas' | 'asia' | 'europe' | 'middle-east'

/** Region of each partner, keyed by country id. */
export const COUNTRY_REGION: Record<number, Region> = {
  193: 'americas',
  194: 'europe',
  195: 'asia',
  196: 'americas',
  197: 'americas',
  3: 'middle-east',
  149: 'europe',
  18: 'middle-east',
  25: 'asia',
  146: 'asia',
  24: 'americas',
  153: 'africa',
  26: 'africa',
  147: 'africa',
  27: 'europe',
  88: 'africa',
  150: 'americas',
  28: 'middle-east',
  143: 'asia',
  13: 'americas',
  182: 'africa',
  145: 'europe',
  148: 'americas',
  183: 'asia',
  151: 'africa',
  154: 'americas',
  155: 'europe',
  156: 'europe',
  157: 'europe',
  158: 'middle-east',
  159: 'asia',
  160: 'asia',
  162: 'africa',
  161: 'europe',
  180: 'africa',
  184: 'africa',
  188: 'africa',
  189: 'asia',
  163: 'asia',
  181: 'asia',
  190: 'asia',
  185: 'africa',
  186: 'americas',
  187: 'africa',
  192: 'europe',
}

export const REGION_LABEL: Record<Region, { en: string; ar: string }> = {
  africa: { en: 'Africa', ar: 'أفريقيا' },
  americas: { en: 'Americas', ar: 'الأمريكتان' },
  asia: { en: 'Asia', ar: 'آسيا' },
  europe: { en: 'Europe', ar: 'أوروبا' },
  'middle-east': { en: 'Middle East', ar: 'الشرق الأوسط' },
}
