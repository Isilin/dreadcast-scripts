# Changelog

Tous changement notable dans ce projet sera référencé dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
et le projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Readme
- License
- Contributing guide
- Code of conduct
- Changelog
- Helpers functionalities
- Existing scripts
- DreadCast Development Kit
- DreadCast Script Manager
- DCSM : mise en cache de la liste des scripts pendant une heure, et liste de
  secours embarquée dans le userscript. Les scripts continuent de se charger
  quand la source distante est indisponible.
- Un outil `yarn sync:fallback` régénère la liste de secours embarquée depuis
  `data/scripts.json`, avec un contrôle en intégration continue.

### Fixed

- DCSM : la configuration des scripts n'est plus purgée quand la liste distante
  est indisponible. Auparavant, les scripts absents de la liste utilisée voyaient
  leur activation supprimée.
- DCSM : le chargement de la liste des scripts expire au bout de huit secondes.
  Sans délai maximal, une source qui ne répondait plus laissait la requête en
  suspens et aucun script n'était jamais chargé.

---

## 🔖 Format utilisé

| Tag          | Description                                               |
| ------------ | --------------------------------------------------------- |
| `Added`      | Pour les nouvelles fonctionnalités.                       |
| `Changed`    | Pour les changements dans des fonctionnalités existantes. |
| `Deprecated` | Pour les fonctionnalités bientôt obsolètes.               |
| `Removed`    | Pour les fonctionnalités supprimées.                      |
| `Fixed`      | Pour les bugs corrigés.                                   |
| `Security`   | Pour les corrections de failles de sécurité.              |

---
