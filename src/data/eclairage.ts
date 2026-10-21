/**
 * Repères d'éclairage pour aquarium, en lumens par litre d'eau.
 * Chaque valeur cite sa source (règle du projet : aucune donnée sans source).
 */

export type NiveauEclairage = 'faible' | 'moyen' | 'fort';

export interface RepereEclairage {
  libelle: string;
  /** Libellé court pour les listes déroulantes. */
  court: string;
  plantes: string;
  /** Fourchette en lm/L (GreenAqua). */
  min: number;
  max: number;
  /** Valeur indicative en lm/L (Aquasabi). */
  repere: number;
  co2: 'inutile' | 'conseillé' | 'indispensable';
}

export const NIVEAUX: Record<NiveauEclairage, RepereEclairage> = {
  faible: {
    libelle: 'Faible',
    court: 'Faible (plantes faciles)',
    plantes: 'Poissons et plantes faciles (anubias, mousses, fougères, bucephalandra)',
    min: 10,
    max: 20,
    repere: 15,
    co2: 'inutile',
  },
  moyen: {
    libelle: 'Moyen',
    court: 'Moyen (bac planté classique)',
    plantes: 'Aquarium planté classique, plantes de tige peu exigeantes',
    min: 20,
    max: 40,
    repere: 30,
    co2: 'conseillé',
  },
  fort: {
    libelle: 'Fort',
    court: 'Fort (plantes exigeantes)',
    plantes: 'Plantes exigeantes, gazons, plantes rouges',
    min: 40,
    max: 70,
    repere: 60,
    co2: 'indispensable',
  },
};

/** En dessous de ce seuil, l'éclairage ne suffit qu'à voir les poissons. */
export const SEUIL_INSUFFISANT = NIVEAUX.faible.min;

export const PHOTOPERIODE_H = { min: 8, max: 10 };

export const SOURCES_ECLAIRAGE = [
  'Fourchettes 10–20, 20–40 et 40–70 lm/L, besoin en CO2 et photopériode de 8 à 10 h : GreenAqua, ' +
    '« What to know about aquarium lighting » (greenaqua.hu).',
  'Repères 15, 30 et 60 lm/L (anciennement 0,25, 0,5 et 1 W/L en tubes fluorescents) : Aquasabi, ' +
    'Aquascaping Wiki, « Aquarium LED: what is lumen? » (aquasabi.de).',
];
