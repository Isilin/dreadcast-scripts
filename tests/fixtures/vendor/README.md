# jQuery 1.8.2

Build navigateur de jQuery 1.8.2, la version que le client Dreadcast embarque.
Il sert à éprouver la couche de compatibilité du DDK contre le runtime réel,
plutôt que contre une approximation.

Le fichier est versionné ici et non tiré de npm. Le paquet `jquery@1.8.2`
déclare comme dépendances d'exécution le harnais de test de 2012 — `jsdom` 0.2,
`request`, `tough-cookie`, `qs`, `form-data`, `xmlhttprequest` — que rien ici ne
charge, mais qui portait douze vulnérabilités connues, provoquait des montées de
version à refuser, et faisait produire à Dependabot des lockfiles incohérents en
confondant ce `jsdom` 0.2 avec celui du catalogue.

Source : `jquery@1.8.2`, fichier `tmp/jquery.js`. Licence MIT
(<http://jquery.org/license>).

Pour le remplacer, prendre le build navigateur de la version que le jeu sert —
celui qui se termine par `})( window );` et ne comporte aucune branche
CommonJS. L'entrée Node du paquet npm fabrique son propre jsdom et ne convient
pas : jQuery serait lié à un autre document que celui des assertions.
