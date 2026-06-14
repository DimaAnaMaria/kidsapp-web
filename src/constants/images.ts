/**
 * images.ts — Maparea imaginilor per subcategorie si categorie
 *
 * Logica de selectie:
 * 1. Daca subcategoria are o imagine dedicata → o folosim pe cea specifica
 * 2. Daca subcategoria nu are imagine → alegem din pool-ul categoriei
 * 3. Selectia din pool este determinista bazata pe ID-ul activitatii
 *    → aceeasi activitate primeste mereu aceeasi imagine
 *    → activitati diferite din aceeasi categorie pot primi imagini diferite
 */

const BASE = '/images/activities';

// ── Imagini specifice per subcategorie ──────────────────────────────────────
export const SUBCATEGORY_IMAGES: Record<string, string> = {

  // SPORTIV
  'fotbal':              `${BASE}/sportiv_fotbal.jpg`,
  'tenis':               `${BASE}/sportiv_tenis.jpg`,
  'inot':                `${BASE}/sportiv_inot.jpg`,
  'karate':              `${BASE}/sportiv_arte_martiale.jpg`,
  'kick boxing':         `${BASE}/sportiv_arte_martiale.jpg`,
  'arte martiale':       `${BASE}/sportiv_arte_martiale.jpg`,
  'baschet':             `${BASE}/sportiv_baschet.jpg`,
  'handbal':             `${BASE}/sportiv_antrenament_fizic.jpg`,
  'volei':               `${BASE}/sportiv_antrenament_fizic.jpg`,
  'badminton':           `${BASE}/sportiv_antrenament_fizic.jpg`,
  'balet':               `${BASE}/sportiv_balet.jpg`,
  'dans sportiv':        `${BASE}/sportiv_dans.jpg`,
  'dans si coregrafie':  `${BASE}/sportiv_dans.jpg`,
  'zumba':               `${BASE}/sportiv_dans.jpg`,
  'gimnastica ritmica':  `${BASE}/sportiv_gimnastica.jpg`,
  'trampoline park':     `${BASE}/sportiv_trambulina.jpg`,
  'parc aventura':       `${BASE}/sportiv_trambulina.jpg`,
  'laser tag':           `${BASE}/sociabil_lasertag.jpg`,
  'sport':               `${BASE}/sportiv_antrenament_fizic.jpg`,

  // ARTIST
  'pictura':             `${BASE}/artist_pictura.jpg`,
  'pictura ceramica':    `${BASE}/artist_ceramica.jpg`,
  'ceramica':            `${BASE}/artist_ceramica.jpg`,
  'modelaj lut':         `${BASE}/artist_ceramica.jpg`,
  'olarit':              `${BASE}/artist_ceramica.jpg`,
  'teatru':              `${BASE}/artist_teatru.jpg`,
  'actorie':             `${BASE}/artist_teatru.jpg`,
  'actorie si dictie':   `${BASE}/artist_teatru.jpg`,
  'muzica':              `${BASE}/artist_muzica.jpg`,
  'muzica si teatru':    `${BASE}/artist_muzica2.jpg`,
  'pian':                `${BASE}/artist_muzica.jpg`,
  'desen':               `${BASE}/artist_desenat.jpg`,
  'ilustratie':          `${BASE}/artist_desenat.jpg`,
  'arte vizuale':        `${BASE}/artist_desenat.jpg`,
  'sculptura':           `${BASE}/artist_sculptura.jpg`,
  'design grafic':       `${BASE}/artist_generic1.jpg`,
  'design ux/ui':        `${BASE}/artist_generic1.jpg`,
  'video si animatie':   `${BASE}/artist_generic2.jpg`,
  'web design':          `${BASE}/artist_generic2.jpg`,
  'petrecere':           `${BASE}/artist_generic2.jpg`,

  // TEHNIC
  'robotica':                  `${BASE}/tehnic_robotica1.jpg`,
  'robotica si programare':    `${BASE}/tehnic_robotica2.jpg`,
  'programare':                `${BASE}/tehnic_programare1.jpg`,
  'programare python':         `${BASE}/tehnic_programare2.jpg`,
  'programare java':           `${BASE}/tehnic_programare3.jpg`,
  'programare php':            `${BASE}/tehnic_programare4.jpg`,
  'web development':           `${BASE}/tehnic_programare1.jpg`,
  'cybersecurity':             `${BASE}/tehnic_programare2.jpg`,
  'inteligenta artificiala':   `${BASE}/tehnic_robotica3.jpg`,
  'retele it':                 `${BASE}/tehnic_generic1.jpg`,
  'testare software':          `${BASE}/tehnic_generic2.jpg`,
  'astronomie':                `${BASE}/tehnic_astronomie.jpg`,
  'astronomie si stiinta':     `${BASE}/tehnic_astronomie.jpg`,
  'stiinte':                   `${BASE}/tehnic_stiinta.jpg`,
  'stiinta':                   `${BASE}/tehnic_stiinta.jpg`,

  // PRAGMATIC
  'gatit':               `${BASE}/pragmatic_gatit.jpg`,
  'cursuri culinare':    `${BASE}/pragmatic_gatit2.jpg`,
  'sah':                 `${BASE}/pragmatic_sah.jpg`,
  'limbi straine':       `${BASE}/pragmatic_leadership.jpg`,
  'limba':               `${BASE}/pragmatic_leadership.jpg`,
  'leadership':          `${BASE}/pragmatic_leadership.jpg`,
  'comunicare':          `${BASE}/pragmatic_leadership2.jpg`,
  'bricolaj':            `${BASE}/pragmatic_bricolaj.jpg`,
  'ateliere practice':   `${BASE}/pragmatic_bricolaj.jpg`,
  'dezvoltare personala':`${BASE}/pragmatic_leadership2.jpg`,
  'model un / dezbateri':`${BASE}/pragmatic_leadership2.jpg`,

  // SOCIABIL
  'escape room':         `${BASE}/sociabil_escaperoom1.jpg`,
  'petrecere aniversara':`${BASE}/sociabil_generic.jpg`,
  'parc public':         `${BASE}/sociabil_parc1.jpg`,
  'parc distractii':     `${BASE}/sociabil_parc2.jpg`,
  'zoo si natura':       `${BASE}/sociabil_zoo.jpg`,
  'natura si stiinta':   `${BASE}/sociabil_parc3.jpg`,
  'muzeu stiinta':       `${BASE}/sociabil_muzeu1.jpg`,
  'expozitie':           `${BASE}/sociabil_muzeu1.jpg`,
  'eveniment cultural':  `${BASE}/sociabil_generic.jpg`,
  'mun si dezbateri':    `${BASE}/sociabil_generic.jpg`,
};

// ── Pool de imagini generice per categorie (fallback) ────────────────────────
export const CATEGORY_IMAGE_POOL: Record<string, string[]> = {
  'sportiv': [
    `${BASE}/sportiv_generic1.jpg`,
    `${BASE}/sportiv_generic2.jpg`,
    `${BASE}/sportiv_antrenament_fizic.jpg`,
  ],
  'artist': [
    `${BASE}/artist_generic1.jpg`,
    `${BASE}/artist_generic2.jpg`,
  ],
  'tehnic': [
    `${BASE}/tehnic_generic1.jpg`,
    `${BASE}/tehnic_generic2.jpg`,
    `${BASE}/tehnic_generic3.jpg`,
    `${BASE}/tehnic_lego.jpg`,
    `${BASE}/tehnic_stiinta2.jpg`,
  ],
  'pragmatic': [
    `${BASE}/pragmatic_generic1.jpg`,
    `${BASE}/pragmatic_generic2.jpg`,
  ],
  'sociabil': [
    `${BASE}/sociabil_generic.jpg`,
    `${BASE}/sociabil_parc3.jpg`,
    `${BASE}/sociabil_zoo2.jpg`,
    `${BASE}/sociabil_escaperoom2.jpg`,
  ],
};

/**
 * Returneaza imaginea potrivita pentru o activitate.
 *
 * @param activityId - ID-ul activitatii (pentru selectie determinista din pool)
 * @param subcategory - Subcategoria activitatii
 * @param category - Categoria principala (fallback)
 */
export function getActivityImage(
  activityId: string,
  subcategory: string | null | undefined,
  category: string
): string {
  // 1. Cauta dupa subcategorie exacta (lowercase)
  const subKey = (subcategory || '').toLowerCase().trim();
  if (subKey && SUBCATEGORY_IMAGES[subKey]) {
    return SUBCATEGORY_IMAGES[subKey];
  }

  // 2. Cauta partial in subcategorie (ex: "robotica si programare" → "robotica")
  if (subKey) {
    const partialMatch = Object.keys(SUBCATEGORY_IMAGES).find(key =>
      subKey.includes(key) || key.includes(subKey)
    );
    if (partialMatch) return SUBCATEGORY_IMAGES[partialMatch];
  }

  // 3. Fallback la pool-ul categoriei — selectie determinista bazata pe ID
  const pool = CATEGORY_IMAGE_POOL[category] || CATEGORY_IMAGE_POOL['sociabil'];
  const charSum = activityId.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return pool[charSum % pool.length];
}
