import { describe, expect, it } from 'vitest';
import { calculerChauffage, coefficientsU, pertes, pressionSaturante, puissanceCommerciale, type EntreesChauffage } from './chauffage';

/** Écart relatif toléré par la règle du projet : < 1 %. */
function procheDe(valeur: number, reference: number, tolerance = 0.01) {
  expect(Math.abs(valeur - reference) / reference).toBeLessThan(tolerance);
}

const bac80: EntreesChauffage = {
  longueurCm: 80,
  largeurCm: 35,
  hauteurEauCm: 38,
  epaisseurVerreMm: 6,
  couvert: true,
  temperatureEauC: 25,
  temperaturePieceMinC: 20,
  temperaturePieceMoyC: 21,
};

describe('pression de vapeur saturante (Magnus)', () => {
  // Valeurs de référence IAPWS-95 : 2339,3 Pa à 20 °C, 3169,9 Pa à 25 °C, 4246,0 Pa à 30 °C.
  it.each([
    [20, 2339.3],
    [25, 3169.9],
    [30, 4246.0],
  ])('à %i °C ≈ %f Pa', (t, ref) => procheDe(pressionSaturante(t), ref));
});

describe('coefficients de transmission', () => {
  it('vitre de 6 mm : U = 1 / (0,13 + 0,006) ≈ 7,35 W/m²K', () => {
    procheDe(coefficientsU(6, true).vitres, 1 / 0.136, 1e-9);
  });

  it('dessus couvert = moitié du dessus ouvert (hors évaporation)', () => {
    procheDe(coefficientsU(6, true).dessus * 2, coefficientsU(6, false).dessus, 1e-9);
  });
});

describe('pertes de chaleur', () => {
  it('bac couvert : somme U × surface × ΔT (calcul à la main)', () => {
    const u = coefficientsU(6, true);
    const attendu = (u.vitres * 2 * (0.8 + 0.35) * 0.38 + (u.fond + u.dessus) * 0.8 * 0.35) * 5;
    procheDe(pertes(bac80, 20), attendu, 1e-9);
  });

  it('bac ouvert : ajoute l\'évaporation de Carrier 0,089 × (pEau − HR × pAir) × surface', () => {
    const ouvert = { ...bac80, couvert: false, humiditePct: 50 };
    const u = coefficientsU(6, false);
    const conduction = (u.vitres * 2 * (0.8 + 0.35) * 0.38 + (u.fond + u.dessus) * 0.8 * 0.35) * 5;
    const evaporation = 0.089 * (pressionSaturante(25) - 0.5 * pressionSaturante(20)) * 0.8 * 0.35;
    procheDe(pertes(ouvert, 20), conduction + evaporation, 1e-9);
  });

  it('aucune perte si la pièce est plus chaude que l\'eau', () => {
    expect(pertes(bac80, 26)).toBe(0);
  });
});

describe('recoupement avec les ordres de grandeur publiés', () => {
  // Selectra (2026) : bac de 120 L à 25 °C dans une pièce à 21 °C → environ 35 W de pertes en moyenne.
  // Le modèle doit retrouver le même ordre de grandeur (± 30 %), pas la valeur exacte : les dimensions ne sont pas publiées.
  it('120 L couvert, 25 °C / 21 °C : ~35 W', () => {
    const r = calculerChauffage({ ...bac80, hauteurEauCm: 43, temperaturePieceMoyC: 21 });
    expect(r.pertesMoyW).toBeGreaterThan(35 * 0.7);
    expect(r.pertesMoyW).toBeLessThan(35 * 1.3);
  });

  // Règle empirique (Truffaut) : 1 W par litre pour une pièce stable autour de 20 °C.
  it('~106 L couvert, pièce à 20 °C : chauffage conseillé de 100 W', () => {
    expect(calculerChauffage(bac80).conseil).toEqual({ nombre: 1, puissanceW: 100 });
  });
});

describe('puissance commerciale', () => {
  it.each([
    [10, 1, 25],
    [94, 1, 100],
    [160, 1, 200],
    [300, 1, 300],
    [420, 2, 250],
    [700, 3, 250],
  ])('%i W → %i × %i W', (cible, nombre, puissanceW) => {
    expect(puissanceCommerciale(cible)).toEqual({ nombre, puissanceW });
  });

  it('pas de chauffage si aucune perte', () => {
    expect(puissanceCommerciale(0)).toEqual({ nombre: 0, puissanceW: 0 });
  });
});

describe('consommation', () => {
  it('pertes moyennes × 8760 h', () => {
    const r = calculerChauffage(bac80);
    procheDe(r.consommationKWhAn, (r.pertesMoyW * 8760) / 1000, 1e-9);
  });
});
