document.getElementById('version').innerText = sendSync('getVersions').holla;
document.getElementById('dowloandsHEdef').innerText = sendSync('dowloandsHEdef');

/* Tema Çek Yükle */
function xloadThemes(){
const theme = sendSync('getTheme');
if(theme){ themeObj = theme.toLowerCase(); }/*
if (document.querySelector('head link[href*="assets://themes"]')) document.querySelector('head link[href*="assets://themes"]').remove();
document.head.innerHTML += '<link rel="stylesheet" href="assets://themes/'+themeObj+'.css">';*/
}
xloadThemes();
/* Tema Çek Yükle Son */

/* Ön Bellekten Arama Motorlarını Getir */
const searchEngines = sendSync('store', 'get', 'searchEngines').map(e => e.name);

/* Belirli Bir Div İçine Verileri Çek Yükle */
function loadDataEngines(oneID,twoID,theFuc){
let panelEl = document.getElementById(oneID);
let options = searchEngines.map(op => `<div class="sc-1k8lovv hJBLHH" onclick="${theFuc}('${op}', '${op}', '${twoID}')">${op}</div>`).join('\n');
panelEl.innerHTML += `${ options }`;
}

/* Arama Motorlarını Çek */
loadDataEngines('search-engine','search_engine-text','prossSearchEngines');




/* Ön Bellekten userAgent Getir */
const userAgent = sendSync('store', 'get', 'userAgent').map(e => e.name);
console.log(userAgent);

/* Belirli Bir Div İçine Verileri Çek Yükle */
function loadDataEnginesUserAgent(oneID,twoID,theFuc){
let panelElx = document.getElementById(oneID);
let optionsx = userAgent.map(op => `<div class="sc-1k8lovv hJBLHH" onclick="${theFuc}('${op}', '${op}', '${twoID}')">${op}</div>`).join('\n');
panelElx.innerHTML += `${ optionsx }`;
}

/* userAgent Çek */
loadDataEnginesUserAgent('user-agent','user_agent-text','prossUserAgent');


/* userAgent Değiştirme İşlemi */
function prossUserAgent(eValue, eText, idElementxText){
var elementIdTextBul = document.getElementById(idElementxText);
if(elementIdTextBul){
elementIdTextBul.innerHTML = eText; 
send('store', 'set', 'settings.'+'user_agent', eValue);
}
}


/* İç İşlem Pencere Değiştir */
function openContentViews(contentID,tabsID){
//'content-views-1', 'content-tabs-1'
document.getElementById('content-views-1').style.display = "none";
document.getElementById("content-tabs-1").classList.remove('bEUiyY');
document.getElementById('content-views-2').style.display = "none";
document.getElementById("content-tabs-2").classList.remove('bEUiyY');
document.getElementById('content-views-3').style.display = "none";
document.getElementById("content-tabs-3").classList.remove('bEUiyY');
document.getElementById('content-views-4').style.display = "none";
document.getElementById("content-tabs-4").classList.remove('bEUiyY');
document.getElementById('content-views-5').style.display = "none";
document.getElementById("content-tabs-5").classList.remove('bEUiyY');
document.getElementById('content-views-6').style.display = "none";
document.getElementById("content-tabs-6").classList.remove('bEUiyY');
document.getElementById('content-views-7').style.display = "none";
document.getElementById("content-tabs-7").classList.remove('bEUiyY');

var elementIdBul_content = document.getElementById(contentID);
var elementIdBul_tabs = document.getElementById(tabsID);

if(elementIdBul_content && elementIdBul_tabs){
elementIdBul_content.style.display = "block";
elementIdBul_tabs.classList.add('bEUiyY');
}
}

/* Select Gibi Yeni Modal Pencere Aç */
function openPopupModals(idElementx,closeEvents){
var elementIdBul = document.getElementById(idElementx);
var elementIdCloseEv = document.getElementById('closedEventAd');

if(elementIdBul){ 
var displayElements = elementIdBul.style;
if(!closeEvents){
if(displayElements.display == 'none'){
displayElements.display = "block";
elementIdCloseEv.style.display = "block";
} else { 
displayElements.display = "none"; 
elementIdCloseEv.style.display = "none";
}
} else { if(displayElements.display == 'block'){ displayElements.display = "none"; elementIdCloseEv.style.display = "none"; } }
}
}

/* Açık Select Gibi Olan Modalları Kapat */
function closeEventBodyAll(){
openPopupModals('ust-cubuk',true);
openPopupModals('theme-color',true);
openPopupModals('search-engine',true);
openPopupModals('chs-lang',true);
openPopupModals('user-agent',true);
}

/* Üst Çubuk Varyant Değiştirme İşlemi */
function prossUstCubukVariant(eValue, eText, idElementxText){
var elementIdTextBul = document.getElementById(idElementxText);
if(elementIdTextBul){
elementIdTextBul.innerHTML = eText; 
send('store', 'set', 'settings.'+'headerView', eValue);
sendSync('loadHeaderViews');
window.location.reload(); 
}
}

/* Dil Değiştirme İşlemi */
function prossLangChanges(eValue, eText, idElementxText){
var elementIdTextBul = document.getElementById(idElementxText);
if(elementIdTextBul){
elementIdTextBul.innerHTML = eText; 
send('store', 'set', 'settings.'+'langs', eValue);
//sendSync('loadHeaderViews');
window.location.reload(); 
}
}

/* Tema Değiştirme İşlemi */
function prossTemaRengi(eValue, eText, idElementxText){
var elementIdTextBul = document.getElementById(idElementxText);
if(elementIdTextBul){
elementIdTextBul.innerHTML = eText;
send('store', 'set', 'settings.'+'theme', eValue);
sendSync('loadThemeNews');
xloadThemes();
//window.location.reload(); 
}
}

/* Arama Motoru Değiştirme İşlemi */
function prossSearchEngines(eValue, eText, idElementxText){
var elementIdTextBul = document.getElementById(idElementxText);
if(elementIdTextBul){
elementIdTextBul.innerHTML = eText; 
send('store', 'set', 'settings.'+'search_engine', eValue);
}
}

/* Kayıtlı Tüm Ayarları Çek Yazdır */
async function loadSettings () {
let saved = sendSync('store', 'get', 'settings');
for (let [key, val] of Object.entries(saved)) {
let element = document.getElementById(key);

if(!element) continue;
let control = element.lastElementChild;

if(control.className != 'item-control-2'){
if(control.tagName == 'SELECT') {control.value = val;}
if(control.tagName == 'INPUT') { control.checked = val; }
}

/* Çoklu Değişkene Sahip Ayarlar Burada Örnek; Başlangıç Ayarları */
if(control.className == 'item-control-2'){
var get_key = document.getElementById('new-'+key+'-'+val);
if(get_key){get_key.checked = true;}
}

if(control.tagName == 'DIV') {

/*Tema Ayarları Özel*/
if(key == "theme"){
var intextkeys = document.getElementById(key+'-text'); 
if(intextkeys){ 
var namevalueNew = '';
if(val == "default"){ namevalueNew = i18n.__('Varsayılan'); }
if(val == "grey"){ namevalueNew = i18n.__('Gri'); }
if(val == "midnightblue"){ namevalueNew = i18n.__('Gece Mavisi'); }
if(val == "black"){ namevalueNew = i18n.__('Siyah'); }
if(val == "beige-white"){ namevalueNew = i18n.__('Bej - Beyaz'); }

if(val == "yellow-white"){ namevalueNew = i18n.__('Sarı - Beyaz'); }
if(val == "green-white"){ namevalueNew = i18n.__('Yeşil - Beyaz'); }
if(val == "light-turquoise-white"){ namevalueNew = i18n.__('Açık Turkuaz - Beyaz'); }
if(val == "light-purple-white"){ namevalueNew = i18n.__('Açık Mor - Beyaz'); }
if(val == "pink-white"){ namevalueNew = i18n.__('Pembe - Beyaz'); }



if(val == "beige"){ namevalueNew = i18n.__('Bej'); }
if(val == "orange"){ namevalueNew = i18n.__('Turuncu'); }
if(val == "light-green"){ namevalueNew = i18n.__('Açık Yeşil'); }
if(val == "light-turquoise"){ namevalueNew = i18n.__('Açık Turkuaz'); }
if(val == "light-blue"){ namevalueNew = i18n.__('Açık Mavi'); }
if(val == "pink"){ namevalueNew = i18n.__('Pembe'); }
/*
if(val == "xxxx"){ namevalueNew = i18n.__('xxxx'); }
if(val == "xxxx"){ namevalueNew = i18n.__('xxxx'); }
if(val == "xxxx"){ namevalueNew = i18n.__('xxxx'); }
if(val == "xxxx"){ namevalueNew = i18n.__('xxxx'); }
if(val == "xxxx"){ namevalueNew = i18n.__('xxxx'); }
if(val == "xxxx"){ namevalueNew = i18n.__('xxxx'); }
*/


intextkeys.innerHTML = namevalueNew;
} 
}
/*Tema Ayarları Özel Son*/

/*Üst çubk header Ayarları Özel*/
if(key == "headerView"){
var intextkeys = document.getElementById(key+'-text'); 
if(intextkeys){ 
var namevalueNew = '';
if(val == "default"){ namevalueNew = i18n.__('Tam'); }
if(val == "compact"){ namevalueNew = i18n.__('Kompakt'); }
intextkeys.innerHTML = namevalueNew;
} 
}
/*Üst çubk header Ayarları Özel Son*/

/*Dil Ayarları Özel*/
if(key == "langs"){
var intextkeys = document.getElementById(key+'-text'); 
if(intextkeys){ 
var namevalueNew = val;
if(val == "tr"){ namevalueNew = 'Turkish'; }
if(val == "en"){ namevalueNew = 'English'; }
if(val == "ru"){ namevalueNew = 'Russian'; }
if(val == "de"){ namevalueNew = 'German'; }
if(val == "es"){ namevalueNew = 'Spanish'; }
if(val == "fr"){ namevalueNew = 'French'; }
intextkeys.innerHTML = namevalueNew;
} 
}
/*Dil Ayarları Özel Son*/

/*Arama Motoru Ayarları Özel*/
if(key == "search_engine"){
var intextkeys = document.getElementById(key+'-text'); 
if(intextkeys){ 
intextkeys.innerHTML = val;
} 
}
/*Arama Motoru Ayarları Özel Son*/

/*User Agent Ayarları Özel*/
if(key == "user_agent"){
var intextkeys = document.getElementById(key+'-text'); 
if(intextkeys){ 
intextkeys.innerHTML = val;
} 
}
/*User Agent Ayarları Özel Son*/

}

}
}

/* Ayarları Değiştir Kaydet İşlemleri Canlandırma Radio buton için value iç değer kaydetme */
async function bindControls2 (controls2) {
for (let control2 of controls2) {
let key2 = control2.parentElement.id;
control2.addEventListener('click', () => send('store', 'set', 'settings.'+key2, control2.value));
}
}
bindControls2(document.getElementsByClassName('item-control-2'));

/* Ayarları Değiştir Kaydet İşlemleri Canlandırma */
async function bindControls (controls) {
for (let control of controls) {
let key = control.parentElement.id;
if(control.tagName == 'SELECT') {
control.addEventListener('change', () => send('store', 'set', 'settings.'+key, control.value));
}	else {    
control.addEventListener('click', () => send('store', 'set', 'settings.'+key, control.checked));
}
}
}

bindControls(document.getElementsByClassName('item-control'));
loadSettings();

/* Bayrakları Döndür */
const getFlags = sendSync('store', 'get', 'flags').map(e => e);
/* Belirli Bir Div İçine Verileri Çek Yükle */
function loadDataFlags(oneID,twoID){
let panelEl = document.getElementById(oneID);
let options = getFlags.map(op => `
<div class="sc-l5yqk8 jInefD">
<div class="sc-v03tst epMHXf">${op}</div>
<div class="sc-ur64yn gINTBr" id="${op}">
<input id="${op}" disabled checked type="checkbox" class="switch item-control-x">
</div>
</div>
`).join('\n');
panelEl.innerHTML += `${ options }`;
}

loadDataFlags('flags','flags-text');
/* Bayrakları Döndür Son */

function clangto(op){
var namevalueNew = op;
if(op == "tr"){ namevalueNew = 'Turkish'; }
if(op == "en"){ namevalueNew = 'English'; }
if(op == "ru"){ namevalueNew = 'Russian'; }
if(op == "de"){ namevalueNew = 'German'; }
if(op == "es"){ namevalueNew = 'Spanish'; }
if(op == "fr"){ namevalueNew = 'French'; }
return namevalueNew;
}

/* Dilleri Döndür */
const getLangPacs = sendSync('store', 'get', 'langAllPack').map(e => e);
/* Belirli Bir Div İçine Verileri Çek Yükle */
function loadDataLangs(oneID,twoID){
let panelEl = document.getElementById(oneID);
let options = getLangPacs.map(op => 
`

<div class="sc-1k8lovv hJBLHH" onclick="prossLangChanges('${op}', '${op}', 'langs-text')">${clangto(op)}</div>
`).join('\n');
panelEl.innerHTML += `${ options }`;
}

loadDataLangs('chs-lang','langs-text');
/* Dilleri Döndür Son */


/* Herşeyi Sil Sıfırla */
document.getElementById('restclear').addEventListener('click', async e => {
var result = confirm(i18n.__('Bu uygulamaya ait herşey silinecektir. Tarama Verileri, Ayarlar, Geçmiş, İndirilenler. Herşey Fabrika Ayarına Dönecektir.'));
if(result) {
send('factoryReset');
}
else {
}
});

/* Sürüm Bilgileri */
function getUserAgent() {return navigator.userAgent;}
function setVersions(versions) {
document.getElementById('user-agentx').innerHTML = getUserAgent();
document.getElementById('chrome').innerHTML = versions.chrome;
document.getElementById('node').innerHTML = versions.node;
document.getElementById('electron').innerHTML = versions.electron;
document.getElementById('holla').innerHTML = versions.holla;
}
setVersions(sendSync('getVersions'));


async function openLoadURL (urls) {
window.location.href = urls;
}

async function openLoadURLEx (urls) {
sendSync('openPageNews', urls);
}

let leftMenuAffters = document.getElementById('ayarlar');
if(leftMenuAffters){ leftMenuAffters.classList.add('bEUiyY'); }

/* Git Infos */
var getJSON = function(url, callback) {
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.responseType = 'json';
xhr.onload = function() {
var status = xhr.status;
if (status === 200) {
callback(null, xhr.response);
} else {
callback(status, xhr.response);
}
};
xhr.send();
};
getJSON('https://api.github.com/repos/meforce/holla/releases/latest',
function(err, data) {
if (err !== null) {
document.getElementById('defaultSoftWare').style.display = 'block'; 
} else {
if(!data.draft){
document.getElementById('defaultSoftWare').style.display = 'none'; 
document.getElementById('GithubsSoftWare').style.display = 'block'; 
document.getElementById('hollaGen').innerText = sendSync('getVersions').holla;

document.getElementById('hollaYayiym').innerText = data.name;
if(data.body.trim()){ document.getElementById('dahamasosss').style.display = 'block';  }
document.getElementById('softhakkinda').innerHTML = data.body.replace(/\n/g, "<br />");

document.getElementById('githuburlss').innerHTML = `<a onclick="openLoadURLEx('${data.html_url}')">${data.html_url}</a>`;

if(data.name <= sendSync('getVersions').holla){ 
document.getElementById('sfotGuncelss').style.display = 'block'; 
document.getElementById('sfotGuncelssDegil').style.display = 'none'; 
document.getElementById('sfotGuncelss').innerHTML = `<div onclick="openLoadURLEx('${data.html_url}')" class="sc-v03tst epMHXf" id="sfotGuncelssx">${i18n.__('Sistem Güncel, Son Sürüm Kullanıyor')}</div>`; 
} else {
document.getElementById('sfotGuncelssDegil').style.display = 'block'; 
document.getElementById('sfotGuncelss').style.display = 'none'; 
document.getElementById('sfotGuncelssDegil').innerHTML = `<div onclick="openLoadURLEx('${data.html_url}')" class="sc-v03tst epMHXf" id="sfotGuncelssDegilx">${i18n.__('Sistem Güncel Değil, Yazılımı Güncelle!')}</div>`; 
}

} else {
document.getElementById('defaultSoftWare').style.display = 'block'; 
document.getElementById('GithubsSoftWare').style.display = 'none'; 
}
} 
});