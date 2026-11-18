export type Zone = 'axe' | 'grande' | 'moyenne' | 'eloignee'

// Delays published on amerray.com: Casablanca–Rabat axis 24 h, big cities 24-48 h,
// mid-size cities 48-72 h, remote regions 3-5 days.
const ZONE_DAYS: Record<Zone, [number, number]> = {
  axe: [1, 1],
  grande: [1, 2],
  moyenne: [2, 3],
  eloignee: [3, 5],
}

export const CITIES: { name: string; ar: string; zone: Zone }[] = [
  { name: 'Casablanca', ar: 'الدار البيضاء', zone: 'axe' },
  { name: 'Rabat', ar: 'الرباط', zone: 'axe' },
  { name: 'Salé', ar: 'سلا', zone: 'axe' },
  { name: 'Témara', ar: 'تمارة', zone: 'axe' },
  { name: 'Mohammedia', ar: 'المحمدية', zone: 'axe' },
  { name: 'Skhirat', ar: 'الصخيرات', zone: 'axe' },
  { name: 'Bouskoura', ar: 'بوسكورة', zone: 'axe' },
  { name: 'Berrechid', ar: 'برشيد', zone: 'grande' },
  { name: 'Marrakech', ar: 'مراكش', zone: 'grande' },
  { name: 'Fès', ar: 'فاس', zone: 'grande' },
  { name: 'Tanger', ar: 'طنجة', zone: 'grande' },
  { name: 'Meknès', ar: 'مكناس', zone: 'grande' },
  { name: 'Agadir', ar: 'أكادير', zone: 'grande' },
  { name: 'Kénitra', ar: 'القنيطرة', zone: 'grande' },
  { name: 'Oujda', ar: 'وجدة', zone: 'grande' },
  { name: 'Tétouan', ar: 'تطوان', zone: 'grande' },
  { name: 'El Jadida', ar: 'الجديدة', zone: 'moyenne' },
  { name: 'Settat', ar: 'سطات', zone: 'moyenne' },
  { name: 'Khouribga', ar: 'خريبكة', zone: 'moyenne' },
  { name: 'Beni Mellal', ar: 'بني ملال', zone: 'moyenne' },
  { name: 'Safi', ar: 'آسفي', zone: 'moyenne' },
  { name: 'Essaouira', ar: 'الصويرة', zone: 'moyenne' },
  { name: 'Nador', ar: 'الناظور', zone: 'moyenne' },
  { name: 'Larache', ar: 'العرائش', zone: 'moyenne' },
  { name: 'Ksar El Kébir', ar: 'القصر الكبير', zone: 'moyenne' },
  { name: 'Khémisset', ar: 'الخميسات', zone: 'moyenne' },
  { name: 'Taza', ar: 'تازة', zone: 'moyenne' },
  { name: 'Berkane', ar: 'بركان', zone: 'moyenne' },
  { name: 'Taourirt', ar: 'تاوريرت', zone: 'moyenne' },
  { name: 'Fnideq', ar: 'الفنيدق', zone: 'moyenne' },
  { name: 'Martil', ar: 'مرتيل', zone: 'moyenne' },
  { name: 'Ouezzane', ar: 'وزان', zone: 'moyenne' },
  { name: 'Ifrane', ar: 'إفران', zone: 'moyenne' },
  { name: 'Azrou', ar: 'أزرو', zone: 'moyenne' },
  { name: 'Sidi Kacem', ar: 'سيدي قاسم', zone: 'moyenne' },
  { name: 'Sidi Slimane', ar: 'سيدي سليمان', zone: 'moyenne' },
  { name: 'Al Hoceima', ar: 'الحسيمة', zone: 'eloignee' },
  { name: 'Chefchaouen', ar: 'شفشاون', zone: 'eloignee' },
  { name: 'Midelt', ar: 'ميدلت', zone: 'eloignee' },
  { name: 'Errachidia', ar: 'الرشيدية', zone: 'eloignee' },
  { name: 'Ouarzazate', ar: 'ورزازات', zone: 'eloignee' },
  { name: 'Zagora', ar: 'زاكورة', zone: 'eloignee' },
  { name: 'Taroudant', ar: 'تارودانت', zone: 'eloignee' },
  { name: 'Tiznit', ar: 'تيزنيت', zone: 'eloignee' },
  { name: 'Guelmim', ar: 'كلميم', zone: 'eloignee' },
  { name: 'Tan-Tan', ar: 'طانطان', zone: 'eloignee' },
  { name: 'Laâyoune', ar: 'العيون', zone: 'eloignee' },
  { name: 'Smara', ar: 'السمارة', zone: 'eloignee' },
  { name: 'Boujdour', ar: 'بوجدور', zone: 'eloignee' },
  { name: 'Dakhla', ar: 'الداخلة', zone: 'eloignee' },
  { name: 'Autre ville', ar: 'مدينة أخرى', zone: 'eloignee' },
]

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) added++
  }
  return d
}

export function estimateDelivery(cityName: string, now = new Date()) {
  const city = CITIES.find((c) => c.name === cityName)
  if (!city) return null
  const [a, b] = ZONE_DAYS[city.zone]
  return { zone: city.zone, from: addBusinessDays(now, a), to: addBusinessDays(now, b), sameDay: a === 1 && b === 1 }
}

export function formatDay(d: Date, lang: 'fr' | 'ar') {
  return d.toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}
