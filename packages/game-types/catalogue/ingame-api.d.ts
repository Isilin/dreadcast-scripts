/* eslint-disable */
// Genere par tools/extract-game-api.mjs -- ne pas editer a la main.
// Source : vendor/dreadcast.net/ingame.min.4.15.3.js
// 47 classes, 884 methodes.

declare class Accomplissements {
  close(...args: any[]): any;
  closeWay(...args: any[]): any;
  openWay(...args: any[]): any;
  start(...args: any[]): any;
  useKey(...args: any[]): any;
  validate(...args: any[]): any;
}

declare class Achat_stock {
  addConteneur(...args: any[]): any;
  addObject(...args: any[]): any;
  changeMenu(...args: any[]): any;
  close(...args: any[]): any;
  computeTakenMoney(...args: any[]): any;
  depositMoney(...args: any[]): any;
  removeConteneur(...args: any[]): any;
  removeObject(...args: any[]): any;
  start(...args: any[]): any;
  switchConteneurs(...args: any[]): any;
  takeMoney(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Admin {
  addEffet(...args: any[]): any;
  addEmploye(...args: any[]): any;
  addTitle(...args: any[]): any;
  changeReactions(...args: any[]): any;
  changerNomCercle(...args: any[]): any;
  close(...args: any[]): any;
  createNewObjetRP(...args: any[]): any;
  createNewRecipe(...args: any[]): any;
  createObjet(...args: any[]): any;
  deleteFurniture(...args: any[]): any;
  deleteItem(...args: any[]): any;
  deleteObjetRP(...args: any[]): any;
  deletePNJ(...args: any[]): any;
  deleteRecipe(...args: any[]): any;
  embodyCharacter(...args: any[]): any;
  findMulti(...args: any[]): any;
  generateGrid(...args: any[]): any;
  groupModif(...args: any[]): any;
  loaded(...args: any[]): any;
  modifObjetRP(...args: any[]): any;
  modifRecipe(...args: any[]): any;
  parseReactions(...args: any[]): any;
  payItem(...args: any[]): any;
  removeEmploye(...args: any[]): any;
  removeTitle(...args: any[]): any;
  retourLog(...args: any[]): any;
  saveFormula(...args: any[]): any;
  selectObjetEffet(...args: any[]): any;
  selectObjetName(...args: any[]): any;
  selectObjetType(...args: any[]): any;
  start(...args: any[]): any;
  testFormula(...args: any[]): any;
  updateField(...args: any[]): any;
  updateGrilleCase(...args: any[]): any;
  updateGrilleJonction(...args: any[]): any;
  updateStats(...args: any[]): any;
}

declare class AITL {
  activeInputFocusMobile(...args: any[]): any;
  close(...args: any[]): any;
  piluleAction(...args: any[]): any;
  primeChangeStatus(...args: any[]): any;
  primeRecuperer(...args: any[]): any;
  sendAnnonce(...args: any[]): any;
  sendPilule(...args: any[]): any;
  sendPrime(...args: any[]): any;
  showAnnonce(...args: any[]): any;
  showCanauxImperiaux(...args: any[]): any;
  showCitationDuJour(...args: any[]): any;
  showCorporations(...args: any[]): any;
  showDeces(...args: any[]): any;
  showEncyclopedie(...args: any[]): any;
  showNewAnnonce(...args: any[]): any;
  showNewPilule(...args: any[]): any;
  showPetitesAnnonces(...args: any[]): any;
  showPilules(...args: any[]): any;
  showPrimeActif(...args: any[]): any;
  showPrimeDone(...args: any[]): any;
  showPrimeNew(...args: any[]): any;
  showPrimeTop(...args: any[]): any;
  showTipDuJour(...args: any[]): any;
  start(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Atelier {
  activeDekit(...args: any[]): any;
  boostItemByEngineering(...args: any[]): any;
  calculateFormeBoost(...args: any[]): any;
  calculateFormeDekit(...args: any[]): any;
  calculateFormeRepair(...args: any[]): any;
  calculateFormeTransformation(...args: any[]): any;
  close(...args: any[]): any;
  dekitItem(...args: any[]): any;
  findRepairStats(...args: any[]): any;
  modifyItem(...args: any[]): any;
  placeItem(...args: any[]): any;
  removeItem(...args: any[]): any;
  repairItem(...args: any[]): any;
  start(...args: any[]): any;
  transformFurniture(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Carte {
  activate(...args: any[]): any;
  activeMeubles(...args: any[]): any;
  anim(...args: any[]): any;
  askDigicode(...args: any[]): any;
  askDigicodeMeuble(...args: any[]): any;
  clear(...args: any[]): any;
  clone(...args: any[]): any;
  deplacement(...args: any[]): any;
  desactivate(...args: any[]): any;
  displayFleche(...args: any[]): any;
  displayMap(...args: any[]): any;
  displaySearch(...args: any[]): any;
  doSearch(...args: any[]): any;
  enregistre_donnees_deplacement(...args: any[]): any;
  enterSouterrain(...args: any[]): any;
  executeAction(...args: any[]): any;
  executeActionBatiment(...args: any[]): any;
  executeActionMeuble(...args: any[]): any;
  executeActionPersonnage(...args: any[]): any;
  exitSouterrain(...args: any[]): any;
  getCurrentCase(...args: any[]): any;
  getDonnee(...args: any[]): any;
  getDonnees(...args: any[]): any;
  getId(...args: any[]): any;
  getMapOffsetX(...args: any[]): any;
  getMapOffsetY(...args: any[]): any;
  getMode(...args: any[]): any;
  getOffsetX(...args: any[]): any;
  getOffsetY(...args: any[]): any;
  getPersoListAtXY(...args: any[]): any;
  getPosX(...args: any[]): any;
  getPosY(...args: any[]): any;
  getTailleCase(...args: any[]): any;
  getType(...args: any[]): any;
  goOut(...args: any[]): any;
  modifySAS(...args: any[]): any;
  presenceBatiment(...args: any[]): any;
  presenceMeuble(...args: any[]): any;
  presencePersonnage(...args: any[]): any;
  retourDigicode(...args: any[]): any;
  retourDigicodeMeuble(...args: any[]): any;
  setCurrentCase(...args: any[]): any;
  setCymap(...args: any[]): any;
  setOffsetX(...args: any[]): any;
  setOffsetY(...args: any[]): any;
  setTailleCase(...args: any[]): any;
  setType(...args: any[]): any;
  teleport(...args: any[]): any;
  teleportPAP(...args: any[]): any;
  useReturnMove(...args: any[]): any;
}

declare class Combat {
  activateFighter(...args: any[]): any;
  ajouteCombattant(...args: any[]): any;
  changeActionPrepare(...args: any[]): any;
  changeEtat(...args: any[]): any;
  changeFormeJoueur(...args: any[]): any;
  changeInfo(...args: any[]): any;
  changeNomAction(...args: any[]): any;
  changeSanteJoueur(...args: any[]): any;
  checkAttaqueDistance(...args: any[]): any;
  close(...args: any[]): any;
  closeInviteToFight(...args: any[]): any;
  finDeCombat(...args: any[]): any;
  hideArea(...args: any[]): any;
  indiquePositionLieu(...args: any[]): any;
  indiquePositionPersonnage(...args: any[]): any;
  inviteToFight(...args: any[]): any;
  lootVoter(...args: any[]): any;
  retireCombattant(...args: any[]): any;
  salonCombat(...args: any[]): any;
  setActionCombat(...args: any[]): any;
  showArea(...args: any[]): any;
  showAreaAttaque(...args: any[]): any;
  showAreaDeplacement(...args: any[]): any;
  slideshowHistorique(...args: any[]): any;
  start(...args: any[]): any;
  startAfterLoad(...args: any[]): any;
  traiteLigneHistorique(...args: any[]): any;
  traiteTourCombat(...args: any[]): any;
  tryToBreak(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Creation_batiment {
  action(...args: any[]): any;
  ajouteHabitation(...args: any[]): any;
  changeMode(...args: any[]): any;
  changeZone(...args: any[]): any;
  close(...args: any[]): any;
  colorie(...args: any[]): any;
  deplaceCarte(...args: any[]): any;
  derniereEtape(...args: any[]): any;
  descendZone(...args: any[]): any;
  downloadConstruction(...args: any[]): any;
  efface(...args: any[]): any;
  effaceTout(...args: any[]): any;
  getMode(...args: any[]): any;
  monteZone(...args: any[]): any;
  previewConstruction(...args: any[]): any;
  remplit(...args: any[]): any;
  retireHabitation(...args: any[]): any;
  selectionneHabillage(...args: any[]): any;
  start(...args: any[]): any;
  testConnexite(...args: any[]): any;
  testConnexitePublique(...args: any[]): any;
  testConnexiteZones(...args: any[]): any;
  testContactZone(...args: any[]): any;
  updateCoordsMinAndMax(...args: any[]): any;
  updateInformations(...args: any[]): any;
  uploadConstruction(...args: any[]): any;
  useKey(...args: any[]): any;
  valideCarte(...args: any[]): any;
  valideConstruction(...args: any[]): any;
  valideInformations(...args: any[]): any;
  verificationContactZones(...args: any[]): any;
}

declare class Creation_stock {
  close(...args: any[]): any;
  lancerProduction(...args: any[]): any;
  mise_en_production(...args: any[]): any;
  start(...args: any[]): any;
  stopProduction(...args: any[]): any;
  updateCoutDuree(...args: any[]): any;
  updateItemBox(...args: any[]): any;
  updateItems(...args: any[]): any;
  updateJauge(...args: any[]): any;
  updateQualite(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Crochetage_choix {
  close(...args: any[]): any;
  lancementCrochetage(...args: any[]): any;
  start(...args: any[]): any;
}

declare class Custom_process {
  _getItemModelId(...args: any[]): any;
  _getItemObjectId(...args: any[]): any;
  _getItemObjectType(...args: any[]): any;
  _init(...args: any[]): any;
  _initDroppable(...args: any[]): any;
  _loadFormData(...args: any[]): any;
  _submitData(...args: any[]): any;
  _updateSelect(...args: any[]): any;
  _validateFormData(...args: any[]): any;
  close(...args: any[]): any;
  getPriceByType(...args: any[]): any;
  getTypeByModele(...args: any[]): any;
  placeItem(...args: any[]): any;
  setPrices(...args: any[]): any;
  setTypes(...args: any[]): any;
  start(...args: any[]): any;
  update(...args: any[]): any;
}

declare class Customisation {
  activeAmelioration(...args: any[]): any;
  close(...args: any[]): any;
  customizeItem(...args: any[]): any;
  findAmelioration(...args: any[]): any;
  placeItem(...args: any[]): any;
  removeItem(...args: any[]): any;
  start(...args: any[]): any;
  updateData(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Databox_Controller {
  useKey(...args: any[]): any;
}

declare class Deck {
  close(...args: any[]): any;
  executeCommand(...args: any[]): any;
  getContexte(...args: any[]): any;
  goToBottom(...args: any[]): any;
  ready(...args: any[]): any;
  start(...args: any[]): any;
  startHackEffect(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Engine {
  RestartTuto(...args: any[]): any;
  accordion(...args: any[]): any;
  activeDecompte(...args: any[]): any;
  activeEvilBox(...args: any[]): any;
  activeFakeTooltip(...args: any[]): any;
  activeForm(...args: any[]): any;
  activeLinkBox(...args: any[]): any;
  activeRewardBox(...args: any[]): any;
  activeScrollPane(...args: any[]): any;
  actualiserPoliceHtml(...args: any[]): any;
  actualiserWrapperWidth(...args: any[]): any;
  addLightBox(...args: any[]): any;
  adminAddNews(...args: any[]): any;
  adminAddWiki(...args: any[]): any;
  adminAfficheRequete(...args: any[]): any;
  adminAttribueRequetes(...args: any[]): any;
  adminCategoriseRequetes(...args: any[]): any;
  adminCheckNames(...args: any[]): any;
  adminDataList(...args: any[]): any;
  adminDeleteNews(...args: any[]): any;
  adminDeleteRequetes(...args: any[]): any;
  adminDeleteWiki(...args: any[]): any;
  adminGetInfo(...args: any[]): any;
  adminGetListItems(...args: any[]): any;
  adminGetTrace(...args: any[]): any;
  adminSaveBlocage(...args: any[]): any;
  adminSaveComment(...args: any[]): any;
  adminSaveFrise(...args: any[]): any;
  adminSaveNews(...args: any[]): any;
  adminSaveWiki(...args: any[]): any;
  adminSendAnswer(...args: any[]): any;
  adminSimulateCombat(...args: any[]): any;
  adminToggleListItems(...args: any[]): any;
  adminUnlockBlocage(...args: any[]): any;
  annuleEchange(...args: any[]): any;
  augmenterPoliceHtml(...args: any[]): any;
  augmenterWidthWrapper(...args: any[]): any;
  avancementCrochetage(...args: any[]): any;
  calculHauteurPanels(...args: any[]): any;
  changeAction(...args: any[]): any;
  changeActionsCombat(...args: any[]): any;
  changeActionsPersonnage(...args: any[]): any;
  checkEntrepriseNames(...args: any[]): any;
  checkForme(...args: any[]): any;
  checkGroupNames(...args: any[]): any;
  checkGroupTag(...args: any[]): any;
  checkInput(...args: any[]): any;
  checkNames(...args: any[]): any;
  checkText(...args: any[]): any;
  choixAssurance(...args: any[]): any;
  clearATimeOut(...args: any[]): any;
  clearAnInterval(...args: any[]): any;
  clearCtl(...args: any[]): any;
  clearLightBox(...args: any[]): any;
  clearMainArea(...args: any[]): any;
  clearTime(...args: any[]): any;
  cloneCharacter(...args: any[]): any;
  closeDataBox(...args: any[]): any;
  closeRewardBox(...args: any[]): any;
  confirmation(...args: any[]): any;
  convertDataBox(...args: any[]): any;
  count(...args: any[]): any;
  createCompteBancaire(...args: any[]): any;
  cryo(...args: any[]): any;
  currentQueteIndex(...args: any[]): any;
  decompte(...args: any[]): any;
  decryo(...args: any[]): any;
  deleteCompteBancaire(...args: any[]): any;
  dev(...args: any[]): any;
  diminuerPoliceHtml(...args: any[]): any;
  diminuerWidthWrapper(...args: any[]): any;
  displayDataBox(...args: any[]): any;
  displayEvilBox(...args: any[]): any;
  displayFight(...args: any[]): any;
  displayInfoBox(...args: any[]): any;
  displayJailAnnonce(...args: any[]): any;
  displayLightAnnonce(...args: any[]): any;
  displayLightBox(...args: any[]): any;
  displayLightInfo(...args: any[]): any;
  displayLightMap(...args: any[]): any;
  displayLightTextArea(...args: any[]): any;
  displayMapInfo(...args: any[]): any;
  displayRewardBox(...args: any[]): any;
  downNombre(...args: any[]): any;
  downNombreCounter(...args: any[]): any;
  ejectEntrepriseFromConsortium(...args: any[]): any;
  exportHistoriqueEntreprise(...args: any[]): any;
  exportHistoriqueVente(...args: any[]): any;
  fadeTo(...args: any[]): any;
  findPosStart(...args: any[]): any;
  findPosStop(...args: any[]): any;
  formulaire(...args: any[]): any;
  getATimeOut(...args: any[]): any;
  getAnInterval(...args: any[]): any;
  getCtl(...args: any[]): any;
  getCtlById(...args: any[]): any;
  getDraggablePosition(...args: any[]): any;
  getIB(...args: any[]): any;
  getIdPersonnage(...args: any[]): any;
  getKH(...args: any[]): any;
  getLightBoxById(...args: any[]): any;
  getMap(...args: any[]): any;
  getNomPersonnage(...args: any[]): any;
  getUrlSite(...args: any[]): any;
  initQueteIndex(...args: any[]): any;
  justificationMulticompte(...args: any[]): any;
  keyEvent(...args: any[]): any;
  listen(...args: any[]): any;
  majQuetesJournalieres(...args: any[]): any;
  mettreAJourAvancementDigicode(...args: any[]): any;
  navigateQuete(...args: any[]): any;
  openBuildingBox(...args: any[]): any;
  openDataBox(...args: any[]): any;
  openExchangeBox(...args: any[]): any;
  openHealBox(...args: any[]): any;
  openInfoBox(...args: any[]): any;
  openLightBoxPaiement(...args: any[]): any;
  openLightBoxPaiementPilule(...args: any[]): any;
  openObjectBox(...args: any[]): any;
  openPersoBox(...args: any[]): any;
  openPersoBoxAtXY(...args: any[]): any;
  openTransfertBox(...args: any[]): any;
  pilule(...args: any[]): any;
  propositionEchange(...args: any[]): any;
  reactualisationTailleEcran(...args: any[]): any;
  reclameRecompense(...args: any[]): any;
  regenerateDataBox(...args: any[]): any;
  replaceDataBox(...args: any[]): any;
  resetWrapperWidth(...args: any[]): any;
  sauvegarderPerso(...args: any[]): any;
  saveDraggablePosition(...args: any[]): any;
  screenshot(...args: any[]): any;
  setATimeOut(...args: any[]): any;
  setAction(...args: any[]): any;
  setActionPrecision(...args: any[]): any;
  setAnInterval(...args: any[]): any;
  setCtl(...args: any[]): any;
  setData(...args: any[]): any;
  setIB(...args: any[]): any;
  setIdPersonnage(...args: any[]): any;
  setKH(...args: any[]): any;
  setLieu(...args: any[]): any;
  setLieuAdresse(...args: any[]): any;
  setLieuDescription(...args: any[]): any;
  setLieuPrecision(...args: any[]): any;
  setMap(...args: any[]): any;
  start(...args: any[]): any;
  stopListening(...args: any[]): any;
  submitForm(...args: any[]): any;
  switchDataBox(...args: any[]): any;
  switchQueteTab(...args: any[]): any;
  tournePageArriere(...args: any[]): any;
  tournePageAvant(...args: any[]): any;
  transfertCompteBancaire(...args: any[]): any;
  triListe(...args: any[]): any;
  unsetCtl(...args: any[]): any;
  upNombre(...args: any[]): any;
  upNombreCounter(...args: any[]): any;
  updateBox(...args: any[]): any;
  updateBuildingInfos(...args: any[]): any;
  updateMenu(...args: any[]): any;
  updateQueteFleches(...args: any[]): any;
  updateQueteTitre(...args: any[]): any;
  updateToolTip(...args: any[]): any;
  upgradeCompteBancaire(...args: any[]): any;
  useAjaxReturn(...args: any[]): any;
  useKey(...args: any[]): any;
  validation(...args: any[]): any;
  valideHeal(...args: any[]): any;
  valideQuete(...args: any[]): any;
  valideTransfert(...args: any[]): any;
  vote(...args: any[]): any;
  xmlReturn(...args: any[]): any;
}

declare class Feedback {
  close(...args: any[]): any;
  closeBillet(...args: any[]): any;
  getBillet(...args: any[]): any;
  newBillet(...args: any[]): any;
  repondreBillet(...args: any[]): any;
  start(...args: any[]): any;
  turnNextPage(...args: any[]): any;
  turnPreviousPage(...args: any[]): any;
  useKey(...args: any[]): any;
  validationBillet(...args: any[]): any;
}

declare class FleeFromBlocking {
  close(...args: any[]): any;
  forcePassage(...args: any[]): any;
  sneakPassage(...args: any[]): any;
  start(...args: any[]): any;
}

declare class Gang {
  displayHackDashboard(...args: any[]): any;
  hackBankInterests(...args: any[]): any;
  start(...args: any[]): any;
  startScanning(...args: any[]): any;
}

declare class Gestion_batiment {
  buyFurniture(...args: any[]): any;
  checkMeubleCollision(...args: any[]): any;
  close(...args: any[]): any;
  deleteFurniture(...args: any[]): any;
  rotateFurniture(...args: any[]): any;
  savePosition(...args: any[]): any;
  select(...args: any[]): any;
  setData(...args: any[]): any;
  setDataSelected(...args: any[]): any;
  start(...args: any[]): any;
  updateEffectsMateriel(...args: any[]): any;
  updatePosition(...args: any[]): any;
  updateTexteAffiche(...args: any[]): any;
  useKey(...args: any[]): any;
  verifPosition(...args: any[]): any;
}

declare class Gestion_materiel {
  close(...args: any[]): any;
  desinstaller(...args: any[]): any;
  modifDigicode(...args: any[]): any;
  randomDigicode(...args: any[]): any;
  reload(...args: any[]): any;
  start(...args: any[]): any;
  update(...args: any[]): any;
  upgrade(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Gestion_meuble {
  close(...args: any[]): any;
  modifDigicode(...args: any[]): any;
  randomDigicode(...args: any[]): any;
  reload(...args: any[]): any;
  start(...args: any[]): any;
  update(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Global {
  after(...args: any[]): any;
  before(...args: any[]): any;
  checkReturn(...args: any[]): any;
  close(...args: any[]): any;
  getItemOfTheMonth(...args: any[]): any;
  getItemPremium(...args: any[]): any;
  jailBail(...args: any[]): any;
  jailFree(...args: any[]): any;
  jailTransfert(...args: any[]): any;
  slide(...args: any[]): any;
  start(...args: any[]): any;
  transfertPills(...args: any[]): any;
  update(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Intro {
  backToStepOne(...args: any[]): any;
  checkIsActivated(...args: any[]): any;
  checkQuestionAnswer(...args: any[]): any;
  fadeText(...args: any[]): any;
  logForRecord(...args: any[]): any;
  showOnReady(...args: any[]): any;
  validateStepOne(...args: any[]): any;
  validateStepTwo(...args: any[]): any;
}

declare class KeyHandler {
  checkKeyDown(...args: any[]): any;
  checkKeyUp(...args: any[]): any;
  disable(...args: any[]): any;
  enable(...args: any[]): any;
}

declare class LightBox {
  addFirstCallback(...args: any[]): any;
  addPage(...args: any[]): any;
  display(...args: any[]): any;
  formData(...args: any[]): any;
  getId(...args: any[]): any;
  goToPage(...args: any[]): any;
  keyEvent(...args: any[]): any;
  tournePageArriere(...args: any[]): any;
  tournePageAvant(...args: any[]): any;
}

declare class Livre {
  changeSubTitle(...args: any[]): any;
  changeTitle(...args: any[]): any;
  checkSavedPages(...args: any[]): any;
  close(...args: any[]): any;
  displayPage(...args: any[]): any;
  displayPages(...args: any[]): any;
  eraseBook(...args: any[]): any;
  extractPage(...args: any[]): any;
  firstPage(...args: any[]): any;
  getMaxPage(...args: any[]): any;
  getMinPage(...args: any[]): any;
  getNextPage(...args: any[]): any;
  getPrevPage(...args: any[]): any;
  goToPage(...args: any[]): any;
  isSaved(...args: any[]): any;
  lastPage(...args: any[]): any;
  loadPages(...args: any[]): any;
  lockBook(...args: any[]): any;
  nextPage(...args: any[]): any;
  prevPage(...args: any[]): any;
  savePage(...args: any[]): any;
  setPagesInfos(...args: any[]): any;
  start(...args: any[]): any;
  startSave(...args: any[]): any;
  update(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Machine_a_sous {
  start(...args: any[]): any;
  update(...args: any[]): any;
}

declare class Menu {
  bougeDeLa(...args: any[]): any;
  fill(...args: any[]): any;
  getEtat(...args: any[]): any;
  getId(...args: any[]): any;
  getName(...args: any[]): any;
  getSelected(...args: any[]): any;
  getWindow(...args: any[]): any;
  getZIndex(...args: any[]): any;
  inInitPosition(...args: any[]): any;
  removeWarning(...args: any[]): any;
  savePosition(...args: any[]): any;
  select(...args: any[]): any;
  setEtat(...args: any[]): any;
  setInitPosition(...args: any[]): any;
  setPosition(...args: any[]): any;
  setSelected(...args: any[]): any;
  setZIndex(...args: any[]): any;
  toString(...args: any[]): any;
  unselect(...args: any[]): any;
}

declare class MenuAccomplissements {
  keyEvent(...args: any[]): any;
}

declare class MenuCarnet {
  adresseSelectAll(...args: any[]): any;
  adresseUnselectAll(...args: any[]): any;
  changePointsRelation(...args: any[]): any;
  changeTypeRelation(...args: any[]): any;
  contactSelectAll(...args: any[]): any;
  contactUnselectAll(...args: any[]): any;
  deleteAdresse(...args: any[]): any;
  deleteContact(...args: any[]): any;
  deleteFolder(...args: any[]): any;
  displayPointsRelation(...args: any[]): any;
  displayTypeRelation(...args: any[]): any;
  handleDrag(...args: any[]): any;
  handleDragAdresse(...args: any[]): any;
  handleDragContact(...args: any[]): any;
  handleDrop(...args: any[]): any;
  mailContact(...args: any[]): any;
  moveEntree(...args: any[]): any;
  newAdresse(...args: any[]): any;
  newContact(...args: any[]): any;
  newFolder(...args: any[]): any;
  openAdresse(...args: any[]): any;
  openContact(...args: any[]): any;
  openFolder(...args: any[]): any;
  reloadFolder(...args: any[]): any;
  renameFolder(...args: any[]): any;
  saveAddressContent(...args: any[]): any;
  saveContactContent(...args: any[]): any;
  start(...args: any[]): any;
  toggleCurrentAdresse(...args: any[]): any;
  toggleCurrentContact(...args: any[]): any;
  unselectAll(...args: any[]): any;
}

declare class MenuChat {
  addRoom(...args: any[]): any;
  canReceive(...args: any[]): any;
  changeMode(...args: any[]): any;
  changeRoomName(...args: any[]): any;
  checkConversation(...args: any[]): any;
  checkConversations(...args: any[]): any;
  checkTab(...args: any[]): any;
  clearIntervale(...args: any[]): any;
  getCurrentRoom(...args: any[]): any;
  getRoom(...args: any[]): any;
  getRooms(...args: any[]): any;
  getUrlReceive(...args: any[]): any;
  goOnRoom(...args: any[]): any;
  intervale(...args: any[]): any;
  isPrivate(...args: any[]): any;
  keyEvent(...args: any[]): any;
  kw(...args: any[]): any;
  messageReceived(...args: any[]): any;
  openedRoom(...args: any[]): any;
  reinvite(...args: any[]): any;
  removeRoom(...args: any[]): any;
  send(...args: any[]): any;
  sendEvent(...args: any[]): any;
  setEtat(...args: any[]): any;
  setInitPosition(...args: any[]): any;
  setRoom(...args: any[]): any;
  setTimeCurrentRoom(...args: any[]): any;
  toggleMode(...args: any[]): any;
  update(...args: any[]): any;
}

declare class MenuExperience {
  keyEvent(...args: any[]): any;
  lvlUp(...args: any[]): any;
  nextPage(...args: any[]): any;
  prevPage(...args: any[]): any;
}

declare class MenuInformations {
  displayCaution(...args: any[]): any;
  keyEvent(...args: any[]): any;
  validCaution(...args: any[]): any;
}

declare class MenuInventaire {
  activeObjet(...args: any[]): any;
  buyDigit(...args: any[]): any;
  checkDeplacement(...args: any[]): any;
  clearDrag(...args: any[]): any;
  clearNewAlerteAitl(...args: any[]): any;
  clearNewArrivantTPAlerte(...args: any[]): any;
  deleteObjet(...args: any[]): any;
  desinstalle(...args: any[]): any;
  displayInfos(...args: any[]): any;
  diviseObjets(...args: any[]): any;
  downNombre(...args: any[]): any;
  getCraftTimeDown(...args: any[]): any;
  getCreditsCentrale(...args: any[]): any;
  getCurrentDragId(...args: any[]): any;
  hideInfos(...args: any[]): any;
  keyEvent(...args: any[]): any;
  lanceCraft(...args: any[]): any;
  modifDigicode(...args: any[]): any;
  newAlerteAitl(...args: any[]): any;
  newArrivantTPAlerte(...args: any[]): any;
  onAttacheMenu(...args: any[]): any;
  onCloseMenu(...args: any[]): any;
  onLibereMenu(...args: any[]): any;
  resetDrag(...args: any[]): any;
  saveDrag(...args: any[]): any;
  showInfos(...args: any[]): any;
  start(...args: any[]): any;
  stopCraft(...args: any[]): any;
  timeDown(...args: any[]): any;
  upNombre(...args: any[]): any;
  updateCaseObjet(...args: any[]): any;
  updateEffectsCaseObjet(...args: any[]): any;
  updateEffectsInventaire(...args: any[]): any;
}

declare class MenuLogement {
  abandonneLocation(...args: any[]): any;
  changeInfoLogement(...args: any[]): any;
  fill(...args: any[]): any;
  keyEvent(...args: any[]): any;
  location(...args: any[]): any;
  miseEnLocation(...args: any[]): any;
  miseEnVente(...args: any[]): any;
  updateEffectsMateriel(...args: any[]): any;
  updateInfoLogement(...args: any[]): any;
  valideCandidature(...args: any[]): any;
}

declare class MenuMessagerie {
  closeNewMessage(...args: any[]): any;
  deleteFolder(...args: any[]): any;
  deleteMessage(...args: any[]): any;
  displayConversationMessage(...args: any[]): any;
  handleDrag(...args: any[]): any;
  handleDrop(...args: any[]): any;
  handleDropPlainte(...args: any[]): any;
  loadFolderContent(...args: any[]): any;
  messageReceived(...args: any[]): any;
  messageSelectAll(...args: any[]): any;
  messageSent(...args: any[]): any;
  messageShowFilter(...args: any[]): any;
  messageUnselectAll(...args: any[]): any;
  moveMessage(...args: any[]): any;
  moveMessageHlp(...args: any[]): any;
  newFolder(...args: any[]): any;
  newMessage(...args: any[]): any;
  notReadMessage(...args: any[]): any;
  openConversationMessage(...args: any[]): any;
  openFolder(...args: any[]): any;
  openMessage(...args: any[]): any;
  renameFolder(...args: any[]): any;
  sendMessage(...args: any[]): any;
  setEtat(...args: any[]): any;
  start(...args: any[]): any;
  update(...args: any[]): any;
}

declare class MenuStatistiques {
  downNombre(...args: any[]): any;
  keyEvent(...args: any[]): any;
  upNombre(...args: any[]): any;
  updateMedecine(...args: any[]): any;
  updateStat(...args: any[]): any;
}

declare class MenuTravail {
  AITLcensure(...args: any[]): any;
  AITLdeleteCitation(...args: any[]): any;
  AITLdeleteTips(...args: any[]): any;
  AITLnewCitation(...args: any[]): any;
  AITLnewTips(...args: any[]): any;
  AITLpublieArticle(...args: any[]): any;
  AITLpublieCitation(...args: any[]): any;
  AITLpublieTips(...args: any[]): any;
  _getRpContentContainer(...args: any[]): any;
  _truncateWithButton(...args: any[]): any;
  abandonLieu(...args: any[]): any;
  acheterBatiment(...args: any[]): any;
  acheterLieu(...args: any[]): any;
  acheterPropriete(...args: any[]): any;
  addResponsable(...args: any[]): any;
  ameliorerLieu(...args: any[]): any;
  analysePlace(...args: any[]): any;
  askForAGroupJob(...args: any[]): any;
  askForAJob(...args: any[]): any;
  askForApplication(...args: any[]): any;
  askForApplicationGroup(...args: any[]): any;
  buyLicence(...args: any[]): any;
  buyProduct(...args: any[]): any;
  changeBudget(...args: any[]): any;
  changeDG(...args: any[]): any;
  changeDePage(...args: any[]): any;
  changeFormatCercle(...args: any[]): any;
  changeQuantite(...args: any[]): any;
  changeQuantiteGroup(...args: any[]): any;
  computeAccountPrice(...args: any[]): any;
  createGangHideout(...args: any[]): any;
  creationCercle(...args: any[]): any;
  creationCercleRetour(...args: any[]): any;
  creationCercleSuite(...args: any[]): any;
  creationEntreprise(...args: any[]): any;
  creationEntrepriseRetour(...args: any[]): any;
  creationEntrepriseSuite(...args: any[]): any;
  creationPoste(...args: any[]): any;
  decorerBatiment(...args: any[]): any;
  deleteGroupJob(...args: any[]): any;
  deleteJob(...args: any[]): any;
  detruireBatiment(...args: any[]): any;
  fermetureForcee(...args: any[]): any;
  fill(...args: any[]): any;
  filtreObjetProductible(...args: any[]): any;
  fire(...args: any[]): any;
  goToPage(...args: any[]): any;
  installeRack(...args: any[]): any;
  installeTerminal(...args: any[]): any;
  installeTerminalCercle(...args: any[]): any;
  keyEvent(...args: any[]): any;
  mevPagePrecedente(...args: any[]): any;
  mevPageSuivante(...args: any[]): any;
  mise_en_vente(...args: any[]): any;
  pariaToFedere(...args: any[]): any;
  quit(...args: any[]): any;
  racheterPropriete(...args: any[]): any;
  renameCercle(...args: any[]): any;
  renameEntreprise(...args: any[]): any;
  revendreAuxAutorites(...args: any[]): any;
  revendreTerrainAuxAutorites(...args: any[]): any;
  savePlagesHoraires(...args: any[]): any;
  selectNewAccount(...args: any[]): any;
  selectObjetProductible(...args: any[]): any;
  setupVoirPlus(...args: any[]): any;
  swapVitrines(...args: any[]): any;
  transfertCercle(...args: any[]): any;
  transfertEntreprise(...args: any[]): any;
  trieCompteBancaire(...args: any[]): any;
  updateItemsToSell(...args: any[]): any;
  updatePriveVisibility(...args: any[]): any;
  updatePrixVente(...args: any[]): any;
  validateCandidature(...args: any[]): any;
}

declare class MenuVille {
  changeDePage(...args: any[]): any;
  changePointsRelation(...args: any[]): any;
  changeTypeRelation(...args: any[]): any;
  deleteRelation(...args: any[]): any;
  displayActionsReciproques(...args: any[]): any;
  displayNouvelleRelation(...args: any[]): any;
  displayPointsRelation(...args: any[]): any;
  displayTypeRelation(...args: any[]): any;
  downPointsRelation(...args: any[]): any;
  goToPage(...args: any[]): any;
  keyEvent(...args: any[]): any;
  nouvelleRelation(...args: any[]): any;
  upPointsRelation(...args: any[]): any;
}

declare class Navigator {
  attache_menu(...args: any[]): any;
  ferme_menu(...args: any[]): any;
  getCarnet(...args: any[]): any;
  getChat(...args: any[]): any;
  getEnregistrement(...args: any[]): any;
  getExperience(...args: any[]): any;
  getInventaire(...args: any[]): any;
  getLogement(...args: any[]): any;
  getMenus(...args: any[]): any;
  getMessagerie(...args: any[]): any;
  getOptions(...args: any[]): any;
  getSelected(...args: any[]): any;
  getStatistiques(...args: any[]): any;
  getTravail(...args: any[]): any;
  getVille(...args: any[]): any;
  keyEvent(...args: any[]): any;
  libere_menu(...args: any[]): any;
  ouvre_menu(...args: any[]): any;
  parseMenu(...args: any[]): any;
  place_devant(...args: any[]): any;
  place_window(...args: any[]): any;
  removeMenu(...args: any[]): any;
  setEnregistrement(...args: any[]): any;
  setMenu(...args: any[]): any;
  setNewOnTop(...args: any[]): any;
  setOnTop(...args: any[]): any;
  set_menu(...args: any[]): any;
  toggle_menu(...args: any[]): any;
}

declare class Poles {
  close(...args: any[]): any;
  refresh(...args: any[]): any;
  refreshHTML(...args: any[]): any;
  refreshXML(...args: any[]): any;
  remplacerChefLeader(...args: any[]): any;
  start(...args: any[]): any;
  update(...args: any[]): any;
  useKey(...args: any[]): any;
  virerChefLeader(...args: any[]): any;
  vote(...args: any[]): any;
}

declare class Promo {
  activeSelectedChoice(...args: any[]): any;
  changeGenre(...args: any[]): any;
  changePack(...args: any[]): any;
  changeSpecialisation(...args: any[]): any;
  clickItem(...args: any[]): any;
  close(...args: any[]): any;
  doAchat(...args: any[]): any;
  getCurrentGenre(...args: any[]): any;
  getCurrentPack(...args: any[]): any;
  getCurrentSpecialisation(...args: any[]): any;
  initBox(...args: any[]): any;
  resetForm(...args: any[]): any;
  start(...args: any[]): any;
  update(...args: any[]): any;
  updateInfos(...args: any[]): any;
  valideAchat(...args: any[]): any;
}

declare class Reactions {
  close(...args: any[]): any;
  defineNewSet(...args: any[]): any;
  selectSet(...args: any[]): any;
  start(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Reseau_police {
  close(...args: any[]): any;
  deleteComplain(...args: any[]): any;
  displayComplains(...args: any[]): any;
  displayCrimes(...args: any[]): any;
  displayIntrusions(...args: any[]): any;
  displayMenu(...args: any[]): any;
  displayPrivateData(...args: any[]): any;
  displayRecord(...args: any[]): any;
  openAnswerMessage(...args: any[]): any;
  openProofMessage(...args: any[]): any;
  resultatCasier(...args: any[]): any;
  resultatRechercheAvancee(...args: any[]): any;
  start(...args: any[]): any;
  switchMessage(...args: any[]): any;
  update(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class Tutoriel {
  handleEvent(...args: any[]): any;
  init(...args: any[]): any;
  isTutoCompleted(...args: any[]): any;
  niveau2(...args: any[]): any;
  switchActivated(...args: any[]): any;
  tutoAitl(...args: any[]): any;
  tutoAssurance(...args: any[]): any;
  tutoDeplacement(...args: any[]): any;
  tutoEmploi(...args: any[]): any;
  tutoFaimSoif(...args: any[]): any;
  tutoForme(...args: any[]): any;
  tutoParler(...args: any[]): any;
  tutoSauvegarder(...args: any[]): any;
}

declare class Vol {
  close(...args: any[]): any;
  start(...args: any[]): any;
  tryToStealMoney(...args: any[]): any;
  useKey(...args: any[]): any;
}

declare class WaitFor {
  answer(...args: any[]): any;
  checkAnswer(...args: any[]): any;
  doResolve(...args: any[]): any;
  getLogAnswers(...args: any[]): any;
  getMessage(...args: any[]): any;
}
