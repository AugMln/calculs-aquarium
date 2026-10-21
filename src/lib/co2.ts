/**
 * CO2 dissous à partir du KH et du pH, et pH à viser pour un taux de CO2 donné.
 * Fonctions pures : KH en °dH, CO2 en mg/L.
 */
import { COEF_CO2, ZONES, type ZoneCo2 } from '../data/co2';

export function co2DepuisKhPh(khDh: number, ph: number): number {
  return COEF_CO2 * khDh * 10 ** (7 - ph);
}

/** pH à atteindre (réglage d'un contrôleur de pH) pour obtenir `co2` mg/L avec un KH donné. */
export function phPourCo2(khDh: number, co2: number): number {
  return 7 - Math.log10(co2 / (COEF_CO2 * khDh));
}

export function zoneCo2(co2: number): ZoneCo2 {
  if (co2 >= ZONES.danger.min) return 'danger';
  if (co2 >= ZONES.limite.min) return 'limite';
  if (co2 >= ZONES.optimal.min) return 'optimal';
  return 'faible';
}
