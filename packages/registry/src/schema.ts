import { z } from 'zod';

/** Contextes de jeu dans lesquels un script peut etre charge. */
export const SECTIONS = ['game', 'forum', 'edc', 'wiki'] as const;

/** Rubriques du filtre de la fenetre "Scripts & Skins". */
export const CATEGORIES = ['mailing', 'chat', 'silhouette', 'ui', 'mech', 'fix', 'misc'] as const;

// Les champs facultatifs du catalogue valent la chaine vide plutot que d'etre
// absents : c'est la forme historique, et les DCSM deja installes la lisent
// telle quelle.
const urlOrEmpty = z.string().refine((value) => value === '' || /^https?:\/\//.test(value), {
  message: 'doit etre une URL http(s) ou une chaine vide',
});

export const scriptSchema = z.object({
  /** Identifiant stable : il sert de cle de configuration chez les joueurs. */
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  authors: z.string(),
  icon: urlOrEmpty,
  url: z.string().refine((value) => /^https?:\/\//.test(value), {
    message: 'doit etre une URL http(s)',
  }),
  doc: urlOrEmpty,
  rp: urlOrEmpty,
  contact: z.string(),
  /** Le script declare un schema de reglages via DC.registerScript. */
  settings: z.boolean(),
  section: z.array(z.enum(SECTIONS)).min(1),
  category: z.array(z.enum(CATEGORIES)).min(1),
  /** Visible seulement quand le mode developpeur est actif. */
  experimental: z.boolean(),
});

export const registrySchema = z.array(scriptSchema).min(1);

export type ScriptEntry = z.infer<typeof scriptSchema>;
export type Registry = z.infer<typeof registrySchema>;
export type Section = (typeof SECTIONS)[number];
export type Category = (typeof CATEGORIES)[number];
