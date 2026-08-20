// ==UserScript==
// @name         Dreadcast Development Kit
// @namespace    Dreadcast
// @version      1.3.0
// @author       Pelagia/Isilin
// @description  Development kit to ease Dreadcast scripts integration.
// @license      https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @downloadURL  https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @updateURL    https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.meta.js
// @match        https://www.dreadcast.net/Main
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

(function() {
	"use strict";
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var context_exports = __exportAll({
		getContext: () => getContext,
		guardGame: () => guardGame,
		isEDC: () => isEDC,
		isForum: () => isForum,
		isGame: () => isGame,
		isWiki: () => isWiki
	});
	var at = (prefix) => window.location.href.startsWith(prefix);
	var isGame = () => at("https://www.dreadcast.net/Main");
	var isForum = () => at("https://www.dreadcast.net/Forum") || at("https://www.dreadcast.net/FAQ");
	var isEDC = () => at("https://www.dreadcast.net/EDC");
	var isWiki = () => at("http://wiki.dreadcast.eu/wiki");
	var getContext = () => {
		if (isGame()) return "game";
		if (isForum()) return "forum";
		if (isEDC()) return "edc";
		return "wiki";
	};
	var guardGame = (context) => {
		if (!isGame()) throw new Error(`${context}: cette fonction n'est disponible qu'en jeu.`);
	};
	var dom_exports = __exportAll({
		delegate: () => delegate,
		escapeHtml: () => escapeHtml,
		frag: () => frag,
		h: () => h,
		insertAt: () => insertAt,
		on: () => on,
		parse: () => parse,
		qs: () => qs,
		qsa: () => qsa
	});
	var appendChild = (parent, child) => {
		if (child === null || child === void 0 || child === false) return;
		if (Array.isArray(child)) {
			for (const nested of child) appendChild(parent, nested);
			return;
		}
		parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
	};
	var applyProps = (element, props) => {
		for (const [key, value] of Object.entries(props)) {
			if (value === null || value === void 0 || value === false) continue;
			if (key === "on") for (const [type, listener] of Object.entries(value)) element.addEventListener(type, listener);
			else if (key === "style" && typeof value === "object") Object.assign(element.style, value);
			else if (key === "dataset") Object.assign(element.dataset, value);
			else if (key === "html") {
				if (typeof value === "string") element.innerHTML = value;
			} else if (value === true) element.setAttribute(key, "");
			else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") element.setAttribute(key, String(value));
			else throw new Error(`h(): l'attribut '${key}' doit etre une primitive, pas un ${typeof value}.`);
		}
	};
	var h = (tag, props, ...children) => {
		const element = document.createElement(tag);
		if (props) applyProps(element, props);
		for (const child of children) appendChild(element, child);
		return element;
	};
	var frag = (...children) => {
		const fragment = document.createDocumentFragment();
		for (const child of children) appendChild(fragment, child);
		return fragment;
	};
	var parse = (html) => {
		const template = document.createElement("template");
		template.innerHTML = html.trim();
		return [...template.content.childNodes];
	};
	var qs = (selector, scope = document) => scope.querySelector(selector);
	var qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
	var on = (target, type, handler, options) => {
		target.addEventListener(type, handler, options);
		return () => target.removeEventListener(type, handler, options);
	};
	var delegate = (root, type, selector, handler, options) => on(root, type, (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const matched = target.closest(selector);
		if (matched && root.contains(matched)) handler(event, matched);
	}, options);
	var escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[character] ?? character);
	var insertAt = (parent, index, node) => {
		const count = parent.children.length;
		const position = index < 0 ? Math.max(0, count + 1 + index) : index;
		parent.insertBefore(node, parent.children[position] ?? null);
	};
	var guards_exports = __exportAll({
		guard: () => guard,
		guardArray: () => guardArray,
		guardBoolean: () => guardBoolean,
		guardColor: () => guardColor,
		guardDate: () => guardDate,
		guardError: () => guardError,
		guardFunction: () => guardFunction,
		guardJQuery: () => guardJQuery,
		guardNumber: () => guardNumber,
		guardObject: () => guardObject,
		guardRegex: () => guardRegex,
		guardString: () => guardString,
		isArray: () => isArray,
		isBoolean: () => isBoolean,
		isColor: () => isColor,
		isDate: () => isDate,
		isError: () => isError,
		isFunction: () => isFunction,
		isJQuery: () => isJQuery,
		isNumber: () => isNumber,
		isObject: () => isObject,
		isRegex: () => isRegex,
		isString: () => isString
	});
	var tag = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
	var isNullish = (value) => value === void 0 || value === null;
	var is = (expected) => (value, optional = false) => tag(value) === expected || optional && isNullish(value);
	var isArray = (value, optional = false) => Array.isArray(value) || optional && isNullish(value);
	var isString = is("string");
	var isBoolean = is("boolean");
	var isNumber = is("number");
	var isFunction = (value, optional = false) => typeof value === "function" || optional && isNullish(value);
	var isDate = is("date");
	var isRegex = is("regexp");
	var isObject = is("object");
	var isError = (value, optional = false) => value instanceof Error || optional && isNullish(value);
	var NAMED_COLORS = [
		"rouge",
		"bleu",
		"vert",
		"jaune"
	];
	var HEX_COLOR = /^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
	var isColor = (value, optional = false) => {
		if (optional && isNullish(value)) return true;
		if (typeof value !== "string") return false;
		return NAMED_COLORS.includes(value) || HEX_COLOR.test(value);
	};
	var isJQuery = (value, optional = false) => {
		if (optional && isNullish(value)) return true;
		return typeof $ !== "undefined" && value instanceof $;
	};
	var guard = (condition, message) => {
		if (!condition) throw new Error(message);
	};
	var guardWith = (predicate, expected) => (context, name, value, optional = false) => guard(predicate(value, optional), `${context}: le parametre ${optional ? "optionnel " : ""}'${name}' doit etre ${expected}.`);
	var guardArray = guardWith(isArray, "un tableau");
	var guardString = guardWith(isString, "une chaine");
	var guardBoolean = guardWith(isBoolean, "un booleen");
	var guardNumber = guardWith(isNumber, "un nombre");
	var guardFunction = guardWith(isFunction, "une fonction");
	var guardDate = guardWith(isDate, "une date");
	var guardError = guardWith(isError, "une erreur");
	var guardRegex = guardWith(isRegex, "une expression reguliere");
	var guardObject = guardWith(isObject, "un objet");
	var guardColor = guardWith(isColor, "une couleur");
	var guardJQuery = guardWith(isJQuery, "un element jQuery");
	var chat_exports = __exportAll({
		addCommand: () => addCommand$1,
		decorate: () => decorate,
		install: () => install,
		onAfterSend: () => onAfterSend,
		onSend: () => onSend,
		sendMessage: () => sendMessage
	});
	var CHAT_INPUT = "#chatForm .text_chat";
	var CHAT_SUBMIT = "#chatForm .text_valider";
	var readInput = () => qs(CHAT_INPUT)?.value ?? "";
	var install = () => {
		if (!isGame()) return;
		if (typeof MenuChat === "undefined") return;
		if (MenuChat.prototype.originalSend !== void 0) return;
		const original = MenuChat.prototype.send;
		const sendCallbacks = [];
		const afterSendCallbacks = [];
		MenuChat.prototype.originalSend = original;
		MenuChat.prototype.sendCallbacks = sendCallbacks;
		MenuChat.prototype.afterSendCallbacks = afterSendCallbacks;
		MenuChat.prototype.send = function send() {
			const message = readInput();
			const next = () => true;
			const abort = () => false;
			if (!sendCallbacks.every((callback) => callback(message, next, abort))) return;
			original.call(this);
			for (const callback of afterSendCallbacks) if (!callback(message)) break;
		};
		MenuChat.prototype.onSend = (callback) => {
			sendCallbacks.push(callback);
		};
		MenuChat.prototype.onAfterSend = (callback) => {
			afterSendCallbacks.push(callback);
		};
	};
	var onSend = (callback) => {
		guardGame("chat.onSend");
		nav.getChat().onSend(callback);
	};
	var onAfterSend = (callback) => {
		guardGame("chat.onAfterSend");
		nav.getChat().onAfterSend(callback);
	};
	var sendMessage = (message) => {
		guardGame("chat.sendMessage");
		guardString("chat.sendMessage", "message", message);
		const input = qs(CHAT_INPUT);
		if (input) input.value = message;
		qs(CHAT_SUBMIT)?.click();
	};
	var decorate = (message, decoration) => {
		guardString("chat.decorate", "message", message);
		if (decoration.color !== void 0 && decoration.color !== "") guardColor("chat.decorate", "decoration.color", decoration.color);
		let prefix = "";
		let suffix = "";
		if (decoration.bold) {
			prefix += "[b]";
			suffix = `[/b]${suffix}`;
		}
		if (decoration.italic) {
			prefix += "[i]";
			suffix = `[/i]${suffix}`;
		}
		if (decoration.color !== void 0 && decoration.color !== "") {
			prefix += `[c=${decoration.color}]`;
			suffix = `[/c]${suffix}`;
		}
		return prefix + message + suffix;
	};
	var RESERVED = [
		"me",
		"y",
		"ye",
		"yme",
		"w",
		"we",
		"wme",
		"roll",
		""
	];
	var addCommand$1 = (label, handler) => {
		guardGame("chat.addCommand");
		guardString("chat.addCommand", "label", label);
		if (RESERVED.includes(label)) throw new Error(`chat.addCommand: '${label}' est reservee par le jeu.`);
		onSend((message, next, abort) => {
			if (message[0] !== "/") return next();
			const used = message.split(" ")[0]?.slice(1) ?? "";
			if (used !== label || RESERVED.includes(used)) return next();
			return handler(used, message.slice(used.length + 1).trim()) ? next() : abort();
		});
	};
	var deck_exports = __exportAll({
		addCommand: () => addCommand,
		hasSkill: () => hasSkill,
		skillLevel: () => skillLevel,
		write: () => write
	});
	var skillLevel = () => {
		guardGame("deck.skillLevel");
		return Number.parseInt(qs(".stat_6_entier")?.textContent ?? "0", 10);
	};
	var hasSkill = (required) => {
		guardNumber("deck.hasSkill", "required", required);
		return required <= skillLevel();
	};
	var write = (node, deckId) => {
		guardGame("deck.write");
		guardString("deck.write", "deckId", deckId);
		const zone = qs(`#${deckId} .zone_ecrit`);
		if (!zone) return;
		const last = zone.lastElementChild;
		if (last?.className === "ligne_resultat_fixed") {
			last.appendChild(node);
			return;
		}
		zone.appendChild(h("div", { class: "ligne_resultat_fixed" }, node));
	};
	var addCommand = (requiredSkill, command, run, showHelp, helpLine) => {
		guardGame("deck.addCommand");
		guardNumber("deck.addCommand", "requiredSkill", requiredSkill);
		guardString("deck.addCommand", "command", command);
		guardString("deck.addCommand", "helpLine", helpLine);
		$(document).ajaxComplete((_event, _xhr, settings) => {
			if (!/Command/.test(String(settings.url))) return;
			const deckId = `db_deck_${/[0-9]*$/.exec(String(settings.data))?.[0] ?? ""}`;
			const line = qsa(`#${deckId} .ligne_ecrite_fixed input`).at(-1)?.value ?? "";
			if (new RegExp(`^${command}`, "i").test(line)) {
				if (hasSkill(requiredSkill)) run(line, deckId);
				else write(h("span", null, "Votre niveau en informatique est trop faible pour reussir cette commande"), deckId);
				return;
			}
			if (new RegExp(`^help ${command}`, "i").test(line)) {
				showHelp(deckId);
				return;
			}
			if (/^help$/i.test(line)) write(h("span", { html: `<br />${helpLine}` }), deckId);
		});
	};
	var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
	var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
	var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
	var _GM_listValues = (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
	var _GM_setClipboard = (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
	var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
	var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
	var net_exports = __exportAll({
		DEFAULT_TIMEOUT: () => DEFAULT_TIMEOUT,
		json: () => json,
		loadScript: () => loadScript,
		loadSpreadsheet: () => loadSpreadsheet,
		request: () => request,
		run: () => run,
		text: () => text
	});
	var DEFAULT_TIMEOUT = 3e4;
	var request = (options) => new Promise((resolve, reject) => {
		_GM_xmlhttpRequest({
			timeout: DEFAULT_TIMEOUT,
			...options,
			onload: (event) => resolve(event.response),
			onerror: () => reject(new Error(`echec de la requete vers ${options.url}`)),
			ontimeout: () => reject(new Error(`delai depasse pour la requete vers ${options.url}`)),
			onabort: () => reject(new Error(`requete vers ${options.url} annulee`))
		});
	});
	var text = (url, timeout) => request({
		method: "GET",
		url,
		...timeout === void 0 ? {} : { timeout }
	});
	var json = (url, timeout) => request({
		method: "GET",
		url,
		responseType: "json",
		headers: { "Content-Type": "application/json" },
		...timeout === void 0 ? {} : { timeout }
	});
	var capabilities = () => {
		const scope = globalThis;
		return {
			DC: scope["DC"],
			Util: scope["Util"],
			GM_getValue: _GM_getValue,
			GM_setValue: _GM_setValue,
			GM_deleteValue: _GM_deleteValue,
			GM_listValues: _GM_listValues,
			GM_addStyle: _GM_addStyle,
			GM_setClipboard: _GM_setClipboard,
			GM_xmlhttpRequest: _GM_xmlhttpRequest
		};
	};
	var run = (code, sourceUrl) => {
		const annotated = sourceUrl === void 0 ? code : `${code}\n//# sourceURL=${sourceUrl}`;
		const scope = capabilities();
		new Function(...Object.keys(scope), annotated)(...Object.values(scope));
	};
	var loadScript = async (url, onAfterLoad) => {
		run(await text(url), url);
		onAfterLoad?.();
	};
	var loadSpreadsheet = async (sheetId, tabName, range, apiKey) => {
		return (await json(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}!${range}?key=${apiKey}`)).values ?? [];
	};
	var storage_exports = __exportAll({
		get: () => get,
		init: () => init,
		keys: () => keys,
		namespace: () => namespace,
		remove: () => remove,
		set: () => set
	});
	var get = (key) => _GM_getValue(key);
	var set = (key, value) => {
		_GM_setValue(key, value);
	};
	var remove = (key) => {
		_GM_deleteValue(key);
	};
	var keys = () => _GM_listValues();
	var init = (key, defaultValue) => {
		const current = _GM_getValue(key);
		if (current === void 0) {
			_GM_setValue(key, defaultValue);
			return defaultValue;
		}
		return current;
	};
	var namespace = (id) => {
		const prefix = `dcs:${id}:`;
		return {
			get: (key) => get(prefix + key),
			set: (key, value) => set(prefix + key, value),
			remove: (key) => remove(prefix + key),
			keys: () => keys().filter((key) => key.startsWith(prefix)).map((key) => key.slice(prefix.length)),
			init: (key, defaultValue) => init(prefix + key, defaultValue)
		};
	};
	var style_exports = __exportAll({ apply: () => apply });
	var applied = new Set();
	var apply = (css, id) => {
		if (id !== void 0) {
			if (applied.has(id)) return;
			applied.add(id);
		}
		const node = inject(css);
		if (node && id !== void 0) node.dataset["dcStyle"] = id;
	};
	var inject = (css) => {
		if (typeof _GM_addStyle === "function") return _GM_addStyle(css);
		const node = document.createElement("style");
		node.appendChild(document.createTextNode(css));
		(document.head ?? document.documentElement).appendChild(node);
		return node;
	};
	var separator = () => h("li", { class: "separator" });
	var textButton = (id, label, onClick) => h("div", {
		id,
		class: "btnTxt",
		html: label,
		on: { click: onClick }
	});
	var button = (id, label, onClick) => h("div", {
		id,
		class: "btn add link infoAide",
		on: { click: onClick }
	}, h("div", {
		class: "gridCenter",
		html: label
	}));
	var colorPicker = (id, value, onChange) => h("input", {
		id,
		type: "color",
		value,
		on: { input: (event) => onChange(event.target.value) }
	});
	var TOOLTIP_CSS = `
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgba(24, 24, 24, 0.95);
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  font-size: 1rem;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
`;
	var tooltip = (text, content) => {
		apply(TOOLTIP_CSS, "dc-tooltip");
		return h("div", { class: "tooltip" }, content, h("span", { class: "tooltiptext" }, text));
	};
	var CHECKBOX_CSS = `
.dc_ui_checkbox {
  cursor: pointer;
  width: 30px;
  height: 18px;
  background: url(../../../images/fr/design/boutons/b_0.png) 0 0 no-repeat;
}
.dc_ui_checkbox_on {
  background: url(../../../images/fr/design/boutons/b_1.png) 0 0 no-repeat;
}
`;
	var checkbox = (id, checked, onToggle) => {
		apply(CHECKBOX_CSS, "dc-checkbox");
		const node = h("div", {
			id,
			class: `dc_ui_checkbox${checked ? " dc_ui_checkbox_on" : ""}`
		});
		node.addEventListener("click", () => {
			const next = node.classList.toggle("dc_ui_checkbox_on");
			onToggle?.(next);
		});
		return node;
	};
	var topMenu = () => {
		guardGame("topMenu");
		return qs(".menus");
	};
	var addToTopMenu = (element, index = 0) => {
		const menu = topMenu();
		if (!menu) throw new Error("addToTopMenu: la barre de menus est introuvable.");
		insertAt(menu, index, element);
	};
	var menu = (label, onClick) => h("li", {
		id: label,
		class: "couleur5",
		html: label,
		on: { click: onClick }
	});
	var subMenu = (label, onClick, separatorBefore = false) => h("li", {
		class: `link couleur2${separatorBefore ? " separator" : ""}`,
		html: label,
		on: { click: onClick }
	});
	var dropMenu = (label, items) => {
		const item = h("li", {
			id: label,
			class: "parametres couleur5 right hover",
			onclick: "$(this).find('ul').slideDown();"
		}, `${label}\u25be`);
		item.appendChild(h("ul", null, items));
		return item;
	};
	var addSubMenuTo = (name, element, index = 0) => {
		guardGame("addSubMenuTo");
		const target = qsa(".menus li").find((item) => item.textContent?.includes(name) && qs("ul", item));
		if (!target) throw new Error(`addSubMenuTo: aucun menu ne contient '${name}'.`);
		const list = qs("ul", target);
		if (list) insertAt(list, index, element);
	};
	var toggleLoader = (visible) => {
		const loader = qs("#loader");
		if (loader) loader.style.display = visible ? "block" : "none";
	};
	var popUp = (id, title, content) => {
		guardGame("popUp");
		toggleLoader(true);
		engine.displayDataBox(`
    <div id="${id}" class="dataBox" onClick="engine.switchDataBox(this)" style="display: block; z-index: 5; left: 764px; top: 16px;">
      <relative>
        <div class="head" ondblclick="$('#${id}').toggleClass('reduced');">
          <div title="Fermer la fenetre (Q)" class="info1 link close transition3s" onClick="engine.closeDataBox($(this).parent().parent().parent().attr('id'));">
            <i class="fas fa-times"></i>
          </div>
          <div title="Reduire/Agrandir la fenetre" class="info1 link reduce transition3s" onClick="$('#${id}').toggleClass('reduced');">
            <span>-</span>
          </div>
          <div class="title">${escapeHtml(title)}</div>
        </div>
        <div class="dbloader"></div>
        <div class="content" style="max-width: 800px; max-height: 600px; overflow-y: auto; overflow-x: hidden;"></div>
      </relative>
    </div>`);
		const body = qs(`#${id} .content`);
		if (body) body.appendChild(frag(content));
		toggleLoader(false);
	};
	var SIDE_MENU_CSS = `
#zone_sidemenu {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0px;
  top: 80px;
  z-index: 999999;
}
.sidemenu_container {
  display: flex;
}
.sidemenu_container > .btnTxt:first-child {
  margin: 0 auto;
  min-width: 100px;
  max-width: 100px;
  font-size: 1rem;
  padding: 1%;
  display: grid;
  height: 100%;
  box-sizing: border-box;
  grid-template-columns: 10% 1fr;
  align-items: center;
  text-transform: uppercase;
  font-family: Arial !important;
  line-height: normal !important;
}
.sidemenu_container .btnTxt:hover {
  background: #0b9bcb;
  color: #fff;
}
.sidemenu_content {
  background-color: #000;
  color: #fff !important;
  box-shadow: 0 0 15px -5px inset #a2e4fc !important;
  padding: 10px;
  width: 200px;
  display: none;
}
`;
	var sideMenu = (id, label, content) => {
		apply(SIDE_MENU_CSS, "dc-sidemenu");
		let zone = qs("#zone_sidemenu");
		if (!zone) {
			zone = h("div", { id: "zone_sidemenu" });
			document.body.appendChild(zone);
		}
		const panel = h("div", {
			id: `${id}_content`,
			class: "sidemenu_content"
		}, content);
		let open = false;
		const button = textButton(`${id}_button`, `<i class="fas fa-chevron-left"></i>${escapeHtml(label)}`, () => {
			open = !open;
			button.innerHTML = `<i class="fas fa-chevron-${open ? "right" : "left"}"></i>${escapeHtml(label)}`;
			panel.style.display = open ? "block" : "none";
		});
		zone.appendChild(h("div", {
			id: `${id}_container`,
			class: "sidemenu_container"
		}, button, panel));
	};
	var ui_exports = __exportAll({
		addSubMenuTo: () => addSubMenuTo,
		addToTopMenu: () => addToTopMenu,
		button: () => button,
		checkbox: () => checkbox,
		colorPicker: () => colorPicker,
		dropMenu: () => dropMenu,
		menu: () => menu,
		popUp: () => popUp,
		separator: () => separator,
		sideMenu: () => sideMenu,
		subMenu: () => subMenu,
		textButton: () => textButton,
		tooltip: () => tooltip,
		topMenu: () => topMenu
	});
	var hasJQuery = () => typeof $ !== "undefined";
	var wrap = (node) => hasJQuery() ? $(node) : node;
	var unwrap = (value) => {
		if (value === null || value === void 0) return null;
		if (value instanceof Node) return value;
		if (typeof value === "string") return parse(value);
		if (hasJQuery() && value instanceof $) return Array.from($(value));
		return value;
	};
	var unwrapNode = (value) => {
		const child = unwrap(value);
		if (child instanceof Node) return child;
		const first = (Array.isArray(child) ? child : [child]).find((node) => node instanceof Node);
		if (!first) throw new Error("un noeud DOM etait attendu.");
		return first;
	};
	var Util = {
		guard,
		deprecate: (name, replacement) => {
			console.warn(`${name}: cette fonction est depreciee et ne devrait plus etre utilisee.` + (replacement ? ` Preferer : ${replacement}.` : ""));
		},
		isArray,
		isString,
		isBoolean,
		isNumber,
		isFunction,
		isDate,
		isError,
		isRegex,
		isObject,
		isColor,
		isJQuery,
		guardArray,
		guardString,
		guardBoolean,
		guardNumber,
		guardFunction,
		guardDate,
		guardError,
		guardRegex,
		guardObject,
		guardColor,
		guardJQuery,
		isGame,
		isForum,
		isEDC,
		isWiki,
		getContext
	};
	var LocalMemory = {
		init: (label, defaultValue) => init(label, defaultValue),
		set: (label, value) => set(label, value),
		get: (label) => get(label),
		delete: (label) => remove(label),
		list: () => keys()
	};
	var UI = {
		Separator: () => wrap(separator()),
		Menu: (label, fn) => wrap(menu(label, fn)),
		SubMenu: (label, fn, separatorBefore = false) => wrap(subMenu(label, fn, separatorBefore)),
		DropMenu: (label, submenu) => wrap(dropMenu(label, submenu.map(unwrapNode))),
		addSubMenuTo: (name, element, index = 0) => addSubMenuTo(name, unwrapNode(element), index),
		TextButton: (id, label, fn) => wrap(textButton(id, label, fn)),
		Button: (id, label, fn) => wrap(button(id, label, fn)),
		ColorPicker: (id, value, fn) => wrap(colorPicker(id, value, fn)),
		Tooltip: (text, content) => wrap(tooltip(text, unwrap(content))),
		Checkbox: (id, defaultEnable, onAfterClick) => wrap(checkbox(id, defaultEnable, onAfterClick)),
		PopUp: (id, title, content) => popUp(id, title, unwrap(content)),
		SideMenu: (id, label, content) => sideMenu(id, label, unwrap(content))
	};
	var TopMenu = {
		get: () => {
			const node = topMenu();
			return node ? wrap(node) : node;
		},
		add: (element, index = 0) => addToTopMenu(unwrapNode(element), index)
	};
	var Style = { apply };
	var Network = {
		fetch: (args) => request(args),
		loadJson: (url) => json(url),
		loadScript: (url, onAfterLoad) => loadScript(url, onAfterLoad),
		loadSpreadsheet: async (sheetId, tabName, range, apiKey, onLoad) => {
			onLoad(await loadSpreadsheet(sheetId, tabName, range, apiKey));
		}
	};
	var Chat = {
		sendMessage,
		t: (message, decoration) => decorate(message, decoration),
		addCommand: addCommand$1
	};
	var Deck = {
		checkSkill: (info) => hasSkill(info),
		write: (node, deckId) => write(unwrapNode(node), deckId),
		createCommand: addCommand
	};
	var installJQueryPlugin = () => {
		if (!hasJQuery() || typeof $.fn.insertAt === "function") return;
		$.fn.insertAt = function insertAtPlugin(index, element) {
			const parent = this[0];
			if (parent instanceof Element) {
				const count = parent.children.length;
				const position = index < 0 ? Math.max(0, count + 1 + index) : index;
				parent.insertBefore(unwrapNode(element), parent.children[position] ?? null);
			}
			return this;
		};
	};
	var pending = new Map();
	var started = new Map();
	var currentId;
	var setCurrentScript = (id) => {
		currentId = id;
	};
	var registerScript = (definition) => {
		if (typeof definition?.init !== "function") throw new Error("registerScript: 'init' est absent.");
		const declared = definition.id;
		const id = currentId ?? declared;
		if (typeof id !== "string" || id === "") throw new Error("registerScript: 'id' est absent, et aucun script du catalogue n'est en cours de chargement.");
		if (declared !== void 0 && currentId !== void 0 && declared !== currentId) console.warn(`registerScript: '${declared}' est enregistre sous '${currentId}', l'identifiant du catalogue.`);
		pending.set(id, {
			...definition,
			id
		});
	};
	var getRegistration = (id) => started.get(id) ?? pending.get(id);
	var startedScripts = () => [...started.values()];
	var takeRegistration = (id) => {
		const definition = pending.get(id);
		pending.delete(id);
		return definition;
	};
	var defaultSettings = (definition) => Object.fromEntries((definition.settings ?? []).map((setting) => [setting.key, setting.default]));
	var SETTINGS_KEY = "settings";
	var readSettings = (definition) => ({
		...defaultSettings(definition),
		...namespace(definition.id).get(SETTINGS_KEY)
	});
	var writeSettings = (id, settings) => {
		namespace(id).set(SETTINGS_KEY, settings);
	};
	var runScript = async (definition) => {
		const prefix = `[${definition.id}]`;
		started.set(definition.id, definition);
		await definition.init({
			id: definition.id,
			context: getContext(),
			storage: namespace(definition.id),
			settings: readSettings(definition),
			log: (...args) => console.info(prefix, ...args),
			warn: (...args) => console.warn(prefix, ...args),
			error: (...args) => console.error(prefix, ...args)
		});
	};
	var DC = {
		context: context_exports,
		dom: dom_exports,
		guards: guards_exports,
		net: net_exports,
		storage: storage_exports,
		style: style_exports,
		ui: ui_exports,
		game: {
			chat: chat_exports,
			deck: deck_exports
		},
		registerScript,
		scripts: {
			setCurrent: setCurrentScript,
			get: getRegistration,
			started: startedScripts,
			take: takeRegistration,
			run: runScript,
			defaults: defaultSettings,
			readSettings,
			writeSettings
		},
		LocalMemory,
		Style,
		TopMenu,
		UI,
		Network,
		Chat,
		Deck
	};
	install();
	installJQueryPlugin();
	var globalScope = globalThis;
	globalScope["DC"] = DC;
	globalScope["Util"] = Util;
})();
