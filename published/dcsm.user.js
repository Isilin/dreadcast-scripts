// ==UserScript==
// @name         Dreadcast Script Manager
// @namespace    Dreadcast
// @version      1.5.1
// @author       Pelagia/Isilin
// @description  Centralize all dreadcast scripts in one single source, integrated to the game.
// @license      https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @downloadURL  https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.user.js
// @updateURL    https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.meta.js
// @match        https://www.dreadcast.net/Main
// @match        https://www.dreadcast.net/Forum
// @match        https://www.dreadcast.net/Forum/*
// @match        https://www.dreadcast.net/EDC
// @match        https://www.dreadcast.net/EDC/*
// @require      https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js?version=1907758
// @connect      update.greasyfork.org
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      sheets.googleapis.com
// @connect      raw.githubusercontent.com
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function(_dreadcast_ddk) {
	"use strict";
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	_dreadcast_ddk = __toESM(_dreadcast_ddk);
	var FALLBACK_LIST = [
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
			"section": ["game"],
			"category": ["mailing"],
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
			"section": ["game"],
			"category": ["mailing"],
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
			"section": ["game"],
			"category": ["mailing"],
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
			"section": ["game"],
			"category": ["mailing"],
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
			"section": ["game"],
			"category": ["mailing"],
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
			"section": ["game"],
			"category": ["mailing"],
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
			"section": ["game"],
			"category": ["chat"],
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
			"section": ["game"],
			"category": ["chat"],
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
			"section": ["game"],
			"category": ["chat"],
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
			"section": ["game"],
			"category": ["silhouette"],
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
			"section": ["game"],
			"category": ["silhouette"],
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
			"section": ["game"],
			"category": ["silhouette"],
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
			"section": ["forum"],
			"category": ["fix"],
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
			"section": ["forum"],
			"category": ["ui"],
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
			"section": ["forum"],
			"category": ["fix"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui", "mech"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui", "fix"],
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
			"section": ["game"],
			"category": ["mech"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui", "mech"],
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
			"section": ["game"],
			"category": ["ui", "mech"],
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
			"section": ["game"],
			"category": ["ui", "mech"],
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
			"section": ["game"],
			"category": ["fix"],
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
			"section": ["forum", "edc"],
			"category": ["mech"],
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
			"section": ["game"],
			"category": ["silhouette"],
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
			"section": ["game"],
			"category": ["ui", "mech"],
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
			"section": ["game"],
			"category": ["chat"],
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
			"section": ["forum"],
			"category": ["ui"],
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
			"section": ["forum"],
			"category": ["ui"],
			"experimental": false
		},
		{
			"id": "deckExportData",
			"name": "DeckExportData",
			"description": "Permet de copier les données du deck",
			"authors": "Amane-Mochizuki",
			"icon": "https://i.imgur.com/Wn8zYJ8.png",
			"url": "https://update.greasyfork.org/scripts/530389-dc-deckexportdata.user.js?version=1563381",
			"doc": "https://www.dreadcast.net/Forum/2-152205-script-deck-export-data?1",
			"rp": "",
			"contact": "Amane-Mochizuki",
			"settings": false,
			"section": ["game"],
			"category": ["fix"],
			"experimental": false
		},
		{
			"id": "fixUsine",
			"name": "Fix Usine",
			"description": "Empêche la fenêtre d'usine de se fermer quand on achète",
			"authors": "Laïn",
			"icon": "",
			"url": "https://update.greasyfork.org/scripts/527127-fix-usine.user.js?version=1554902",
			"doc": "",
			"rp": "",
			"contact": "Laïn",
			"settings": false,
			"section": ["game"],
			"category": ["fix"],
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
			"section": ["game"],
			"category": ["chat"],
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
			"section": ["game"],
			"category": ["ui", "mech"],
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
			"section": ["game"],
			"category": ["fix"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui", "chat"],
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
			"section": ["game"],
			"category": ["ui", "fix"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game", "forum"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["ui"],
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
			"section": ["game"],
			"category": ["mech"],
			"experimental": false
		}
	];
	var KEYS = {
		enabled: "dcsm_list",
		allDisabled: "dcsm_all_disabled",
		introDisabled: "dcsm_intro_disabled",
		devMode: "dcsm_dev_mode",
		cache: "dcsm_scripts_cache"
	};
	var LEGACY_KEYS = {
		enabled: "dcm_list",
		allDisabled: "dcm_all_disabled"
	};
	var migrate = () => {
		for (const [field, oldKey] of Object.entries(LEGACY_KEYS)) {
			const value = _dreadcast_ddk.default.storage.get(oldKey);
			if (value === void 0) continue;
			_dreadcast_ddk.default.storage.set(KEYS[field], value);
			_dreadcast_ddk.default.storage.remove(oldKey);
		}
	};
	var load = () => {
		_dreadcast_ddk.default.storage.init(KEYS.enabled, {});
		_dreadcast_ddk.default.storage.init(KEYS.allDisabled, false);
		_dreadcast_ddk.default.storage.init(KEYS.introDisabled, false);
		_dreadcast_ddk.default.storage.init(KEYS.devMode, false);
		migrate();
		return {
			enabled: _dreadcast_ddk.default.storage.get(KEYS.enabled) ?? {},
			allDisabled: _dreadcast_ddk.default.storage.get(KEYS.allDisabled) ?? false,
			introDisabled: _dreadcast_ddk.default.storage.get(KEYS.introDisabled) ?? false,
			devMode: _dreadcast_ddk.default.storage.get(KEYS.devMode) ?? false
		};
	};
	var save = (state) => {
		_dreadcast_ddk.default.storage.set(KEYS.enabled, state.enabled);
		_dreadcast_ddk.default.storage.set(KEYS.allDisabled, state.allDisabled);
		_dreadcast_ddk.default.storage.set(KEYS.devMode, state.devMode);
	};
	var markIntroSeen = () => {
		_dreadcast_ddk.default.storage.set(KEYS.introDisabled, true);
	};
	var synchronize = (enabled, scripts, prune) => {
		const next = { ...enabled };
		for (const script of scripts) if (!Object.hasOwn(next, script.id)) next[script.id] = false;
		const result = prune ? Object.fromEntries(Object.entries(next).filter(([id]) => scripts.some((script) => script.id === id))) : next;
		_dreadcast_ddk.default.storage.set(KEYS.enabled, result);
		return result;
	};
	var reset = () => {
		for (const key of _dreadcast_ddk.default.storage.keys()) _dreadcast_ddk.default.storage.remove(key);
	};
	var exportConfig = () => Object.fromEntries(_dreadcast_ddk.default.storage.keys().filter((key) => key !== KEYS.cache).map((key) => [key, _dreadcast_ddk.default.storage.get(key)]));
	var importConfig = (data) => {
		for (const [key, value] of Object.entries(data)) {
			if (key === KEYS.cache) continue;
			_dreadcast_ddk.default.storage.set(key, value);
		}
	};
	var LIST_URL = "https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/data/scripts.json";
	var FETCH_TIMEOUT = 8e3;
	var isValidList = (value) => Array.isArray(value) && value.length > 0 && value.every((entry) => {
		if (typeof entry !== "object" || entry === null) return false;
		const script = entry;
		return typeof script.id === "string" && script.id !== "" && typeof script.url === "string" && script.url !== "" && Array.isArray(script.section) && Array.isArray(script.category);
	});
	var readCache = () => {
		const cache = _dreadcast_ddk.default.storage.get(KEYS.cache);
		if (typeof cache !== "object" || cache === null || !Number.isFinite(cache.ts) || !isValidList(cache.scripts)) return;
		return cache;
	};
	var writeCache = (scripts) => {
		const cache = {
			ts: Date.now(),
			scripts
		};
		_dreadcast_ddk.default.storage.set(KEYS.cache, cache);
		return cache;
	};
	var fetchList = async () => {
		const list = await _dreadcast_ddk.default.net.json(LIST_URL, FETCH_TIMEOUT);
		if (!isValidList(list)) throw new Error("la liste distante est vide ou malformee");
		return list;
	};
	var resolveList = async () => {
		const cache = readCache();
		if (cache !== void 0 && Date.now() - cache.ts < 36e5) {
			console.info("DCSM - Liste des scripts lue depuis le cache.");
			return {
				scripts: cache.scripts,
				source: "cache",
				ts: cache.ts
			};
		}
		try {
			const scripts = await fetchList();
			console.info("DCSM - Liste des scripts mise a jour depuis la source distante.");
			return {
				scripts,
				source: "remote",
				ts: writeCache(scripts).ts
			};
		} catch (error) {
			if (cache !== void 0) {
				console.warn(`DCSM - Mise a jour impossible, la liste en cache est conservee : ${String(error)}`);
				return {
					scripts: cache.scripts,
					source: "cache-stale",
					ts: cache.ts
				};
			}
			if (!isValidList(FALLBACK_LIST)) throw new Error("ni cache, ni liste distante, ni liste embarquee utilisable");
			console.error(`DCSM - Chargement impossible, la liste embarquee est utilisee : ${String(error)}`);
			return {
				scripts: FALLBACK_LIST,
				source: "embedded",
				ts: writeCache(FALLBACK_LIST).ts
			};
		}
	};
	var loadScript = async (script) => {
		const code = await _dreadcast_ddk.default.net.text(script.url);
		_dreadcast_ddk.default.scripts.setCurrent(script.id);
		try {
			_dreadcast_ddk.default.net.run(code, script.url);
		} finally {
			_dreadcast_ddk.default.scripts.setCurrent(void 0);
		}
		const definition = _dreadcast_ddk.default.scripts.take(script.id);
		if (definition) await _dreadcast_ddk.default.scripts.run(definition);
	};
	var selectScripts = ({ scripts, enabled, devMode }) => {
		const context = _dreadcast_ddk.default.context.getContext();
		return scripts.filter((script) => script.section.includes(context)).filter((script) => devMode || !script.experimental).filter((script) => enabled[script.id] === true);
	};
	var loadAll = async (options) => {
		await Promise.all(selectScripts(options).map(async (script) => {
			try {
				await loadScript(script);
				console.info(`DCSM - Le script '${script.name}' a ete charge.`);
			} catch (error) {
				console.error(`DCSM - Erreur au chargement du script '${script.name}' : ${String(error)}`);
			}
		}));
	};
	var { h: h$3 } = _dreadcast_ddk.default.dom;
	var openIntro = () => {
		_dreadcast_ddk.default.ui.popUp("dcsm_intro", "Bienvenue sur le Dreadcast Script Manager !", h$3("div", { style: { color: "white" } }, h$3("h3", null, "Merci d'avoir installé le Dreadcast Script Manager (DCSM)."), h$3("br"), h$3("p", null, "Cet utilitaire va vous permettre de gérer vos scripts directement en jeu. Pensez à désactiver ou désinstaller, dans votre Greasemonkey/Tampermonkey (ou équivalent), les scripts que vous activerez dans le DCSM, pour éviter les doublons."), h$3("br"), h$3("p", null, "La suite se passe dans Paramètres > Scripts & Skins."), h$3("br"), h$3("p", null, "Vous pourrez obtenir des réponses à vos questions sur le ", h$3("a", {
			href: "https://github.com/Isilin/dreadcast-scripts/wiki",
			target: "_blank"
		}, "wiki"), ", sur le forum, ou en me contactant directement par Com' HRP (", h$3("em", null, "JD Pelagia"), ")."), h$3("br"), h$3("p", null, "Bon jeu ! Vous ne verrez plus cette fenêtre d'information par la suite.")));
	};
	var { h: h$2 } = _dreadcast_ddk.default.dom;
	var hasSettings = (id) => {
		const definition = _dreadcast_ddk.default.scripts.get(id);
		return definition !== void 0 && (definition.settings?.length ?? 0) > 0;
	};
	var field = (setting, value, onChange) => {
		const id = `dcsm_setting_${setting.key}`;
		switch (setting.type) {
			case "boolean": return _dreadcast_ddk.default.ui.checkbox(id, value === true, onChange);
			case "number": return h$2("input", {
				id,
				type: "number",
				value: String(value),
				...setting.min === void 0 ? {} : { min: String(setting.min) },
				...setting.max === void 0 ? {} : { max: String(setting.max) },
				...setting.step === void 0 ? {} : { step: String(setting.step) },
				style: { color: "white" },
				on: { input: (event) => onChange(Number(event.target.value)) }
			});
			case "color": return _dreadcast_ddk.default.ui.colorPicker(id, String(value), onChange);
			case "select": return h$2("select", {
				id,
				style: { color: "white" },
				on: { change: (event) => onChange(event.target.value) }
			}, setting.options.map((option) => h$2("option", {
				value: option.value,
				...option.value === value ? { selected: true } : {}
			}, option.label)));
			case "text": return h$2("input", {
				id,
				type: "text",
				value: String(value),
				...setting.placeholder === void 0 ? {} : { placeholder: setting.placeholder },
				style: { color: "white" },
				on: { input: (event) => onChange(event.target.value) }
			});
		}
	};
	var row = (setting, draft) => h$2("div", { style: {
		display: "flex",
		gap: "1rem",
		alignItems: "center",
		marginBottom: "0.75rem"
	} }, h$2("label", {
		for: `dcsm_setting_${setting.key}`,
		style: { flex: "1" }
	}, setting.label), field(setting, draft[setting.key], (value) => {
		draft[setting.key] = value;
	}), setting.help === void 0 ? null : h$2("small", {
		class: "couleur5",
		style: { flex: "1" }
	}, setting.help));
	var openSettings = (script, definition) => {
		const draft = { ..._dreadcast_ddk.default.scripts.readSettings(definition) };
		const settings = definition.settings ?? [];
		_dreadcast_ddk.default.ui.popUp(`dcsm_settings_${script.id}`, `Réglages : ${script.name}`, h$2("div", { style: {
			color: "white",
			minWidth: "420px"
		} }, settings.map((setting) => row(setting, draft)), _dreadcast_ddk.default.ui.textButton(`dcsm_settings_${script.id}_save`, "Sauvegarder", () => {
			_dreadcast_ddk.default.scripts.writeSettings(script.id, draft);
			engine.closeDataBox(`dcsm_settings_${script.id}`);
		}), h$2("p", null, h$2("em", { class: "couleur5" }, "Les réglages sont appliqués au prochain chargement de la page."))));
	};
	var { h: h$1 } = _dreadcast_ddk.default.dom;
	var BORDER = "1px solid white";
	var cell = (content, style = {}) => h$1("td", { style: Object.assign({ padding: "5px 5px 0 0" }, style) }, content);
	var scriptRows = (script, index, draft) => {
		const definition = _dreadcast_ddk.default.scripts.get(script.id);
		const commands = h$1("tr", { style: {
			borderTop: BORDER,
			borderLeft: BORDER,
			borderRight: BORDER
		} }, h$1("td", {
			rowspan: "2",
			style: { padding: "5px 0 0 5px" }
		}, String(index)), script.icon === "" ? h$1("td", {
			class: "short",
			rowspan: "2",
			style: { width: "58px" }
		}) : h$1("td", {
			rowspan: "2",
			style: { padding: "5px" }
		}, h$1("img", {
			src: script.icon,
			width: "48",
			height: "48"
		})), h$1("td", { style: {
			padding: "5px 0",
			minWidth: "120px",
			textAlign: "left"
		} }, script.experimental ? h$1("span", { style: { color: "red" } }, "[DEV]") : null, script.experimental ? " " : null, script.name), h$1("td", { style: {
			padding: "5px 0",
			minWidth: "120px",
			textAlign: "left"
		} }, h$1("small", null, script.authors)), h$1("td", { style: {
			padding: "5px 0",
			display: "flex",
			justifyContent: "center"
		} }, _dreadcast_ddk.default.ui.tooltip("Activer/Désactiver le script ne perdra pas sa configuration.", _dreadcast_ddk.default.ui.checkbox(`${script.id}_check`, draft[script.id] === true, (checked) => {
			draft[script.id] = checked;
		}))), cell(definition !== void 0 && hasSettings(script.id) ? _dreadcast_ddk.default.ui.tooltip("Réglages", _dreadcast_ddk.default.ui.button(`${script.id}_setting`, "<i class=\"fas fa-cog\"></i>", () => openSettings(script, definition))) : null), cell(script.doc === "" ? null : _dreadcast_ddk.default.ui.tooltip("Documentation", _dreadcast_ddk.default.ui.button(`${script.id}_doc`, "<i class=\"fas fa-book\"></i>", () => window.open(script.doc, "_blank")))), cell(script.rp === "" ? null : _dreadcast_ddk.default.ui.tooltip("Topic RP", _dreadcast_ddk.default.ui.button(`${script.id}_rp`, "<div class=\"gridCenter\">RP</div>", () => window.open(script.rp, "_blank")))), cell(script.contact === "" ? null : _dreadcast_ddk.default.ui.tooltip("Contact", _dreadcast_ddk.default.ui.button(`${script.id}_contact`, "<i class=\"fas fa-envelope\"></i>", () => nav.getMessagerie().newMessage(script.contact)))));
		const description = h$1("tr", { style: {
			borderBottom: BORDER,
			borderLeft: BORDER,
			borderRight: BORDER
		} }, h$1("td", {
			colspan: "7",
			style: {
				padding: "0 5px 5px 5px",
				textAlign: "left"
			}
		}, h$1("small", null, h$1("em", { class: "couleur5" }, script.description))));
		return _dreadcast_ddk.default.dom.frag(commands, description);
	};
	var listStatus = (source, ts) => {
		const date = new Date(ts).toLocaleString("fr-FR", {
			dateStyle: "short",
			timeStyle: "short"
		});
		const messages = {
			remote: `Liste à jour (${date}).`,
			cache: `Liste en cache (${date}).`,
			"cache-stale": `⚠ Source injoignable : liste en cache du ${date}.`,
			embedded: "⚠ Source injoignable : liste de secours embarquée, potentiellement incomplète."
		};
		const degraded = source === "cache-stale" || source === "embedded";
		return _dreadcast_ddk.default.dom.h("p", { style: { marginBottom: "1rem" } }, _dreadcast_ddk.default.dom.h("small", null, _dreadcast_ddk.default.dom.h("em", degraded ? { style: { color: "red" } } : { class: "couleur5" }, messages[source])));
	};
	var { h } = _dreadcast_ddk.default.dom;
	var MODAL_ID = "scripts_modal";
	var GAME_URL = "https://www.dreadcast.net/Main";
	var SECTIONS = [
		{
			id: "all",
			label: "Tous"
		},
		{
			id: "game",
			label: "Jeu"
		},
		{
			id: "forum",
			label: "Forum"
		},
		{
			id: "edc",
			label: "EDC"
		}
	];
	var CATEGORIES = [
		{
			id: "all",
			label: "Tous"
		},
		{
			id: "mailing",
			label: "Messagerie"
		},
		{
			id: "chat",
			label: "Chat"
		},
		{
			id: "silhouette",
			label: "Silhouette"
		},
		{
			id: "ui",
			label: "UI"
		},
		{
			id: "mech",
			label: "Mécaniques"
		},
		{
			id: "fix",
			label: "Correctifs"
		},
		{
			id: "misc",
			label: "Autres"
		}
	];
	var radioGroup = (name, entries) => h("div", { style: {
		display: "flex",
		gap: "1rem",
		marginBottom: "1rem"
	} }, h("legend", { style: {
		marginRight: "1rem",
		minWidth: "60px"
	} }, "Filtrer :"), h("div", { style: {
		display: "flex",
		gap: "5%",
		flexWrap: "wrap",
		width: "100%"
	} }, entries.map((entry, index) => h("div", null, h("input", {
		type: "radio",
		id: `${entry.id}_${name}`,
		name,
		value: entry.id,
		...index === 0 ? { checked: true } : {}
	}), h("label", { for: `${entry.id}_${name}` }, entry.label)))));
	var download = (data) => {
		const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
		const anchor = h("a", {
			href: url,
			download: "dcsm_config.json",
			style: { display: "none" }
		});
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	};
	var upload = (onLoaded) => {
		const input = h("input", {
			type: "file",
			accept: "application/json",
			style: { display: "none" },
			on: { change: (event) => {
				const file = event.target.files?.[0];
				if (!file) return;
				const reader = new FileReader();
				reader.onload = () => {
					const raw = reader.result;
					if (typeof raw !== "string") return;
					try {
						onLoaded(JSON.parse(raw));
					} catch (error) {
						console.error(`DCSM - Fichier de configuration illisible : ${String(error)}`);
					}
				};
				reader.readAsText(file);
			} }
		});
		document.body.appendChild(input);
		input.click();
		input.remove();
	};
	var openManager = (options) => {
		const draft = structuredClone(options.state);
		const tbody = h("tbody");
		const filters = {
			section: "all",
			category: "all",
			search: ""
		};
		const renderRows = () => {
			tbody.replaceChildren();
			options.scripts.filter((script) => draft.devMode || !script.experimental).filter((script) => filters.section === "all" || script.section.includes(filters.section)).filter((script) => filters.category === "all" || script.category.includes(filters.category)).filter((script) => script.name.toLowerCase().includes(filters.search) || script.description.toLowerCase().includes(filters.search)).forEach((script, index) => {
				tbody.appendChild(scriptRows(script, index, draft.enabled));
			});
		};
		const devModeSwitch = h("div", { style: {
			display: "flex",
			justifyContent: "flex-start",
			gap: "1rem",
			marginBottom: "1rem"
		} }, h("p", null, "Mode développeur"), _dreadcast_ddk.default.ui.tooltip("Attention, ces scripts sont encore en développement !", _dreadcast_ddk.default.ui.checkbox("developper_mode_check", draft.devMode, (checked) => {
			draft.devMode = checked;
			renderRows();
		})));
		const allSwitch = h("div", { style: {
			display: "flex",
			gap: "1rem",
			marginBottom: "1rem"
		} }, h("p", null, "Tout désactiver"), _dreadcast_ddk.default.ui.checkbox("scripts_all_check", draft.allDisabled, (checked) => {
			draft.allDisabled = checked;
		}));
		const search = h("input", {
			id: "search_script",
			name: "search_script",
			type: "text",
			size: "50",
			style: { color: "white" }
		});
		const table = h("div", { style: {
			overflowY: "scroll",
			overflowX: "hidden",
			maxHeight: "350px"
		} }, h("table", { style: {
			borderCollapse: "collapse",
			width: "100%",
			border: "1px solid white",
			padding: "5px",
			fontSize: "15px",
			textAlign: "center"
		} }, h("thead", null, h("th", {
			scope: "col",
			style: { padding: "5px 0 5px 5px" }
		}, "#"), h("th", {
			class: "short",
			style: { width: "58px" }
		}), h("th", {
			scope: "col",
			style: { padding: "5px 0" }
		}, "Nom"), h("th", {
			scope: "col",
			style: { padding: "5px 0" }
		}, "Auteurs"), h("th", {
			scope: "col",
			style: { padding: "5px 0" }
		}, "Actif"), h("th", {
			class: "short",
			style: { width: "40px" }
		}), h("th", {
			class: "short",
			style: { width: "40px" }
		}), h("th", {
			class: "short",
			style: { width: "40px" }
		}), h("th", {
			class: "short",
			style: { width: "40px" }
		})), tbody));
		const configButtons = h("div", { style: {
			display: "flex",
			justifyContent: "end",
			gap: "1rem",
			marginBottom: "1rem"
		} }, _dreadcast_ddk.default.ui.textButton("config_reset", "<i class=\"fas fa-undo\"></i> Réinitialiser", () => {
			reset();
			location.replace(GAME_URL);
		}), _dreadcast_ddk.default.ui.textButton("config_import", "<i class=\"fas fa-upload\"></i> Importer la configuration", () => {
			upload((data) => {
				reset();
				importConfig(data);
				location.replace(GAME_URL);
			});
		}), _dreadcast_ddk.default.ui.textButton("config_export", "<i class=\"fas fa-download\"></i> Exporter la configuration", () => download(exportConfig())));
		const content = h("div", { style: { color: "white" } }, listStatus(options.source, options.ts), devModeSwitch, h("div", { style: {
			display: "flex",
			justifyContent: "space-between"
		} }, allSwitch, h("div", { style: {
			display: "flex",
			gap: "1rem",
			marginBottom: "1rem"
		} }, h("label", { for: "search_script" }, "Recherche"), search)), radioGroup("section", SECTIONS), radioGroup("category", CATEGORIES), table, _dreadcast_ddk.default.ui.textButton("scripts_refresh", "Sauvegarder", () => {
			save(draft);
			location.replace(GAME_URL);
		}), h("p", null, h("em", { class: "couleur5" }, "⚠ Sauvegarder votre configuration va rafraîchir la page.", h("br"), "Pensez à sauvegarder votre travail en cours avant.")), configButtons);
		_dreadcast_ddk.default.dom.on(content, "change", (event) => {
			const target = event.target;
			if (!(target instanceof HTMLInputElement)) return;
			if (target.name === "section") filters.section = target.value;
			else if (target.name === "category") filters.category = target.value;
			else return;
			renderRows();
		});
		_dreadcast_ddk.default.dom.on(content, "input", (event) => {
			const target = event.target;
			if (!(target instanceof HTMLInputElement) || target.name !== "search_script") return;
			filters.search = target.value.toLowerCase();
			renderRows();
		});
		renderRows();
		_dreadcast_ddk.default.ui.popUp(MODAL_ID, "Scripts & Skins", content);
	};
	var installMenu = (options) => {
		_dreadcast_ddk.default.ui.addSubMenuTo("Paramètres ▾", _dreadcast_ddk.default.ui.subMenu("Scripts & Skins", () => openManager(options), true), 5);
	};
	var markManagedContext = () => {
		globalThis.Util.isDSM = () => true;
	};
	var boot = async () => {
		markManagedContext();
		const managerState = load();
		if (_dreadcast_ddk.default.context.isGame() && !managerState.introDisabled) {
			markIntroSeen();
			openIntro();
		}
		const { scripts, source, ts } = await resolveList();
		managerState.enabled = synchronize(managerState.enabled, scripts, source === "remote");
		if (_dreadcast_ddk.default.context.isGame()) installMenu({
			scripts,
			state: managerState,
			source,
			ts
		});
		if (managerState.allDisabled) return;
		await loadAll({
			scripts,
			enabled: managerState.enabled,
			devMode: managerState.devMode
		});
	};
	var start = () => {
		boot().catch((error) => {
			console.error(`DCSM - Démarrage impossible : ${String(error)}`);
		});
	};
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
	else start();
})(DC);
