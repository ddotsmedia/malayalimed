// i18n.js — Malayalam-first locale config + minimal dictionary.
const LOCALES = ['ml', 'en'];
const DEFAULT_LOCALE = 'ml';

const DICT = {
  ml: {
    site: 'മലയാളിമെഡ്', doctors: 'ഡോക്ടർമാർ', hospitals: 'ആശുപത്രികൾ', jobs: 'ജോലികൾ',
    find_doctor: 'ഡോക്ടറെ കണ്ടെത്തുക', find_hospital: 'ആശുപത്രി കണ്ടെത്തുക',
    search: 'തിരയുക', search_placeholder: 'പേര്, സ്പെഷ്യാലിറ്റി, ജില്ല…',
    no_results: 'ഫലങ്ങളൊന്നുമില്ല', book_now: 'ബുക്ക് ചെയ്യുക', verified: 'പരിശോധിച്ചു',
    experience: 'വർഷത്തെ പരിചയം', fee: 'ഫീസ്', womens_health: 'വനിതാ ആരോഗ്യം',
    mental_health: 'മാനസികാരോഗ്യം', child_health: 'ശിശു ആരോഗ്യം',
    tagline: 'കേരളത്തിലെ വിശ്വസ്ത ഡിജിറ്റൽ ആരോഗ്യ പോർട്ടൽ',
    disclaimer: 'ഈ വിവരങ്ങൾ പൊതു അറിവിനു മാത്രം. രോഗനിർണയത്തിന് ഡോക്ടറെ സമീപിക്കുക. അടിയന്തരം: 112 / ആംബുലൻസ് 108.'
  },
  en: {
    site: 'MalayaliMed', doctors: 'Doctors', hospitals: 'Hospitals', jobs: 'Jobs',
    find_doctor: 'Find a doctor', find_hospital: 'Find a hospital',
    search: 'Search', search_placeholder: 'Name, specialty, district…',
    no_results: 'No results found', book_now: 'Book now', verified: 'Verified',
    experience: 'yrs experience', fee: 'Fee', womens_health: "Women's Health",
    mental_health: 'Mental Health', child_health: 'Child Health',
    tagline: "Kerala's trusted digital healthcare portal",
    disclaimer: 'For general information only — not a diagnosis. Consult a doctor. Emergency: 112 / Ambulance 108.'
  }
};

export function resolveLocale(l) { return LOCALES.includes(l) ? l : DEFAULT_LOCALE; }
export function t(locale, key) {
  const l = resolveLocale(locale);
  return (DICT[l] && DICT[l][key]) || (DICT.en && DICT.en[key]) || key;
}
export { LOCALES, DEFAULT_LOCALE };
