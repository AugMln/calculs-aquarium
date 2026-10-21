/**
 * Estimation des pertes de chaleur d'un aquarium et de la puissance de chauffage nécessaire.
 * Fonctions pures : longueurs en cm, températures en °C, puissances en W.
 *
 * Modèle : pertes par conduction/convection à travers les vitres (U × surface × ΔT)
 * + pour un bac ouvert, chaleur emportée par l'évaporation (équation de Carrier).
 */
import {
  COEF_EVAPORATION,
  LAMBDA_VERRE,
  MAGNUS,
  PUISSANCES_COMMERCIALES,
  RSI_DESCENDANT,
  RSI_HORIZONTAL,
  RSI_MONTANT,
} from '../data/thermique';

export interface EntreesChauffage {
  longueurCm: number;
  largeurCm: number;
  /** Hauteur d'eau (surface mouillée des vitres). */
  hauteurEauCm: number;
  epaisseurVerreMm: number;
  couvert: boolean;
  temperatureEauC: number;
  /** Température la plus basse de la pièce (nuit d'hiver) : sert au dimensionnement. */
  temperaturePieceMinC: number;
  /** Température moyenne de la pièce : sert à estimer la consommation. */
  temperaturePieceMoyC: number;
  /** Humidité relative de la pièce, en % (bac ouvert seulement). */
  humiditePct?: number;
}

export interface ResultatChauffage {
  /** Pertes à la température minimale de la pièce. */
  pertesMaxW: number;
  /** Pertes à la température moyenne : puissance moyenne consommée par le chauffage. */
  pertesMoyW: number;
  /** Pertes × facteur de sécurité. */
  puissanceCibleW: number;
  /** Puissance conseillée, arrondie aux tailles du commerce. */
  conseil: { nombre: number; puissanceW: number };
  consommationKWhAn: number;
}

/** Marge pour remonter la température après un changement d'eau et absorber les courants d'air. */
export const FACTEUR_SECURITE = 2;
const HUMIDITE_DEFAUT = 50;
const HEURES_PAR_AN = 24 * 365;

/** Pression de vapeur saturante (Pa) à la température `t` (°C), formule de Magnus. */
export function pressionSaturante(t: number): number {
  return MAGNUS.a * Math.exp((MAGNUS.b * t) / (t + MAGNUS.c));
}

/** Coefficients de transmission U (W/m²·K) de chaque face, d'après les résistances superficielles. */
export function coefficientsU(epaisseurVerreMm: number, couvert: boolean) {
  const rVerre = epaisseurVerreMm / 1000 / LAMBDA_VERRE.valeur;
  return {
    vitres: 1 / (RSI_HORIZONTAL.valeur + rVerre),
    fond: 1 / (RSI_DESCENDANT.valeur + rVerre),
    // Couvert : surface de l'eau → air sous le couvercle → couvercle → pièce (deux résistances montantes).
    // Ouvert : échange direct surface de l'eau → pièce, l'évaporation est comptée à part.
    dessus: couvert ? 1 / (2 * RSI_MONTANT.valeur) : 1 / RSI_MONTANT.valeur,
  };
}

/** Pertes de chaleur (W) pour une température de pièce donnée. */
export function pertes(e: EntreesChauffage, temperaturePieceC: number): number {
  const deltaT = e.temperatureEauC - temperaturePieceC;
  if (deltaT <= 0) return 0;

  const l = e.longueurCm / 100;
  const p = e.largeurCm / 100;
  const h = e.hauteurEauCm / 100;
  const u = coefficientsU(e.epaisseurVerreMm, e.couvert);

  const surfaceVitres = 2 * (l + p) * h;
  const surfaceFond = l * p;
  const conduction = (u.vitres * surfaceVitres + u.fond * surfaceFond + u.dessus * surfaceFond) * deltaT;

  let evaporation = 0;
  if (!e.couvert) {
    const pEau = pressionSaturante(e.temperatureEauC);
    const pAir = pressionSaturante(temperaturePieceC) * ((e.humiditePct ?? HUMIDITE_DEFAUT) / 100);
    evaporation = Math.max(0, COEF_EVAPORATION.valeur * (pEau - pAir) * surfaceFond);
  }
  return conduction + evaporation;
}

/** Arrondit à la puissance commerciale supérieure ; au-delà de 300 W, répartit sur plusieurs chauffages. */
export function puissanceCommerciale(cibleW: number): { nombre: number; puissanceW: number } {
  if (cibleW <= 0) return { nombre: 0, puissanceW: 0 };
  const max = PUISSANCES_COMMERCIALES[PUISSANCES_COMMERCIALES.length - 1]!;
  const nombre = Math.max(1, Math.ceil(cibleW / max));
  const parChauffage = cibleW / nombre;
  const puissanceW = PUISSANCES_COMMERCIALES.find((p) => p >= parChauffage) ?? max;
  return { nombre, puissanceW };
}

export function calculerChauffage(e: EntreesChauffage): ResultatChauffage {
  const pertesMaxW = pertes(e, e.temperaturePieceMinC);
  const pertesMoyW = pertes(e, e.temperaturePieceMoyC);
  const puissanceCibleW = pertesMaxW * FACTEUR_SECURITE;
  return {
    pertesMaxW,
    pertesMoyW,
    puissanceCibleW,
    conseil: puissanceCommerciale(puissanceCibleW),
    consommationKWhAn: (pertesMoyW * HEURES_PAR_AN) / 1000,
  };
}
