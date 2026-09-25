// ==UserScript==
// @name         Silhouette+
// @namespace    Dreadcast
// @version      1.1.0
// @author       Pelagia/Isilin
// @description  Personnalise entierement la fiche RP : silhouettes et disposition des emplacements. Reunit SkinSilhouette et ShowSilhouette.
// @license      https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @downloadURL  https://update.greasyfork.org/scripts/524423/Silhouette%2B.user.js
// @updateURL    https://update.greasyfork.org/scripts/524423/Silhouette%2B.meta.js
// @match        https://www.dreadcast.net/Main
// @require      https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js?version=1942191
// @connect      sheets.googleapis.com
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
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
	var SLOTS = [
		{
			key: "head",
			selector: ".zone_case1",
			label: "Tête",
			x: 0,
			y: 1,
			stepY: 1
		},
		{
			key: "chest",
			selector: ".zone_case5",
			label: "Buste",
			x: 0,
			y: 21,
			stepY: 1
		},
		{
			key: "legs",
			selector: ".zone_case-1",
			label: "Jambes",
			x: 0,
			y: 41,
			stepY: 1
		},
		{
			key: "feet",
			selector: ".zone_case6",
			label: "Pieds",
			x: 0,
			y: 61,
			stepY: 1
		},
		{
			key: "implant",
			selector: ".zone_case-2",
			label: "Implant",
			x: 60,
			y: 1,
			stepY: 1
		},
		{
			key: "right_arm",
			selector: ".zone_case3",
			label: "Main D",
			x: 60,
			y: 21,
			stepY: 1
		},
		{
			key: "left_arm",
			selector: ".zone_case4",
			label: "Main G",
			x: 60,
			y: 41,
			stepY: 1
		},
		{
			key: "secondary",
			selector: ".zone_case2",
			label: "Secondaire",
			x: 60,
			y: 61,
			stepY: 1
		},
		{
			key: "bag1",
			selector: ".zone_case7",
			label: "Sac 1",
			x: 80,
			y: 1,
			stepY: 1
		},
		{
			key: "bag2",
			selector: ".zone_case8",
			label: "Sac 2",
			x: 80,
			y: 21,
			stepY: 1
		},
		{
			key: "bag3",
			selector: ".zone_case9",
			label: "Sac 3",
			x: 80,
			y: 41,
			stepY: 1
		},
		{
			key: "rp1",
			selector: ".zone_case10",
			label: "Case RP 1",
			x: 0,
			y: -1850,
			stepY: 50
		},
		{
			key: "rp2",
			selector: ".zone_case11",
			label: "Case RP 2",
			x: 20,
			y: -1850,
			stepY: 50
		},
		{
			key: "rp3",
			selector: ".zone_case12",
			label: "Case RP 3",
			x: 40,
			y: -1850,
			stepY: 50
		},
		{
			key: "rp4",
			selector: ".zone_case13",
			label: "Case RP 4",
			x: 60,
			y: -1850,
			stepY: 50
		},
		{
			key: "cut",
			selector: "#ciseauxInventaire",
			label: "Séparation",
			x: 80,
			y: 72,
			stepY: 1
		},
		{
			key: "delete",
			selector: "#poubelleInventaire",
			label: "Poubelle",
			x: 80,
			y: 83,
			stepY: 1
		},
		{
			key: "stats",
			selector: "#statsInventaire",
			label: "Stats",
			x: 91,
			y: 72,
			stepY: 1
		},
		{
			key: "stock",
			selector: "#stockInventaire",
			label: "Stock",
			x: 91,
			y: 83,
			stepY: 1
		}
	];
	var parseCoordinate = (value) => {
		if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
		if (typeof value !== "string" || value.trim() === "") return void 0;
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : void 0;
	};
	var readLayout = (stored) => {
		const source = typeof stored === "object" && stored !== null ? stored : {};
		return Object.fromEntries(SLOTS.map((slot) => {
			const entry = source[slot.key];
			const point = typeof entry === "object" && entry !== null ? entry : {};
			return [slot.key, {
				x: parseCoordinate(point["x"]) ?? slot.x,
				y: parseCoordinate(point["y"]) ?? slot.y
			}];
		}));
	};
	var overridesOf = (layout) => Object.fromEntries(SLOTS.flatMap((slot) => {
		const point = layout[slot.key];
		if (point === void 0 || point.x === slot.x && point.y === slot.y) return [];
		return [[slot.key, {
			x: point.x,
			y: point.y
		}]];
	}));
	var { h } = _dreadcast_ddk.default.dom;
	var WINDOW_ID = "silhouettePlus_modal";
	var RECIPIENTS = "Phylène, Izo, Pelagia";
	var REQUEST_SUBJECT = "[HRP] Silhouette";
	var requestMessage = (pseudo, id) => `[[ Bonjour,

Je souhaiterais changer ma silhouette.
Pseudo : ${pseudo}
ID : #${id}
Silhouette : <url de la silhouette>
]]`;
	var coordinate = (id, point, axis, step, onChange) => h("input", {
		id,
		type: "number",
		value: String(point[axis]),
		step: String(step),
		on: { input: (event) => {
			const value = parseCoordinate(event.target.value);
			if (value === void 0) return;
			point[axis] = value;
			onChange();
		} }
	});
	var settingsContent = ({ state, onChange, onRequest }) => h("div", { id: "silhouettePlus_content" }, h("div", { class: "sp_row" }, h("span", null, "Masquer brillance"), _dreadcast_ddk.default.ui.checkbox("silhouettePlus_shine", state.hideShine, (checked) => {
		state.hideShine = checked;
		onChange();
	})), SLOTS.map((slot) => {
		const point = state.layout[slot.key] ?? {
			x: slot.x,
			y: slot.y
		};
		state.layout[slot.key] = point;
		return h("div", { class: "sp_row" }, h("span", null, slot.label), "X", coordinate(`silhouettePlus_${slot.key}_x`, point, "x", 1, onChange), "Y", coordinate(`silhouettePlus_${slot.key}_y`, point, "y", slot.stepY, onChange));
	}), _dreadcast_ddk.default.ui.textButton("silhouettePlus_request", "Changer la silhouette", onRequest));
	var openSettingsWindow = (options) => {
		_dreadcast_ddk.default.ui.popUp(WINDOW_ID, "Silhouette+", settingsContent(options));
	};
	var imageUrl = (raw) => {
		if (typeof raw !== "string" || raw.trim() === "") return void 0;
		try {
			const url = new URL(raw.trim());
			return url.protocol === "https:" || url.protocol === "http:" ? url.href : void 0;
		} catch {
			return;
		}
	};
	var PERSO_ID = /^\d+$/;
	var parseSheet = (rows) => {
		const byId = new Map();
		const byName = new Map();
		for (const [rawId, rawName, rawUrl] of rows) {
			const url = imageUrl(rawUrl);
			if (url === void 0) continue;
			const id = typeof rawId === "string" ? rawId.trim() : "";
			if (PERSO_ID.test(id)) byId.set(id, url);
			const name = typeof rawName === "string" ? rawName.trim().toLowerCase() : "";
			if (name !== "") byName.set(name, url);
		}
		return {
			byId,
			byName
		};
	};
	var ownSilhouette = (index, self) => index.byId.get(self.id.trim()) ?? index.byName.get(self.name.trim().toLowerCase());
	var rule = (selector, url) => `${selector} { background-image: url("${url}") !important; background-position: 0 0 !important; }`;
	var silhouetteCss = (index, self) => {
		const byId = new Map(index.byId);
		const own = self === void 0 ? void 0 : ownSilhouette(index, self);
		const selfId = self?.id.trim() ?? "";
		if (own !== void 0 && PERSO_ID.test(selfId) && !byId.has(selfId)) byId.set(selfId, own);
		return [...[...byId].map(([id, url]) => rule(`#ib_persoBox_${id} .personnage_image`, url)), ...own === void 0 ? [] : [rule("#zone_inventaire .personnage_image", own)]].join("\n");
	};
	var KEYS = {
		layout: "positions",
		hideShine: "hideShine"
	};
	var LEGACY_KEYS = {
		layout: "sp_position",
		hideShine: "sp_shiny_disable"
	};
	var migrate = (storage) => {
		if (storage.get(KEYS.layout) === void 0) {
			const legacy = _dreadcast_ddk.default.storage.get(LEGACY_KEYS.layout);
			if (legacy !== void 0) storage.set(KEYS.layout, overridesOf(readLayout(legacy)));
		}
		if (storage.get(KEYS.hideShine) === void 0) {
			const legacy = _dreadcast_ddk.default.storage.get(LEGACY_KEYS.hideShine);
			if (typeof legacy === "boolean") storage.set(KEYS.hideShine, legacy);
		}
	};
	var loadState = (storage) => {
		migrate(storage);
		return {
			layout: readLayout(storage.get(KEYS.layout)),
			hideShine: storage.get(KEYS.hideShine) === true
		};
	};
	var saveState = (storage, state) => {
		storage.set(KEYS.layout, overridesOf(state.layout));
		storage.set(KEYS.hideShine, state.hideShine);
	};
	var BASE_CSS = `
.inventaire_content .personnage_image {
  top: 10% !important;
  left: 20% !important;
}

.flipmobile-card-front .inventaire {
  left: 12.5% !important;
}

#silhouettePlus_content {
  color: white;
}

#silhouettePlus_content .sp_row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

#silhouettePlus_content .sp_row > span:first-child {
  min-width: 7rem;
}

#silhouettePlus_content input {
  width: 5rem;
  color: white;
}
`;
	var SHINE = ".case_objet.linkBox::before, .case_objet.linkBox::after, .case_objet.linkBox:hover::before, .case_objet.linkBox:hover::after";
	var layoutCss = (layout, hideShine) => [...SLOTS.map((slot) => {
		const point = layout[slot.key] ?? slot;
		return `${slot.selector} { left: ${point.x}% !important; top: ${point.y}% !important; }`;
	}), ...hideShine ? [`${SHINE} { display: none !important; }`] : []].join("\n");
	var layoutSheet = (id) => {
		const node = document.createElement("style");
		node.dataset["dcStyle"] = id;
		(document.head ?? document.documentElement).appendChild(node);
		return (css) => {
			node.textContent = css;
		};
	};
	var ID = "silhouettePlus";
	var SHEET = {
		id: "1Ygt9q6WEU8cR_86GptLpHZ6qLHATfX42R0qcPKaqvqo",
		tab: "BDD",
		range: "A:C",
		apiKey: "AIzaSyCSnNrK0PQMz20JVuUmuO9rl9iSWRHrPm4"
	};
	var runtime;
	var self = () => ({
		id: String(engine.getIdPersonnage()),
		name: document.querySelector("#txt_pseudo")?.textContent ?? ""
	});
	var openWindow = () => {
		if (runtime === void 0) return;
		const { storage, state, render } = runtime;
		openSettingsWindow({
			state,
			onChange: () => {
				saveState(storage, state);
				render(layoutCss(state.layout, state.hideShine));
			},
			onRequest: () => {
				const { id, name } = self();
				nav.getMessagerie().newMessage(RECIPIENTS, REQUEST_SUBJECT, requestMessage(name, id));
			}
		});
	};
	var needsMenuEntry = () => Util.isDSM?.() !== true || typeof _dreadcast_ddk.default.scripts.openSettings !== "function";
	var loadSilhouettes = async (context) => {
		try {
			const index = parseSheet(await _dreadcast_ddk.default.net.loadSpreadsheet(SHEET.id, SHEET.tab, SHEET.range, SHEET.apiKey));
			_dreadcast_ddk.default.style.apply(silhouetteCss(index, self()), `${ID}-silhouettes`);
			context.log(`${index.byId.size} silhouettes chargees.`);
		} catch (error) {
			context.error("silhouettes indisponibles :", error);
		}
	};
	var definition = {
		id: ID,
		async init(context) {
			if (context.context !== "game") return;
			const state = loadState(context.storage);
			const render = layoutSheet(`${ID}-layout`);
			_dreadcast_ddk.default.style.apply(BASE_CSS, `${ID}-base`);
			render(layoutCss(state.layout, state.hideShine));
			runtime = {
				storage: context.storage,
				state,
				render
			};
			if (needsMenuEntry()) try {
				_dreadcast_ddk.default.ui.addSubMenuTo("Paramètres", _dreadcast_ddk.default.ui.subMenu("Silhouette+", openWindow), 6);
			} catch (error) {
				context.warn("entree de menu impossible :", error);
			}
			await loadSilhouettes(context);
		},
		openSettings: openWindow
	};
	_dreadcast_ddk.default.registerScript(definition);
	if (Util.isDSM?.() !== true) {
		const start = () => {
			const registration = _dreadcast_ddk.default.scripts.take(ID);
			if (registration === void 0) return;
			_dreadcast_ddk.default.scripts.run(registration).catch((error) => {
				console.error("Silhouette+ - demarrage impossible :", error);
			});
		};
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
		else start();
	}
})(DC);
