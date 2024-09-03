// ==UserScript==
// @name Rosimauve Theme
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description
// @author Isilin
// @grant GM_addStyle
// @run-at document-start
// @include https://www.dreadcast.net/Main
// ==/UserScript==

(function () {
  let css = `
    #fondImmeuble1 {
        background-image: url(https://i.imgur.com/qlgxtmB.png) !important;
    }
  
    #fondImmeuble2 {
        background-image: url(https://i.imgur.com/qlgxtmB.png) !important;
    }
  
    #fondImmeuble3 {
        background-image: url(https://i.imgur.com/qlgxtmB.png) !important;
    }
  
    .case_objet.linkBox::before, .case_objet.linkBox::after {
        display: none !important;
    }
  
    #zone_chat {
        position: relative !important;
        color: #fff !important;
        grid-column: 1 !important;
        padding: 0 4% !important;
        box-sizing: border-box !important;
    }
  
    #zone_chat_bg{
        background: url('https://i.imgur.com/558doxy.png') !important;
        background-size: cover !important;
        box-shadow: 0 0 15px -5px inset #a2e4fc !important;
        display: grid !important;
        grid-template-rows: auto 86% auto !important;
        padding: 10px 10px 0 10px !important;
        box-sizing: border-box !important;
    }
  
    .hologram img {
        display: none !important;
    }
  
    .hologram {
        background: url('https://i.imgur.com/xVNLUbB.png') !important;
        background-repeat: no-repeat !important;
        padding: 10px 10px 0 10px !important;
        background-size: cover !important;
        box-sizing: border-box !important;
        margin-left: 4%;
        margin-right: 4%;
    }
  
    #zone_chat .icon{
        background: url('https://i.imgur.com/zzwUKKp.png') !important;
    }
  
    #zone_droite>.grid>.grid.top {
        grid-template-columns: 48% 50% !important;
        grid-gap: 2% !important;
        position: relative !important;
        background: url('https://i.imgur.com/e2rnJqI.png') no-repeat !important;
        background-size: contain !important;
    }
    .couleur5{
        color: #8a8a8a !important;
    }
  
    .dataBox.focused.ui-draggable {
      background: rgba(24,24,24,0.95) !important;
      box-shadow: inset 0 0 25px 10px rgba(24,24,24,0.95);
    }
  
    .head.ui-draggable-handle {
      background: rgba(24,24,24,0.95) !important;
      box-shadow: inset 0 0 25px 10px rgba(24,24,24,0.95);
    }
  
    .dataBox .message .contenu {
        background: rgba(2,2,2,.5) !important;
        font-size: 12px !important;
        color: #fff !important;
        margin-bottom: 2px !important;
        overflow: auto !important;
    }
  
    #zone_gauche {
        z-index: 300002 !important;
        text-transform: uppercase !important;
        font-size: .7rem !important;
        font-family: Arial !important;
        background: url('https://i.imgur.com/7HIiH9a.png') 0 0 no-repeat !important;
        background-size: contain !important;
    }
  
    #zone_gauche_inventaire {
        text-transform: uppercase !important;
        font-size: .7rem !important;
        font-family: Arial !important;
        background: url('https://i.imgur.com/7HIiH9a.png') 0 0 no-repeat !important;
        background-size: contain !important;
    }
  
    #chat_preview .chatContent, #zone_chat .zone_infos {
        color: ##C71585 !important;
        text-transform: none !important;
    }
  
    #combat_menu>div, #zone_actions>div {
      box-sizing: border-box !important;
        background: url('https://i.imgur.com/5FM2Ynm.png') left top no-repeat !important;
        background-size: contain !important;
        border: 0 solid transparent !important;
        transition: all .2s ease !important;
        position: relative !important;
        padding-top: 94.3% !important;
        margin: 0 !important;
    }
  
    svg {
        stroke: #000 !important;
        fill: #8a8a8a !important;
    }
  
    .case_objet {
        background-color: #303030 !important;
    }
  
    .zone_conteneurs_displayed .conteneur .conteneur_content {
        background-color: rgba(0,0,0,.95) !important;
        padding: 1px 0 !important;
        border: 1px solid #fff !important;
        box-shadow: 0 0 3px inset #000, 0 0 5px #000 !important;
    }
  
    .zone_conteneurs_displayed .conteneur .titreConteneur {
        position: absolute !important;
        top: -24px !important;
        left: 50% !important;
        margin-left: -83px !important;
        text-align: center !important;
        padding-top: 5px !important;
        font-size: 10px !important;
        color: #fff !important;
        background: url('https://i.imgur.com/u7PAhCI.png') 0 0 no-repeat !important;
        font-family: Verdana !important;
        box-sizing: border-box !important;
    }
  
    .zone_conteneurs_displayed .conteneur .close {
        position: absolute !important;
        top: -10px !important;
        right: -12px !important;
        width: 24px !important;
        height: 21px !important;
        background: url('https://i.imgur.com/BKscnhl.png') !important;
    }
  
    #zone_fiche #statistiques ul > li .statistiques_head {
      padding: 0 !important;
    }
  
    #zone_fiche #txt_credits .icon {
        position: absolute !important;
        left: 0 !important;
    }
  
    #zone_fiche #txt_credits span {
        top: none !important;
    }
  
    #zone_fiche #txt_credits em {
        top: none !important;
    }
  
    .stat_1_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .stat_2_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .stat_3_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .stat_4_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .stat_5_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .stat_6_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .stat_7_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .stat_8_entier {
        color: #C71585 !important;
        font-size: 0.7rem !important;
    }
  
    .flipmobile-card {
        background-color: #181818 !important;
    }
  
    #acc_carte_content {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        overflow: hidden !important;
        background: rgba(24,24,24,.95);
        box-shadow: 15px 15px 75px inset #181818, -15px -15px 75px inset #181818 !important;
        border: 1px solid transparent !important;
        box-sizing: border-box !important;
        background-clip: padding-box !important;
    }
  
    #acc_groupe_1 {
        z-index: 1 !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%,-50%) !important;
        background: url('https://i.imgur.com/8IEWlV0.png') 0 0 no-repeat !important;
    }
  
    #acc_carte_drag .titre1 {
        font-size: 1rem !important;
        color: #878787 !important;
        font-variant: small-caps !important;
    }
  
    #zone_quete {
        position: absolute !important;
        bottom: -13% !important;
        left: 2% !important;
        background: url('https://i.imgur.com/VDzD06y.png') 0 0 no-repeat !important;
        background-size: contain !important;
        color: #878787 !important;
        padding: 12% 0 0 49% !important;
        line-height: 1.4rem !important;
        font-size: min(1.1rem,14px) !important;
        box-sizing: border-box !important;
    }
  
  
    #zone_chat .connectes {
        color: #fff !important;
        border-bottom: 1px solid #7ec8d8 !important;
        margin: 3px 10px 5px !important;
        padding-right: 15px !important;
        overflow: hidden !important;
        padding-bottom: 15px !important;
    }
  
  
    #zone_chat .connectes span:not(.couleur5) {
        color: #b3b3ff !important;
    }
  
    #zone_chat .connectes .couleur5 {
        color: #C71585 !important;
    }
  `;
  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    let styleNode = document.createElement('style');
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector('head') || document.documentElement).appendChild(
      styleNode,
    );
  }
})();
