import { describe, expect, it } from 'vitest';
import { aireSegment, calculerVolume, longueurArc, masseVerre, surfaceInterieure } from './volume';

/** Écart relatif toléré par la règle du projet : < 1 %. */
function procheDe(valeur: number, reference: number, tolerance = 0.01) {
  expect(Math.abs(valeur - reference) / reference).toBeLessThan(tolerance);
}

describe('géométrie du segment circulaire', () => {
  it('demi-cercle : aire = πr²/2 et arc = πr', () => {
    procheDe(aireSegment(40, 20), (Math.PI * 20 ** 2) / 2, 1e-9);
    procheDe(longueurArc(40, 20), Math.PI * 20, 1e-9);
  });

  it('segment plus grand qu\'un demi-cercle = disque − segment complémentaire', () => {
    const c = 40;
    const s = 30;
    const r = (c * c) / (8 * s) + s / 2;
    procheDe(aireSegment(c, s), Math.PI * r * r - aireSegment(c, 2 * r - s), 1e-9);
  });

  it('flèche nulle : pas de segment, arc = corde', () => {
    expect(aireSegment(40, 0)).toBe(0);
    expect(longueurArc(40, 0)).toBe(40);
  });
});

describe('volume brut — exemples publiés', () => {
  // Exemple du guide de calcul : 80 × 35 × 40 cm → 112 L.
  it('80 × 35 × 40 cm = 112 L', () => {
    const r = calculerVolume({ forme: 'rectangulaire', longueurCm: 80, largeurCm: 35, hauteurCm: 40, epaisseurVerreMm: 0 });
    procheDe(r.volumeBrutL, 112);
  });

  // Exemple Aquasabi (éclairage) : bac de 54 L = 60 × 30 × 30 cm.
  it('60 × 30 × 30 cm = 54 L', () => {
    const r = calculerVolume({ forme: 'rectangulaire', longueurCm: 60, largeurCm: 30, hauteurCm: 30, epaisseurVerreMm: 0 });
    procheDe(r.volumeBrutL, 54);
  });

  it('cylindre Ø 50 × 60 cm = π × 25² × 60 = 117,8 L', () => {
    const r = calculerVolume({ forme: 'cylindrique', longueurCm: 50, largeurCm: 0, hauteurCm: 60, epaisseurVerreMm: 0 });
    procheDe(r.volumeBrutL, 117.81);
  });
});

describe('dimensions intérieures', () => {
  it('retire deux épaisseurs de verre en longueur/largeur et une en hauteur', () => {
    // 60 × 30 × 30 en verre de 5 mm → 59 × 29 × 29,5 = 50,47 L
    const r = calculerVolume({ forme: 'rectangulaire', longueurCm: 60, largeurCm: 30, hauteurCm: 30, epaisseurVerreMm: 5 });
    procheDe(r.volumeBrutL, 50.4745);
  });

  it('panoramique = rectangle + segment avant', () => {
    const d = { forme: 'panoramique' as const, longueurCm: 100, largeurCm: 40, hauteurCm: 50, epaisseurVerreMm: 0, flecheCm: 10 };
    procheDe(surfaceInterieure(d), 100 * 40 + aireSegment(100, 10), 1e-9);
  });
});

describe('volume d\'eau réel', () => {
  const bac = { forme: 'rectangulaire' as const, longueurCm: 80, largeurCm: 35, hauteurCm: 40, epaisseurVerreMm: 0 };

  it('par défaut, eau à 2 cm du bord', () => {
    procheDe(calculerVolume(bac).volumeEauL, (80 * 35 * 38) / 1000);
  });

  it('retire le sol et le décor', () => {
    // 80 × 35 × (36 − 5) = 86,8 L − 4 L de décor = 82,8 L ; sol = 80 × 35 × 5 = 14 L
    const r = calculerVolume({ ...bac, hauteurEauCm: 36, hauteurSolCm: 5, volumeDecorL: 4 });
    procheDe(r.volumeEauL, 82.8);
    procheDe(r.volumeSolL, 14);
  });

  it('ne devient jamais négatif', () => {
    expect(calculerVolume({ ...bac, hauteurEauCm: 1, volumeDecorL: 50 }).volumeEauL).toBe(0);
  });
});

describe('poids', () => {
  it('eau douce 0,997 kg/L, eau de mer 1,023 kg/L', () => {
    const bac = { forme: 'rectangulaire' as const, longueurCm: 80, largeurCm: 35, hauteurCm: 40, epaisseurVerreMm: 0, hauteurEauCm: 40 };
    procheDe(calculerVolume(bac).poids.eauKg, 112 * 0.997);
    procheDe(calculerVolume({ ...bac, eau: 'mer' }).poids.eauKg, 112 * 1.023);
  });

  it('verre : 60 × 30 × 30 cm en 5 mm ≈ 7,6 kg', () => {
    // Avant/arrière 2 × 60 × 30, côtés 2 × 29 × 30, fond 59 × 29, épaisseur 0,5 cm, 2,5 g/cm³
    const cm3 = (2 * 60 * 30 + 2 * 29 * 30 + 59 * 29) * 0.5;
    procheDe(
      masseVerre({ forme: 'rectangulaire', longueurCm: 60, largeurCm: 30, hauteurCm: 30, epaisseurVerreMm: 5 }),
      (cm3 * 2.5) / 1000,
    );
  });

  it('total = eau + verre + sol', () => {
    const r = calculerVolume({ forme: 'rectangulaire', longueurCm: 100, largeurCm: 40, hauteurCm: 50, epaisseurVerreMm: 8, hauteurSolCm: 6 });
    procheDe(r.poids.totalKg, r.poids.eauKg + r.poids.verreKg + r.poids.solKg, 1e-12);
  });
});
