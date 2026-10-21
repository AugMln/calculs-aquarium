/**
 * Masses volumiques utilisées pour estimer le poids d'un aquarium.
 * Chaque valeur cite sa source (règle du projet : aucune donnée sans source).
 */

export interface Constante {
  /** Valeur en kg/L (équivalent à g/cm³). */
  valeur: number;
  libelle: string;
  source: string;
}

export const EAU_DOUCE: Constante = {
  valeur: 0.997,
  libelle: 'Eau douce à 25 °C',
  source:
    'Équation d\'état UNESCO EOS-80 (Millero & Poisson, 1981), S = 0, T = 25 °C : 997,05 kg/m³ ; ' +
    'cohérent avec le CRC Handbook of Chemistry and Physics (0,99705 g/cm³).',
};

export const EAU_DE_MER: Constante = {
  valeur: 1.023,
  libelle: 'Eau de mer (salinité 35 ‰) à 25 °C',
  source: 'Équation d\'état UNESCO EOS-80 (Millero & Poisson, 1981), S = 35, T = 25 °C : 1023,3 kg/m³.',
};

export const VERRE: Constante = {
  valeur: 2.5,
  libelle: 'Verre float (sodocalcique)',
  source:
    'NF EN 572-1 « Verre dans la construction — Produits de base : verre de silicate sodo-calcique » : 2500 kg/m³ ; ' +
    'valeur reprise dans les sujets Eduscol (CAP Arts et techniques du verre).',
};

export const SUBSTRAT_SATURE: Constante = {
  valeur: 2.0,
  libelle: 'Sable ou gravier gorgé d\'eau',
  source:
    'Sable sec : ~1600 kg/m³ (Engineering ToolBox, « Soil and Rock Bulking Factors ») + eau remplissant ' +
    '~40 % de vides (porosité typique d\'un sable). Valeur arrondie volontairement vers le haut (sécurité du meuble).',
};
