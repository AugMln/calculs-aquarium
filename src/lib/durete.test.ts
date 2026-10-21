import { describe, expect, it } from 'vitest';
import { calculerMelange, convertir, convertirTout, dureteMelange } from './durete';

/** Écart relatif toléré par la règle du projet : < 1 %. */
function procheDe(valeur: number, reference: number, tolerance = 0.01) {
  expect(Math.abs(valeur - reference) / reference).toBeLessThan(tolerance);
}

describe('conversions — tables de correspondance publiées', () => {
  // Table usuelle (DIN / tables de dureté) : 1 °dH = 17,848 ppm = 1,7848 °f = 1,2521 °e = 0,17832 mmol/L
  it.each([
    ['ppm', 17.848],
    ['f', 1.7848],
    ['e', 1.2521],
    ['mmol', 0.17832],
    ['meq', 0.35665],
  ] as const)('1 °dH = %s %f', (unite, ref) => procheDe(convertir(1, 'dH', unite), ref));

  // 1 °f = 0,5603 °dH = 0,7015 °e
  it('1 °f = 0,56 °dH = 0,70 °e', () => {
    procheDe(convertir(1, 'f', 'dH'), 0.5603);
    procheDe(convertir(1, 'f', 'e'), 0.7015);
  });

  // 1 °e = 14,254 ppm ; 1 mmol/L = 5,608 °dH = 10,01 °f
  it('1 °e = 14,25 ppm ; 1 mmol/L = 5,61 °dH', () => {
    procheDe(convertir(1, 'e', 'ppm'), 14.254);
    procheDe(convertir(1, 'mmol', 'dH'), 5.608);
    procheDe(convertir(1, 'mmol', 'f'), 10.009);
  });

  // Repère aquariophile : 1 meq/L d'alcalinité = 2,8 °dKH = 50 ppm
  it('1 meq/L = 2,8 °dKH', () => {
    procheDe(convertir(1, 'meq', 'dH'), 2.804);
  });

  it('aller-retour sans perte', () => {
    procheDe(convertir(convertir(12.3, 'f', 'e'), 'e', 'f'), 12.3, 1e-12);
  });

  it('convertirTout contient l\'unité de départ inchangée', () => {
    const r = convertirTout(25, 'f');
    expect(r.f).toBe(25);
    procheDe(r.dH, 14.007);
  });
});

describe('mélange robinet / eau osmosée', () => {
  it('robinet 15 °dGH, osmosée 0, cible 6 → 40 % robinet', () => {
    const r = calculerMelange({ robinet: 15, douce: 0, cible: 6, volumeTotalL: 50 });
    expect(r.possible).toBe(true);
    if (!r.possible) return;
    procheDe(r.fractionRobinet, 0.4, 1e-12);
    procheDe(r.litresRobinet, 20, 1e-12);
    procheDe(r.litresDouce, 30, 1e-12);
    procheDe(dureteMelange(15, 0, r.fractionRobinet), 6, 1e-12);
  });

  it('eau douce non nulle (pluie à 1 °dGH)', () => {
    const r = calculerMelange({ robinet: 21, douce: 1, cible: 6, volumeTotalL: 100 });
    if (!r.possible) throw new Error('mélange attendu');
    procheDe(r.fractionRobinet, 0.25, 1e-12);
  });

  it('cible hors de portée', () => {
    expect(calculerMelange({ robinet: 10, douce: 0, cible: 12, volumeTotalL: 10 })).toEqual({ possible: false, raison: 'cible-trop-haute' });
    expect(calculerMelange({ robinet: 10, douce: 2, cible: 1, volumeTotalL: 10 })).toEqual({ possible: false, raison: 'cible-trop-basse' });
  });

  it('deux eaux identiques : 100 % robinet', () => {
    const r = calculerMelange({ robinet: 8, douce: 8, cible: 8, volumeTotalL: 10 });
    expect(r).toEqual({ possible: true, fractionRobinet: 1, litresRobinet: 10, litresDouce: 0 });
  });
});
