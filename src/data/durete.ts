/**
 * Unités de dureté de l'eau, exprimées en mg/L d'équivalent CaCO3 (« ppm CaCO3 »).
 * Chaque facteur découle de la définition de l'unité et des masses molaires : aucune valeur empirique.
 */

export const MASSES_MOLAIRES = {
  /** g/mol */
  CaO: 56.077,
  CaCO3: 100.086,
  source:
    'Poids atomiques standard IUPAC (Ca 40,078 ; C 12,011 ; O 15,999), Commission on Isotopic Abundances and Atomic Weights.',
};

/** Masse d'un grain (mg) et volume d'un gallon impérial (L), définitions légales britanniques. */
const GRAIN_MG = 64.79891;
const GALLON_IMPERIAL_L = 4.54609;

export type UniteDurete = 'dH' | 'f' | 'e' | 'ppm' | 'mmol' | 'meq';

export interface DefinitionUnite {
  symbole: string;
  nom: string;
  /** Valeur de 1 unité en mg/L de CaCO3. */
  ppm: number;
  definition: string;
}

export const UNITES: Record<UniteDurete, DefinitionUnite> = {
  dH: {
    symbole: '°dH',
    nom: 'degré allemand (°dGH, °dKH)',
    ppm: (10 * MASSES_MOLAIRES.CaCO3) / MASSES_MOLAIRES.CaO,
    definition: '1 °dH = 10 mg/L d\'oxyde de calcium (CaO).',
  },
  f: {
    symbole: '°f',
    nom: 'degré français (TH, TAC)',
    ppm: 10,
    definition: '1 °f = 10 mg/L de carbonate de calcium (CaCO3).',
  },
  e: {
    symbole: '°e',
    nom: 'degré anglais (Clark)',
    ppm: GRAIN_MG / GALLON_IMPERIAL_L,
    definition: '1 °e = 1 grain de CaCO3 par gallon impérial (64,79891 mg / 4,54609 L).',
  },
  ppm: {
    symbole: 'ppm',
    nom: 'mg/L de CaCO3',
    ppm: 1,
    definition: 'Unité de référence : 1 mg de CaCO3 par litre.',
  },
  mmol: {
    symbole: 'mmol/L',
    nom: 'millimole par litre',
    ppm: MASSES_MOLAIRES.CaCO3,
    definition: '1 mmol/L d\'ions alcalino-terreux = 100,086 mg/L de CaCO3 (masse molaire).',
  },
  meq: {
    symbole: 'meq/L',
    nom: 'milliéquivalent par litre',
    ppm: MASSES_MOLAIRES.CaCO3 / 2,
    definition: '1 meq/L = 0,5 mmol/L (ions divalents) = 50,043 mg/L de CaCO3.',
  },
};

export const SOURCES_DURETE = [
  MASSES_MOLAIRES.source,
  'Degré allemand : DIN 38409-6 (dureté de l\'eau), 1 °dH = 10 mg CaO/L = 0,1783 mmol/L.',
  'Degré français : 1 °f = 10 mg CaCO3/L = 0,1 mmol/L, unité des analyses d\'eau potable en France (TH, TAC).',
  'Grain et gallon impérial : Weights and Measures Act 1985 (Royaume-Uni).',
];
