import { describe, expect, it } from 'vitest';
import { co2DepuisKhPh, phPourCo2, zoneCo2 } from './co2';

/** Écart relatif toléré par la règle du projet : < 1 %. */
function procheDe(valeur: number, reference: number, tolerance = 0.01) {
  expect(Math.abs(valeur - reference) / reference).toBeLessThan(tolerance);
}

describe('CO2 à partir du KH et du pH — valeurs des tableaux publiés', () => {
  it.each([
    // [KH °dH, pH, CO2 mg/L]
    [4, 7.0, 12], // tableau pH/KH/CO2 usuel
    [4, 6.6, 30.1], // convention du drop checker à 4 °dKH : vert ≈ 30 mg/L
    [2.5, 6.4, 29.9], // exemple Barr Report : pH 6,4 et KH 2,5 → ~30 ppm
    [1, 7.0, 3], // calcul direct : 3 × 1 × 10⁰
    [10, 6.8, 47.5], // calcul direct : 3 × 10 × 10^0,2
  ])('KH %f, pH %f → %f mg/L', (kh, ph, ref) => procheDe(co2DepuisKhPh(kh, ph), ref));

  it('une baisse de 1 point de pH multiplie le CO2 par 10', () => {
    procheDe(co2DepuisKhPh(5, 6.0) / co2DepuisKhPh(5, 7.0), 10, 1e-12);
  });
});

describe('pH à viser', () => {
  it('KH 4, 30 mg/L → pH ≈ 6,6', () => {
    procheDe(phPourCo2(4, 30), 6.602);
  });

  it('aller-retour exact', () => {
    procheDe(co2DepuisKhPh(6, phPourCo2(6, 25)), 25, 1e-12);
  });
});

describe('zones', () => {
  it.each([
    [10, 'faible'],
    [15, 'optimal'],
    [29.9, 'optimal'],
    [30, 'limite'],
    [35, 'danger'],
    [60, 'danger'],
  ] as const)('%f mg/L → %s', (co2, zone) => expect(zoneCo2(co2)).toBe(zone));
});
