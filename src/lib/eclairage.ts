/**
 * Calcul des lumens nécessaires pour un aquarium, et évaluation d'un éclairage existant.
 * Fonctions pures : volumes en litres, flux lumineux en lumens.
 */
import { NIVEAUX, SEUIL_INSUFFISANT, type NiveauEclairage } from '../data/eclairage';

export interface BesoinLumens {
  min: number;
  max: number;
  repere: number;
}

export function lumensNecessaires(volumeL: number, niveau: NiveauEclairage): BesoinLumens {
  const n = NIVEAUX[niveau];
  return { min: n.min * volumeL, max: n.max * volumeL, repere: n.repere * volumeL };
}

export type Evaluation = 'insuffisant' | NiveauEclairage | 'tres-fort';

export function evaluerEclairage(lumens: number, volumeL: number): { lumensParLitre: number; evaluation: Evaluation } {
  const lumensParLitre = volumeL > 0 ? lumens / volumeL : 0;
  let evaluation: Evaluation;
  if (lumensParLitre < SEUIL_INSUFFISANT) evaluation = 'insuffisant';
  else if (lumensParLitre < NIVEAUX.moyen.min) evaluation = 'faible';
  else if (lumensParLitre < NIVEAUX.fort.min) evaluation = 'moyen';
  else if (lumensParLitre <= NIVEAUX.fort.max) evaluation = 'fort';
  else evaluation = 'tres-fort';
  return { lumensParLitre, evaluation };
}

/** Nombre de rampes nécessaires pour atteindre `lumensCible`. */
export function nombreRampes(lumensCible: number, lumensParRampe: number): number {
  if (lumensParRampe <= 0) return 0;
  return Math.ceil(lumensCible / lumensParRampe);
}
