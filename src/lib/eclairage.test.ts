import { describe, expect, it } from 'vitest';
import { evaluerEclairage, lumensNecessaires, nombreRampes } from './eclairage';

/** Écart relatif toléré par la règle du projet : < 1 %. */
function procheDe(valeur: number, reference: number, tolerance = 0.01) {
  expect(Math.abs(valeur - reference) / reference).toBeLessThan(tolerance);
}

describe('lumens nécessaires', () => {
  // Exemple Aquasabi : 15 lm/L × 54 L = 810 lm.
  it('54 L, éclairage faible : 810 lm (exemple Aquasabi)', () => {
    procheDe(lumensNecessaires(54, 'faible').repere, 810);
  });

  it('fourchettes GreenAqua appliquées au volume', () => {
    expect(lumensNecessaires(100, 'faible')).toEqual({ min: 1000, max: 2000, repere: 1500 });
    expect(lumensNecessaires(100, 'moyen')).toEqual({ min: 2000, max: 4000, repere: 3000 });
    expect(lumensNecessaires(100, 'fort')).toEqual({ min: 4000, max: 7000, repere: 6000 });
  });
});

describe('évaluation d\'un éclairage', () => {
  it.each([
    [500, 100, 'insuffisant'],
    [1000, 100, 'faible'],
    [1999, 100, 'faible'],
    [2000, 100, 'moyen'],
    [4000, 100, 'fort'],
    [7000, 100, 'fort'],
    [7100, 100, 'tres-fort'],
  ])('%i lm pour %i L → %s', (lumens, volume, attendu) => {
    expect(evaluerEclairage(lumens, volume).evaluation).toBe(attendu);
  });

  it('1000 lm pour 54 L ≈ 18,5 lm/L', () => {
    procheDe(evaluerEclairage(1000, 54).lumensParLitre, 18.519);
  });

  it('volume nul : pas de division par zéro', () => {
    expect(evaluerEclairage(1000, 0)).toEqual({ lumensParLitre: 0, evaluation: 'insuffisant' });
  });
});

describe('nombre de rampes', () => {
  it('arrondit au supérieur', () => {
    expect(nombreRampes(3000, 1400)).toBe(3);
    expect(nombreRampes(2800, 1400)).toBe(2);
    expect(nombreRampes(1000, 0)).toBe(0);
  });
});
