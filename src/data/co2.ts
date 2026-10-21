/**
 * Repères pour le CO2 dissous en aquarium d'eau douce.
 * Chaque valeur cite sa source (règle du projet : aucune donnée sans source).
 */

/** Coefficient de la formule usuelle CO2 (mg/L) = 3 × KH (°dH) × 10^(7 − pH). */
export const COEF_CO2 = 3;

export type ZoneCo2 = 'faible' | 'optimal' | 'limite' | 'danger';

export interface DefinitionZone {
  libelle: string;
  /** Borne basse incluse, en mg/L. */
  min: number;
  conseil: string;
}

export const ZONES: Record<ZoneCo2, DefinitionZone> = {
  faible: {
    libelle: 'Faible',
    min: 0,
    conseil: 'Suffisant pour un bac peu éclairé ; trop peu pour des plantes exigeantes.',
  },
  optimal: {
    libelle: 'Zone conseillée',
    min: 15,
    conseil: 'Bonne croissance des plantes, sans danger pour les poissons si l\'eau est bien oxygénée.',
  },
  limite: {
    libelle: 'Limite',
    min: 30,
    conseil: 'Surveillez les poissons (respiration rapide en surface) et brassez bien la surface.',
  },
  danger: {
    libelle: 'Danger',
    min: 35,
    conseil: 'Toxique pour la plupart des poissons : réduisez l\'injection et aérez immédiatement.',
  },
};

export const SOURCES_CO2 = [
  'Formule CO2 = 3 × KH × 10^(7 − pH) : formule usuelle des tableaux pH/KH/CO2 (Barr Report, UKAPS, Practical ' +
    'Fishkeeping) ; elle redonne la convention du « drop checker » à 4 °dKH, vert à pH 6,6 pour ~30 mg/L.',
  'Zone conseillée 15–35 mg/L : JBL ; 15–35 mg/L : CO2Art.',
  'Plafond de 30 mg/L pour la plupart des poissons : George Farmer, Practical Fishkeeping, « CO2: striking the balance ».',
  'Toxicité au-delà de 30–35 mg/L : CO2Art, « What are the best CO2 levels for an aquarium ».',
  'Limites de la formule (eau tamponnée par les carbonates, sols actifs, tourbe) : 2Hr Aquarist, ' +
    '« The wrong way to read the pH/KH chart » ; UKAPS.',
];
