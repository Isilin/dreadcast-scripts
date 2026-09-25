import { describe, expect, it } from 'vitest';

import { imageUrl, ownSilhouette, parseSheet, silhouetteCss } from '../src/silhouettes.ts';

// Extrait fidele a la forme du Sheet reel : en-tete, lignes sans URL, cellules
// saisies a la main qui n'en sont pas.
const ROWS = [
  ['', 'Pseudo', 'URL'],
  ['460', 'XIX'],
  ['553', 'Zalaniz', 'https://imagizer.imageshack.com/img921/7361/jP0Tuj.png'],
  ['1637', 'ElfeSombre'],
  ['1700', 'Ancien', 'http://example.org/ancien.png'],
  ['1800', 'Note', 'Edith'],
  ['1801', 'Fragment', '1xAtdjO'],
  ['abc', 'SansId', 'https://example.org/sans-id.png'],
  ['76113', 'Pelagia', 'https://example.org/pelagia.png'],
];

describe('imageUrl', () => {
  it('accepte les URL http et https', () => {
    expect(imageUrl('https://i.imgur.com/z9KIk7K.png')).toBe('https://i.imgur.com/z9KIk7K.png');
    expect(imageUrl(' http://example.org/a.png ')).toBe('http://example.org/a.png');
  });

  it('rejette le vide, le texte libre et les autres protocoles', () => {
    expect(imageUrl(undefined)).toBeUndefined();
    expect(imageUrl('')).toBeUndefined();
    expect(imageUrl('Edith')).toBeUndefined();
    expect(imageUrl('javascript:alert(1)')).toBeUndefined();
    expect(imageUrl('data:image/png;base64,AAAA')).toBeUndefined();
  });

  it('ne laisse aucun guillemet qui sortirait du url("...")', () => {
    const url = imageUrl('https://example.org/a".png?b="c"#"d');

    expect(url).toBeDefined();
    expect(url).not.toContain('"');
  });
});

describe('parseSheet', () => {
  it("indexe par identifiant et par pseudo, en ecartant l'en-tete et les lignes sans URL", () => {
    const index = parseSheet(ROWS);

    expect([...index.byId.keys()]).toEqual(['553', '1700', '76113']);
    expect(index.byId.get('553')).toBe('https://imagizer.imageshack.com/img921/7361/jP0Tuj.png');
    expect(index.byName.get('zalaniz')).toBe(
      'https://imagizer.imageshack.com/img921/7361/jP0Tuj.png',
    );
    expect(index.byName.get('sansid')).toBe('https://example.org/sans-id.png');
    expect(index.byName.has('pseudo')).toBe(false);
    expect(index.byName.has('xix')).toBe(false);
  });
});

describe('ownSilhouette', () => {
  it('cherche par identifiant, puis par pseudo sans tenir compte de la casse', () => {
    const index = parseSheet(ROWS);

    expect(ownSilhouette(index, { id: '553', name: 'autre' })).toBe(index.byId.get('553'));
    expect(ownSilhouette(index, { id: '999', name: ' SansId ' })).toBe(
      'https://example.org/sans-id.png',
    );
    expect(ownSilhouette(index, { id: '999', name: 'inconnu' })).toBeUndefined();
  });
});

describe('silhouetteCss', () => {
  it('pose une regle par fiche RP connue, qui prime sur le style en ligne du jeu', () => {
    const css = silhouetteCss(parseSheet(ROWS));

    expect(css).toContain(
      '#ib_persoBox_553 .personnage_image { background-image: url("https://imagizer.imageshack.com/img921/7361/jP0Tuj.png") !important; background-position: 0 0 !important; }',
    );
    expect(css).not.toContain('#zone_inventaire');
  });

  it("habille l'inventaire du joueur", () => {
    const css = silhouetteCss(parseSheet(ROWS), { id: '76113', name: 'Pelagia' });

    expect(css).toContain(
      '#zone_inventaire .personnage_image { background-image: url("https://example.org/pelagia.png")',
    );
  });

  it("habille aussi sa fiche RP quand il n'est connu que par son pseudo", () => {
    const css = silhouetteCss(parseSheet(ROWS), { id: '42', name: 'SansId' });

    expect(css).toContain(
      '#ib_persoBox_42 .personnage_image { background-image: url("https://example.org/sans-id.png")',
    );
  });
});
