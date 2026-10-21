/**
 * Calcul du volume et du poids d'un aquarium.
 * Fonctions pures : toutes les longueurs en cm (épaisseur du verre en mm), volumes en litres, masses en kg.
 */
import { EAU_DE_MER, EAU_DOUCE, SUBSTRAT_SATURE, VERRE } from '../data/masses-volumiques';

export type Forme = 'rectangulaire' | 'cylindrique' | 'panoramique';
export type TypeEau = 'douce' | 'mer';

export interface DimensionsBac {
  forme: Forme;
  /** Longueur extérieure (rectangulaire, panoramique) ou diamètre extérieur (cylindrique). */
  longueurCm: number;
  /** Profondeur extérieure, mesurée sur les côtés pour un bac panoramique. Ignorée pour un cylindre. */
  largeurCm: number;
  /** Hauteur extérieure du bac. */
  hauteurCm: number;
  epaisseurVerreMm: number;
  /** Bombé de la vitre avant d'un bac panoramique (flèche de l'arc). Ignoré sinon. */
  flecheCm?: number;
}

export interface EntreesVolume extends DimensionsBac {
  /** Hauteur d'eau mesurée depuis le fond intérieur. Par défaut : bac rempli à 2 cm du bord. */
  hauteurEauCm?: number;
  hauteurSolCm?: number;
  volumeDecorL?: number;
  eau?: TypeEau;
}

export interface ResultatVolume {
  /** Volume intérieur, bac rempli à ras bord. */
  volumeBrutL: number;
  /** Volume d'eau réellement contenu (hors sol et décor). */
  volumeEauL: number;
  volumeSolL: number;
  poids: { eauKg: number; verreKg: number; solKg: number; totalKg: number };
}

const CM3_PAR_L = 1000;
const MARGE_REMPLISSAGE_CM = 2;

/** Aire d'un segment circulaire de corde `c` et de flèche `s`. */
export function aireSegment(c: number, s: number): number {
  if (s <= 0) return 0;
  const r = (c * c) / (8 * s) + s / 2;
  const theta = 2 * Math.asin(Math.min(1, c / (2 * r)));
  // Au-delà du demi-cercle (s > r), l'angle au centre est le complément.
  const angle = s > r ? 2 * Math.PI - theta : theta;
  return ((r * r) / 2) * (angle - Math.sin(angle));
}

/** Longueur d'arc d'un segment circulaire de corde `c` et de flèche `s`. */
export function longueurArc(c: number, s: number): number {
  if (s <= 0) return c;
  const r = (c * c) / (8 * s) + s / 2;
  const theta = 2 * Math.asin(Math.min(1, c / (2 * r)));
  return r * (s > r ? 2 * Math.PI - theta : theta);
}

/** Surface intérieure du fond, en cm². */
export function surfaceInterieure(d: DimensionsBac): number {
  const e = d.epaisseurVerreMm / 10;
  if (d.forme === 'cylindrique') {
    const r = d.longueurCm / 2 - e;
    return Math.PI * r * r;
  }
  const rect = (d.longueurCm - 2 * e) * (d.largeurCm - 2 * e);
  if (d.forme === 'panoramique') return rect + aireSegment(d.longueurCm - 2 * e, d.flecheCm ?? 0);
  return rect;
}

/** Masse du verre (vitres pleines, fond posé entre les vitres), en kg. */
export function masseVerre(d: DimensionsBac): number {
  const e = d.epaisseurVerreMm / 10;
  const h = d.hauteurCm;
  let cm3: number;
  if (d.forme === 'cylindrique') {
    const rExt = d.longueurCm / 2;
    cm3 = Math.PI * (2 * rExt - e) * h * e + Math.PI * (rExt - e) ** 2 * e;
  } else {
    const l = d.longueurCm;
    const p = d.largeurCm;
    const avant = d.forme === 'panoramique' ? longueurArc(l, d.flecheCm ?? 0) : l;
    const vitres = (avant + l) * h * e + 2 * (p - 2 * e) * h * e;
    cm3 = vitres + (surfaceInterieure(d) * e);
  }
  return (cm3 / CM3_PAR_L) * VERRE.valeur;
}

export function calculerVolume(entrees: EntreesVolume): ResultatVolume {
  const e = entrees.epaisseurVerreMm / 10;
  const hauteurInt = entrees.hauteurCm - e;
  const hauteurEau = Math.min(entrees.hauteurEauCm ?? hauteurInt - MARGE_REMPLISSAGE_CM, hauteurInt);
  const hauteurSol = Math.min(entrees.hauteurSolCm ?? 0, hauteurEau);
  const surface = surfaceInterieure(entrees);

  const volumeBrutL = (surface * hauteurInt) / CM3_PAR_L;
  const volumeSolL = (surface * hauteurSol) / CM3_PAR_L;
  const volumeEauL = Math.max(0, (surface * (hauteurEau - hauteurSol)) / CM3_PAR_L - (entrees.volumeDecorL ?? 0));

  const densiteEau = entrees.eau === 'mer' ? EAU_DE_MER.valeur : EAU_DOUCE.valeur;
  const eauKg = volumeEauL * densiteEau;
  const verreKg = masseVerre(entrees);
  const solKg = volumeSolL * SUBSTRAT_SATURE.valeur;

  return {
    volumeBrutL,
    volumeEauL,
    volumeSolL,
    poids: { eauKg, verreKg, solKg, totalKg: eauKg + verreKg + solKg },
  };
}
