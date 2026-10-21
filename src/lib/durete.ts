/**
 * Conversions d'unités de dureté et calcul de mélange eau du robinet / eau douce (osmosée, déminéralisée, pluie).
 * Fonctions pures.
 */
import { UNITES, type UniteDurete } from '../data/durete';

export function convertir(valeur: number, de: UniteDurete, vers: UniteDurete): number {
  return (valeur * UNITES[de].ppm) / UNITES[vers].ppm;
}

export function convertirTout(valeur: number, de: UniteDurete): Record<UniteDurete, number> {
  const resultat = {} as Record<UniteDurete, number>;
  for (const unite of Object.keys(UNITES) as UniteDurete[]) resultat[unite] = convertir(valeur, de, unite);
  return resultat;
}

/** Dureté d'un mélange : moyenne pondérée par les volumes (les sels dissous s'additionnent). */
export function dureteMelange(dureteRobinet: number, dureteDouce: number, fractionRobinet: number): number {
  return fractionRobinet * dureteRobinet + (1 - fractionRobinet) * dureteDouce;
}

export interface EntreesMelange {
  /** Dureté de l'eau du robinet (unité libre, la même pour les trois valeurs). */
  robinet: number;
  /** Dureté de l'eau douce : ~0 pour de l'eau osmosée ou déminéralisée. */
  douce: number;
  cible: number;
  volumeTotalL: number;
}

export type ResultatMelange =
  | { possible: true; fractionRobinet: number; litresRobinet: number; litresDouce: number }
  | { possible: false; raison: 'cible-trop-haute' | 'cible-trop-basse' };

export function calculerMelange(e: EntreesMelange): ResultatMelange {
  const haute = Math.max(e.robinet, e.douce);
  const basse = Math.min(e.robinet, e.douce);
  if (e.cible > haute) return { possible: false, raison: 'cible-trop-haute' };
  if (e.cible < basse) return { possible: false, raison: 'cible-trop-basse' };

  // Les deux eaux ont la même dureté : n'importe quel mélange convient, on garde l'eau du robinet.
  const fractionRobinet = e.robinet === e.douce ? 1 : (e.cible - e.douce) / (e.robinet - e.douce);
  return {
    possible: true,
    fractionRobinet,
    litresRobinet: fractionRobinet * e.volumeTotalL,
    litresDouce: (1 - fractionRobinet) * e.volumeTotalL,
  };
}
