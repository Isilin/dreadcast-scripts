// Genere par 'pnpm registry:sync' -- ne pas editer a la main.
//
// Copie hors ligne du catalogue, utilisee en dernier recours quand le cache
// local et la source distante sont tous les deux indisponibles. Elle peut
// avoir du retard sur data/scripts.json.

import type { ScriptEntry } from '@dreadcast/registry';

export const FALLBACK_LIST: ScriptEntry[] = [
  {
    "id": "comback",
    "name": "Com'Back",
    "description": "Il ajoute des fonctions d'en-tête aux messages, ainsi que de blocs pré-écrits, et rend les liens cliquables.",
    "authors": "Valion, Naugriim, Solon, Harlinde",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/17200/Com'back.user.js?version=1074459",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mailing"
    ],
    "experimental": false
  },
  {
    "id": "comcount",
    "name": "Com'Count",
    "description": "Il permet d'ajuster manuellement le nombre de messages non lus, lorsque celui-ci se désynchronise.",
    "authors": "Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/395938/Com'Count.user.js?version=830889",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mailing"
    ],
    "experimental": false
  },
  {
    "id": "vousavezunmessage",
    "name": "\"Vous avez un message\"",
    "description": "Il émet une alerte sonore à la réception d'un nouveau message.",
    "authors": "Gideon, Sÿ, Odul, Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/396697/VousAvezUnMessage.user.js?version=830556",
    "doc": "",
    "rp": "",
    "contact": "Odul",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mailing"
    ],
    "experimental": false
  },
  {
    "id": "messagerietitreperso",
    "name": "Messagerie : Titres Perso",
    "description": "Personnalisation des titres et des avatars d'aperçu, sur la messagerie.",
    "authors": "Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/415294/Messagerie%20:%20Titres%20Perso.user.js?version=1559798",
    "doc": "",
    "rp": "",
    "contact": "Pelagia",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mailing"
    ],
    "experimental": false
  },
  {
    "id": "lockddmail",
    "name": "LockD&DMail",
    "description": "Bloque le drag and drop sur la messagerie.",
    "authors": "Odul, Pelagia",
    "icon": "",
    "url": "https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/src/scripts/messagerie/lockd%26dmail.js",
    "doc": "",
    "rp": "",
    "contact": "Odul, Pelagia",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mailing"
    ],
    "experimental": false
  },
  {
    "id": "mailprotect",
    "name": "DC - Mail Protect",
    "description": "Ajoute un mode permettant de demander la confirmation avant de fermer un message en cours de réaction.",
    "authors": "Nasty, Odul, Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/480707/DC%20-%20Mail%20Protect.user.js?version=1285527",
    "doc": "",
    "rp": "",
    "contact": "Nasty, Odul",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mailing"
    ],
    "experimental": false
  },
  {
    "id": "roll",
    "name": "Roll",
    "description": "Faire des jets avec prise en compte des stats via des compétences.",
    "authors": "Odul, Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/447640/Roll.user.js?version=1070850",
    "doc": "https://www.dreadcast.net/Forum/2-56453-script-roll#1",
    "rp": "",
    "contact": "Odul",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "chat"
    ],
    "experimental": false
  },
  {
    "id": "dcce",
    "name": "DreadCast Chat Enhancer",
    "description": "Il ajoute de nombreuses fonctionnalités pour le chat et des options de customisation.",
    "authors": "Valion, Odul, Ladoria, Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/21359/Dreadcast%20Chat%20Enhancer.user.js?version=1068608",
    "doc": "https://www.dreadcast.net/Forum/2-67353-script-dc-chat-enhancer?5",
    "rp": "",
    "contact": "Odul, Pelagia",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "chat"
    ],
    "experimental": false
  },
  {
    "id": "chatinputdc",
    "name": "ChatInputDC",
    "description": "Automatically 'closing' the following characters in the chat input area: \", *, [, (, or {.",
    "authors": "Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/388245/ChatInputDC.user.js?version=722725",
    "doc": "",
    "rp": "",
    "contact": "Pelagia",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "chat"
    ],
    "experimental": false
  },
  {
    "id": "skinsilhouette",
    "name": "SkinSilhouette",
    "description": "Voir des silhouettes personnalisées.",
    "authors": "Odul, Lorkah, Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/6081/SkinSilhouette.user.js?version=1271247",
    "doc": "",
    "rp": "",
    "contact": "Odul",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "silhouette"
    ],
    "experimental": false
  },
  {
    "id": "showsilhouettebyisilin",
    "name": "ShowSilhouette - By Isilin",
    "description": "Un skin réorganisant l'inventaire pour mieux voir les silhouettes.",
    "authors": "Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/415259/ShowSilhouette%20-%20By%20Isilin.user.js?version=864933",
    "doc": "",
    "rp": "",
    "contact": "Pelagia",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "silhouette"
    ],
    "experimental": false
  },
  {
    "id": "showsilhouettevalion",
    "name": "Show Silhouette Valion",
    "description": "Un skin réorganisant l'inventaire pour mieux voir les silhouettes.",
    "authors": "Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/415246/Show%20Silhouette%20Valion.user.js?version=864762",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "silhouette"
    ],
    "experimental": false
  },
  {
    "id": "stopmultiplemessageforumonly",
    "name": "StopMultipleMessageForumOnly",
    "description": "Empêche les messages doublons accidentels sur le forum.",
    "authors": "Kmaschta, Valion, Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/508039/StopMultipleMessageForumOnly.user.js?version=1446184",
    "doc": "",
    "rp": "",
    "contact": "Pelagia",
    "settings": false,
    "section": [
      "forum"
    ],
    "category": [
      "fix"
    ],
    "experimental": false
  },
  {
    "id": "séparationsujets",
    "name": "Séparation sujets",
    "description": "Separe le RP du HRP dans la section 'Derniers Sujets",
    "authors": "Aversiste, MockingJay, Odul, Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/508226/S%C3%A9paration%20sujets.user.js?version=1448853",
    "doc": "",
    "rp": "",
    "contact": "Odul, Pelagia",
    "settings": false,
    "section": [
      "forum"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "breakinglinecode",
    "name": "BreakingLineCode",
    "description": "Ajoute un retour à la ligne automatique pour la balise code.",
    "authors": "Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/493103/BreakingLineCode.user.js?version=1363923",
    "doc": "https://www.dreadcast.net/Forum/2-108077-themefix-dc-forum-fix?1#2",
    "rp": "",
    "contact": "Pelagia",
    "settings": false,
    "section": [
      "forum"
    ],
    "category": [
      "fix"
    ],
    "experimental": false
  },
  {
    "id": "mapoverlay",
    "name": "DC Map Overlay",
    "description": "Modification de la carte initiale dans DC, par remplacement et/ou ajout d'une surcouche.",
    "authors": "Radium",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/394964/DC_MapOverlay%20fouilleur.user.js?version=764590",
    "doc": "https://www.dreadcast.net/Forum/2-83878-script-dc_mapoverlay?1",
    "rp": "",
    "contact": "Radium",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "nightmode",
    "name": "DC Nightmode",
    "description": "Un script qui enlève certains éléments graphiques pour un thème plus sombre.",
    "authors": "Lorkah",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/370999/DC%20-%20Nightmode.user.js?version=945864",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "datefixed",
    "name": "DC - Date fixed",
    "description": "Affiche la date en jeu, et des commandes sur le deck.",
    "authors": "Ianouf, Ladoria, Nasty",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/453281/DC%20-%20Date%20fixed.user.js?version=1106311",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "compteursac",
    "name": "Compteur Sac",
    "description": "Affiche sur le sac le nombre d'objets qui y est. Se rafraichit toutes les 3 secondes.",
    "authors": "Anon, Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/25490/Compteur%20Sac.user.js?version=750393",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "blockuse",
    "name": "DC - BlockUse",
    "description": "Bloque l'utilisation de consommables par défaut. Faut déverouiller le petit cadenas 'BU' pour pouvoir.",
    "authors": "Odul, Lorkah",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/412356/DC%20-%20BlockUse%20Fixed.user.js?version=888873",
    "doc": "",
    "rp": "",
    "contact": "Odul",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "autorefresh",
    "name": "DC - AutoRefresh",
    "description": "Tente automatiquement de rafraîchir le jeu si la connexion est perdue, et affiche le ping du serveur.",
    "authors": "Ladoria, Lorkah",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/415271/DC%20-%20AutoRefresh%20Fixed.user.js?version=864870",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "fix"
    ],
    "experimental": false
  },
  {
    "id": "bulletsalert",
    "name": "Bullets Alert",
    "description": "Joue un son lorsque votre chargeur est vide.",
    "authors": "Ladoria, Lorkah",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/404024/DC%20-%20Bullets_alert_fixed.user.js?version=888872",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "bougetafeuille",
    "name": "DC - Bouge ta feuille",
    "description": "Rend la lecture plus agréable en permettant de déplacer plus facilement une feuille.",
    "authors": "Nasty",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/453476/DC%20-%20Bouge%20ta%20feuille.user.js?version=1107622",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "copyterminal",
    "name": "Copy Terminal",
    "description": "Copie rapidement le contenu d'une page du TP (STV, Cryo, Historiques des entreprises et OI).",
    "authors": "RedLine",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/486524/copyTerminal.user.js?version=1322828",
    "doc": "",
    "rp": "",
    "contact": "Redline",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "neuvopackoverhaul",
    "name": "Neuvopack Overhaul",
    "description": "Modifie l'interface des neuvopacks pour un usage plus agréable (suivi en direct du contenu, extraction des condensés rapide).",
    "authors": "Altaïr",
    "icon": "https://www.dreadcast.net/images/objets/NEUVOPACK_262px.png",
    "url": "https://update.greasyfork.org/scripts/468141/Neuvopack%20Overhaul.user.js?version=1491022",
    "doc": "https://www.dreadcast.net/Forum/2-144257-script-neuvopack-overhaul?1",
    "rp": "",
    "contact": "Altaïr",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "tpoverhaul",
    "name": "TP Overhaul",
    "description": "Modernisation de l'interface du Terminal Portable.",
    "authors": "Altaïr",
    "icon": "https://www.dreadcast.net/images/objets/mini/TERMINAL%20PORTABLE2.png",
    "url": "https://update.greasyfork.org/scripts/488053/TP%20Overhaul.user.js?version=1558625",
    "doc": "https://www.dreadcast.net/Forum/2-145540-script-tp-overhaul",
    "rp": "",
    "contact": "Altaïr",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "visio3d",
    "name": "Visio 3D",
    "description": "Utilitaire pour récupérer les plans et FW d'un bâtiment.",
    "authors": "Pelagia",
    "icon": "https://www.dreadcast.net/images/objets/decker-casque2.png",
    "url": "https://update.greasyfork.org/scripts/481981/Visio%203D.user.js?version=1533889",
    "doc": "https://www.dreadcast.net/Forum/2-144695-ns-v13612u-visio-3d---logiciel-utilitaire-pour-la-decoration-dinterieur?1",
    "rp": "https://www.dreadcast.net/Forum/2-144695-ns-v13612u-visio-3d---logiciel-utilitaire-pour-la-decoration-dinterieur?1",
    "contact": "Pelagia",
    "settings": true,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "eccb",
    "name": "Editeur de Commentaires de Conteneurs en Banque",
    "description": "Permet de mettre un commentaire sur ses sacs en banque pour mieux s'y retrouver!",
    "authors": "Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/488837/ECCB.user.js?version=1337142",
    "doc": "https://www.dreadcast.net/Forum/2-144702-ns-e13612u-eccb---editeur-de-commentaires-de-conteneurs-en-banque?1",
    "rp": "https://www.dreadcast.net/Forum/2-136024--aequilibrium-financial-#10",
    "contact": "Pelagia",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "autostock",
    "name": "AutoStock",
    "description": "Permet le réajustement des stocks en vente ou les prix dans l'usine de production pour DC.",
    "authors": "Amane-Mochizuki",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/493495/DC%20-%20AutoStock%20%28channel%20Beta%29.user.js?version=1366383",
    "doc": "https://www.dreadcast.net/Forum/2-145375-script-autostock?1",
    "rp": "",
    "contact": "Amane-Mochizuki",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "silmerionwindowfix",
    "name": "Silmerion Window Fix",
    "description": "Règle le problème faisant que la fenêtre du Silmerion empêche le clic ailleurs sur la page.",
    "authors": "Arrakis",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/371206/Silmerion%20Window%20Fix.user.js?version=641774",
    "doc": "",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "fix"
    ],
    "experimental": false
  },
  {
    "id": "skwikker",
    "name": "Skwikker",
    "description": "Pour accéder au célèbre réseau social Skwikker.",
    "authors": "Valion",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/30182/Skwikker.user.js?version=201187",
    "doc": "https://www.dreadcast.net/Forum/2-77724-script-skwikker",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "forum",
      "edc"
    ],
    "category": [
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "silhouettePlus",
    "name": "Silhouette+",
    "description": "Pour personnaliser entièrement sa feuille RP avec silhouette et plus. Réunit les scripts SkinSilhouette et ShowSilhouette.",
    "authors": "Isilin/Pelagia",
    "icon": "",
    "url": "https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/src/scripts/silhouette/silhouette-plus.js",
    "doc": "https://www.dreadcast.net/Forum/2-150257-script-silhouette",
    "rp": "",
    "contact": "Pelagia",
    "settings": true,
    "section": [
      "game"
    ],
    "category": [
      "silhouette"
    ],
    "experimental": false
  },
  {
    "id": "vitrineStock",
    "name": "Vitrine vs Stocks",
    "description": "Check stock et vitrine / Check quantité",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/527017/Vitrine%20vs%20Stocks.user.js?version=1584063",
    "doc": "https://greasyfork.org/en/scripts/527017-vitrine-vs-stocks",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "objectLinking",
    "name": "Partage d'objet chat",
    "description": "Permet de partager un objet dans le chat facilement",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/528245/Partage%20d%27objet%20chat.user.js?version=1583032",
    "doc": "https://greasyfork.org/en/scripts/528245-partage-d-objet-chat",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "chat"
    ],
    "experimental": false
  },
  {
    "id": "copyPasteAll",
    "name": "Copy Paste all",
    "description": "Ajoute un bouton qui vous permet de copier tous les posts d'une page forum dans votre presse-papier.",
    "authors": "Silly",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/529290/%5BDC%5D%20Copy%20Paste%20All%20-%20Forum.user.js?version=1550441",
    "doc": "https://www.dreadcast.net/Forum/2-151693-script-copy-paste-all---forum",
    "rp": "",
    "contact": "Silly",
    "settings": false,
    "section": [
      "forum"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "panFenestra",
    "name": "P.A.N. Fenestra",
    "description": "Un nouveau système d'exploitation pour votre espace matriciel personnel.",
    "authors": "Isilin/Pelagia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/530381/PAN%20Fenestra.user.js?version=1557231",
    "doc": "https://www.dreadcast.net/Forum/2-152039-script-pan-fenestra?1",
    "rp": "",
    "contact": "Pelagia",
    "settings": false,
    "section": [
      "forum"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "deckExportData",
    "name": "DeckExportData",
    "description": "Permet de copier les données du deck",
    "authors": "Amane-Mochizuki",
    "icon": "https://i.imgur.com/Wn8zYJ8.png",
    "url": "https://update.greasyfork.org/scripts/530389/DC%20-%20DeckExportData.user.js?version=1563381",
    "doc": "https://www.dreadcast.net/Forum/2-152205-script-deck-export-data?1",
    "rp": "",
    "contact": "Amane-Mochizuki",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "fix"
    ],
    "experimental": false
  },
  {
    "id": "fixUsine",
    "name": "Fix Usine",
    "description": "Empêche la fenêtre d'usine de se fermer quand on achète",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/527127/%22Fix%22%20usine.user.js?version=1554902",
    "doc": "",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "fix"
    ],
    "experimental": false
  },
  {
    "id": "holovision",
    "name": "HoloVision",
    "description": "Historique chat malléable",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/532962/Holovision.user.js?version=1573401",
    "doc": "https://www.dreadcast.net/Forum/2-152896-script-holovision?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "chat"
    ],
    "experimental": false
  },
  {
    "id": "neuvosmart",
    "name": "NeuvoSmart",
    "description": "Son quand le neuvopack est plein / UI de suivi",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/544413/NeuvoSmart.user.js?version=1634380",
    "doc": "https://www.dreadcast.net/Forum/2-155651-script-neuvosmart?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "mech"
    ],
    "experimental": false
  },
  {
    "id": "dcmobilefix",
    "name": "DC Mobile Fix",
    "description": "Divers fix mobile",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/537990/Mobile%20DC%20Fix.user.js?version=1600207",
    "doc": "https://www.dreadcast.net/Forum/2-155650-script-dc-mobile---fix?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "fix"
    ],
    "experimental": true
  },
  {
    "id": "aitlDuPremierCoup",
    "name": "AITL - Du premier coup ! ",
    "description": "Preview de l'annonce AITL",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/533831/AITL%20-%20Du%20premier%20coup%20%21.user.js?version=1677497",
    "doc": "https://www.dreadcast.net/Forum/2-153038-script-aitl---du-premier-coup?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "details",
    "name": "Details!",
    "description": "Log de combat détaillé",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/535028/Details%21.user.js?version=1687389",
    "doc": "https://www.dreadcast.net/Forum/2-153293-scripts-details?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "chatBulle",
    "name": "ChatBulle",
    "description": "Affiche une bulle de tchat au-dessus des personnages",
    "authors": "Asalia",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/554530/ChatBulle.user.js?version=1696150",
    "doc": "https://www.dreadcast.net/Forum/2-158092-script-chatbulle?1",
    "rp": "",
    "contact": "Asalia",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "chat"
    ],
    "experimental": false
  },
  {
    "id": "dcnotif",
    "name": "DC Notif'",
    "description": "Notifications traitées dans une interface",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/534899/DC%20Notif%27.user.js?version=1590384",
    "doc": "https://www.dreadcast.net/Forum/2-153271-script-dc-notif?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui",
      "fix"
    ],
    "experimental": false
  },
  {
    "id": "pimpmypion",
    "name": "Pimp My Pion",
    "description": "Remplace les pions bleus par les avatars des joueurs et ajoute des paramètres de personnalisation",
    "authors": "Darlene",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/556113/Dreadcast%20-%20PimpMyPion%20-%20Public%20v%20063.user.js?version=1709845",
    "doc": "https://www.dreadcast.net/Forum/2-158238-script-pimpmypion?1",
    "rp": "",
    "contact": "Darlene",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "fouilletracker",
    "name": "DC Fouille Tracker",
    "description": "Minuteur fouille draggable, lock/unlock, historique déroulant, vide de l'historique, copier de l'historique (thème bleu)",
    "authors": "Yenzelle",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/557196/DC%20-%20Fouille%20Tracker%20%28Bleu%29.user.js?version=1703636",
    "doc": "https://www.dreadcast.net/Forum/2-158505-script-dc-fouille-tracker?1",
    "rp": "",
    "contact": "",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "ddm",
    "name": "DC Dynamic Message V2",
    "description": "Messagerie version dynamique et réactive",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/557947/DDM%20V2.user.js?version=1800579",
    "doc": "https://www.dreadcast.net/Forum/2-158665-script-ddm-v2?4",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": true
  },
  {
    "id": "fpl",
    "name": "FPLive",
    "description": "Notifs en jeu lorsqu'un FP suivi reçoit un message",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/565766/FPLive.user.js?version=1752030",
    "doc": "https://www.dreadcast.net/Forum/2-159824-script-fpl?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game",
      "forum"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "igforum",
    "name": "IGForum",
    "description": "Permet d'accéder au forum depuis le jeu",
    "authors": "Ciel",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/565953/IGForum.user.js?version=1752886",
    "doc": "https://www.dreadcast.net/Forum/2-159840-script-igforum?1",
    "rp": "",
    "contact": "Ciel",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "gpsrouge",
    "name": "GPS Rouge",
    "description": "Remplace la flèche bleue du GPS par une flèche rouge.",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/532463/GPS%20Rouge.user.js?version=1571171",
    "doc": "https://www.dreadcast.net/Forum/2-152684-script---sommaire-lain?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "ui"
    ],
    "experimental": false
  },
  {
    "id": "kobsteak",
    "name": "Kobsteak!",
    "description": "Un snake à l'intérieur de Dreadcast. Quand l'autre met trop de temps à répondre pendant un RPQ.",
    "authors": "Laïn",
    "icon": "",
    "url": "https://update.greasyfork.org/scripts/531236/KobSteak%21.user.js?version=1571171",
    "doc": "https://www.dreadcast.net/Forum/2-152684-script---sommaire-lain?1",
    "rp": "",
    "contact": "Laïn",
    "settings": false,
    "section": [
      "game"
    ],
    "category": [
      "mech"
    ],
    "experimental": false
  }
];
