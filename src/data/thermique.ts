/**
 * Constantes thermiques utilisées pour estimer les pertes de chaleur d'un aquarium.
 * Chaque valeur cite sa source (règle du projet : aucune donnée sans source).
 */

export interface ConstanteThermique {
  valeur: number;
  unite: string;
  libelle: string;
  source: string;
}

const ISO_6946 = 'NF EN ISO 6946 (composants et parois de bâtiments — résistance thermique), tableau des résistances superficielles';

export const RSI_HORIZONTAL: ConstanteThermique = {
  valeur: 0.13,
  unite: 'm²·K/W',
  libelle: 'Résistance superficielle, flux horizontal (vitres latérales)',
  source: ISO_6946,
};

export const RSI_MONTANT: ConstanteThermique = {
  valeur: 0.1,
  unite: 'm²·K/W',
  libelle: 'Résistance superficielle, flux montant (surface ou couvercle)',
  source: ISO_6946,
};

export const RSI_DESCENDANT: ConstanteThermique = {
  valeur: 0.17,
  unite: 'm²·K/W',
  libelle: 'Résistance superficielle, flux descendant (fond du bac)',
  source: ISO_6946,
};

export const LAMBDA_VERRE: ConstanteThermique = {
  valeur: 1.0,
  unite: 'W/(m·K)',
  libelle: 'Conductivité thermique du verre sodocalcique',
  source: 'NF EN 572-1 et NF EN ISO 10456 (valeurs thermiques utiles des matériaux) : 1,0 W/(m·K).',
};

export const COEF_EVAPORATION: ConstanteThermique = {
  valeur: 0.089,
  unite: 'W/(m²·Pa)',
  libelle: 'Coefficient d\'évaporation en air calme (équation de Carrier)',
  source:
    'ASHRAE Handbook — HVAC Applications, chapitre « Natatoriums » : w = A·(pw − pa)·(0,089 + 0,0782·V)/Y, ' +
    'ici avec une vitesse d\'air V = 0 ; multiplié par la chaleur latente Y, cela donne un flux de 0,089 W par m² et par Pa.',
};

export const MAGNUS = {
  a: 610.94,
  b: 17.625,
  c: 243.04,
  source: 'Formule de Magnus, coefficients d\'Alduchov & Eskridge (1996), Journal of Applied Meteorology 35(4).',
};

/** Puissances de chauffage courantes dans le commerce (W). */
export const PUISSANCES_COMMERCIALES = [25, 50, 75, 100, 150, 200, 250, 300] as const;
