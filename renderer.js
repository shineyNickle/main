//PACKAGES
const { remote } = require('electron');
const {
BrowserWindow,
nativeTheme,
ipcMain,
app,
Menu,
session,
dialog
} = remote;
//import { session } from 'electron';

//Depolama - STORAGE
const Store = require('electron-store');
window.store = new Store();

let windowxview = 0;
let windowxviewW = 0;

if(store.get('settings.leftbarmenu')){
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
if(document.querySelector('link[href="css/leftbarmenu.css"]')) document.querySelector('link[href="css/leftbarmenu.css"]').remove();
if(!document.querySelector('link[href="css/leftbarmenu.css"]')) document.head.innerHTML += '<link rel="stylesheet" href="css/leftbarmenu.css">';
}

//Dil Bağlantısı
//Language Connection
var i18n = new(require('./translations/i18n-ex'));

if(store.get('--incognitotab') == '--incognitotab'){
var newtabBased = 'gizli-yeni-sekme';
if(!document.querySelector('link[href="css/incognitotab.css"]')) document.head.innerHTML += '<link rel="stylesheet" href="css/incognitotab.css">';
setTimeout(()=>{ store.delete('--incognitotab') }, 1200);
} else {
var newtabBased = 'yeni-sekme';
}

const {	ipcRenderer, shell } = require('electron');

const isDevMode = require('electron-is-dev');

const fs = require('fs');

require('electron').ipcMain = ipcMain;
require('v8-compile-cache');
const { join } = require('path');

const { ElectronBlocker } = require('@cliqz/adblocker-electron');
let { fetch } = require('cross-fetch');

const path = require('path');
const os = require('os');

const tabs = require('./js/tabs.js');
const storage = require('./js/store.js');
const shortcuts = require('./js/shortcuts.js');
const web = require('./js/web.js');

window.search = require('./js/search.js');
window.tabs = tabs;

function searchBounds () {
let winBounds = remote.getCurrentWindow().getBounds();
let bounds = {};

let navCenter = document.getElementById('nav-center');

bounds.x = Math.ceil(navCenter.getBoundingClientRect().left + window.scrollX);
bounds.y = Math.ceil(navCenter.getBoundingClientRect().top + window.scrollY
+ parseFloat(getComputedStyle(navCenter, null).height.replace("px", ""))) + 5;
bounds.width = Math.floor(parseFloat(getComputedStyle(navCenter, null).width.replace("px", "")));
bounds.height = 240;

if(winBounds.x >= 0) bounds.x += winBounds.x;
if(winBounds.y >= 0) bounds.y += winBounds.y;

return bounds;
};

search.initialize(searchBounds());

if (!store.get('settings.search_engine')) {
store.set('settings.search_engine', 'Google');
}
if (!store.get('settings.theme')) {
store.set('settings.theme', 'default');
}
if (!store.get('settings.newTab')) {
store.set('settings.newTab', { items: ['https://www.instagram.com', 'https://www.google.com', 'https://youtube.com', 'https://facebook.com', 'https://netflix.com', 'https://twitter.com'] });
}

if (!store.get('settings.newTabWallpaper')) {
store.set('settings.newTabWallpaper', { name: 'Kevin Lanceplaine',username: 'lanceplaine',html: 'https://unsplash.com/photos/sO-JmQj95ec',backgroundTheme: 'https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTk5NDl8MHwxfHNlYXJjaHwzMHx8bmF0dXJlfGVufDB8MHx8fDE2MzEzNzM4OTQ&ixlib=rb-1.2.1&q=80&w=1080' });
}

if (!store.get('settings.ssCache')) {
store.set('settings.ss', true);
store.set('settings.ssCache', true);
}
if (!store.get('settings.headerView')) {
store.set('settings.headerView', 'compact');
}
if (!store.get('settings.starter')) {
store.set('settings.starter', '1');
}
if (!store.get('settings.topbarHeight')) {
store.set('settings.topbarHeight', 70);
}
if (!store.get('settings.dowloadnAltPencereCache')) {
store.set('settings.dowloadnAltPencere', true);
store.set('settings.dowloadnAltPencereCache', true);
}

if (!store.get('vpn-proxy-ip')) {
store.set('vpn-proxy-ip', '69.197.181.202:3128');
}
if (!store.get('vpn-proxy-data')) {
store.set('vpn-proxy-data', [
{ id: 1, name: 'Canada', co: 'Canada ', ip: '66.70.198.229', port:'999', protocol:'HTTPS', connection: '66.70.198.229:999', security:'no' },
{ id: 2, name: 'France', co: 'France', ip: '51.81.35.3', port:'8080', protocol:'HTTPS', connection: '51.81.35.3:8080', security:'no' },
{ id: 3, name: 'European-Union', co: 'European-Union', ip: '69.197.181.202', port:'3128', protocol:'HTTPS', connection: '69.197.181.202:3128', security:'no' },
{ id: 4, name: 'United-States', co: 'United-States', ip: '3.133.88.64', port:'9000', protocol:'HTTPS', connection: '3.133.88.64:9000', security:'no' }
//{ name: 'xx', co: 'xx', ip: 'xx', port:'xx', protocol:'HTTPS', connection: 'xx', security:'no' }
]);
}
//proxyRules:"http://username:password@proxyIp:proxyPort"

if (!store.get('extensions')) {
let data = {
alexsa: true, vpn: true
};
store.set('extensions', data);
}

if (!store.get('searchEngines')) {
store.set('searchEngines', [
{ name: 'Google', url: 'https://google.com/search?q=' },
{ name: 'Yandex', url: 'https://yandex.com/search/?text=' },
{ name: 'Yaani', url: 'https://yaani.com/#q=' },
{ name: 'DuckDuckGo', url: 'https://duckduckgo.com/?t=yaani&q=' },
{ name: 'Startpage', url: 'https://startpage.com/do/metasearch.pl?query=' },
{ name: 'Bing', url: 'https://www.bing.com/search?q=' }
]);
}

//if (!store.get('blocked')) store.set('blocked', 0);
store.set('blocked', 0);

if (!store.get('permissions')) store.set('permissions', {});
if (!store.get('flags')) store.set('flags', [
'--enable-smooth-scrolling',
'--dns-prefetch-disable',
'--no-pings',
'--no-referrers',
'--no-crash-upload',
'--no-default-browser-check',
'--disable-breakpad',
'--disable-plugins',
'--https-only',
'--ppapi-flash-path',
'--webrtc-internals',
'--webrtc-capture-multi-channel-audio-processing',
'--webrtc-remote-event-log',
'--webrtc-hybrid-agc',
'--media-session-webrtc',
'autoplay-policy',
'no-user-gesture-required',
'--global-media-controls-for-cast',
'--enable-media-internals',
'--load-media-router-component-extension',
'--media-router-cast-allow-all-ips',
'--cast-media-route-provider',
'--global-media-controls-cast-start-stop',
'--allow-all-sites-to-initiate-mirroring'
]);

web.init(document);
shortcuts.init(keyboardShortcut, n => { if (tabs.tabs[n-1]) tabs.activate(tabs.tabs[n-1]) });

console.colorLog = (msg, color) => { console.log('%c' + msg, 'color:' + color + ';font-weight:bold;') }

const { version } = require('./package.json');
const { param } = require('jquery');
const { send } = require('process');

exports.getTabCount = async () => tabs.tabs.length;
exports.getTabCountCacheNum = function () { store.set('tabslengthOnlys', tabs.tabs.length) }


exports.sidebarlefts = function () {
return store.get('settings.sidebar');
}

exports.setDataSideBar = function (item) {
createLeftMenuAres(item);
}


exports.showAlert = showAlert;

window.theme = 'light';

let alertWin, certDialog;

window.darkMode = nativeTheme.shouldUseDarkColors || false;

ipcMain.on('alert', async (e, data) =>
showAlert(data, r => {
e.returnValue = r;
})
);

let dfullscrennss; 
//fullscrenndoms();
ipcMain.on('fullscreenchange', async (e) =>{
dfullscrennss.show(); 
setTimeout(() => {
dfullscrennss.hide();
remote.getCurrentWindow().focus();
}, 450);
});

ipcMain.on('flags.js', async function(e, action, data) {
let flags = store.get('flags');

if (action == 'set') {
store.set('flags', data);
} else {
e.returnValue = flags;
}
});

ipcMain.on('getBookmarks', async e => { e.returnValue = (await storage.getBookmarks()) });
ipcMain.on('removeBookmark', async (e, id) => {
storage.removeBookmark(id);
console.log('b', id);
genelKitaplikDataPross();
});
ipcMain.on('clearBookmark', async () => storage.clearBookmark());

ipcMain.on('getHistory', async e => { e.returnValue = (await storage.getHistory()) });
ipcMain.on('clearHistory', async () => storage.clearHistory());
ipcMain.on('removeHistoryItem', async (e, id) => storage.removeHistoryItem(id));

/* şifre kaydetme işlemleri */
ipcMain.on('getSaveInfoXcont', async e => { e.returnValue = (await storage.getSaveInfoXcont()) });
ipcMain.on('clearSaveInfoXcont', async () => storage.clearSaveInfoXcont());
ipcMain.on('removeSaveInfoXcontItem', async (e, id) => storage.removeSaveInfoXcontItem(id));
ipcMain.on('logSaveInfoXcont', async (e, site, title, pass, loginurl) => {
storage.isgetSaveInfoXconted(site, title, pass).then(isgetSaveInfoXconted => {
if (isgetSaveInfoXconted) {} else { autoFills(site, title, pass, loginurl); }
});
}
);
ipcMain.on('logSaveInfoXcontSaves', async (e, site, title, pass, loginurl) => {
storage.isgetSaveInfoXconted(site, title, pass).then(isgetSaveInfoXconted => {
if (isgetSaveInfoXconted) {} else { storage.logSaveInfoXcont(site, title, pass, loginurl); }
});
}
);
/* şifre kaydetme işlemleri son */

/* sekme sabitleme işlemleri */
ipcMain.on('logtabsPins', async (e, site,id) => { 
if(newtabBased == 'gizli-yeni-sekme'){
} else {
storage.isgettabsPins(id).then(isgettabsPins => {
if (isgettabsPins) { storage.removetabsPins(id); } else { storage.logtabsPins(site,id); }
});
}
}
);
ipcMain.on('gettabsPins', async e => { e.returnValue = (await storage.gettabsPins()) });
ipcMain.on('cleartabsPins', async () => storage.cleartabsPins());
ipcMain.on('removetabsPins', async (e, id) => storage.removetabsPins(id));
/* sekme sabitleme işlemleri son */

ipcMain.on('getDownloads', async e => { e.returnValue = (await storage.getDownloads()) });
ipcMain.on('clearDownloads', async () => storage.clearDownloads());
ipcMain.on('removeDownloads', async (e, id) => storage.removeDownloads(id));

ipcMain.on('getShellGo', async (e, url) => shell.openPath(url.replace(/\\/g, "/")));

ipcMain.on('cacheURLClicks', async (e, url, type) => { 
if(type == 'get'){
e.returnValue = store.get('cacheURLClicks');
}
if(type == 'set'){
store.set('cacheURLClicks', url);
setTimeout(() => {
store.set('cacheURLClicks', '');
}, 500);
}
});

ipcMain.on('newTab', async function(e, action, extra) {
if (action == 'focusSearchbar') {
let urlEl = document.getElementById('url');
urlEl.val = '';
urlEl.focus();
urlEl.select();
} else if (action == 'saveItem') {
let items = store.get('settings.newTab.items');
items[extra.id] = extra.domain;
store.set('settings.newTab.items', items);
} else if (action == 'loadItems') {
e.returnValue = store.get('settings.newTab.items');
} else if (action == 'getBackgroundTheme') {
e.returnValue = store.get('settings.newTab.backgroundTheme');
} else if (action == 'setBackgroundTheme') {
store.set('settings.newTab.backgroundTheme', extra);
}
});

ipcMain.on('newTabWallpaper', async function(e, action, items) {
if (action == 'getshow') {
e.returnValue = store.get('settings.newTabWallpaper');;
} 

if (action == 'saveItem') {
store.set('settings.newTabWallpaper', items);
}

});

/* bird */
ipcMain.on('addPocoLoginData', async function(e, action, items) {
if (action == 'getshow') {
e.returnValue = store.get('settings.addPocoLoginData');;
} 

if (action == 'saveItem') {
store.set('settings.addPocoLoginData', items);
}
});

ipcMain.on('logbird', async (e, roomid, roomname, roomavatar, roompassword, roomcreateusername, type) => { 
await storage.isgetbird(roomid).then(isgetbird => {
if (isgetbird) { } else { storage.logbird(roomid, roomname, roomavatar, roompassword, roomcreateusername, type); }
});
}
);
ipcMain.on('checklogbird', async (e, roomid) => {
e.returnValue = (await storage.gettbirdNoId(roomid)); 
});
ipcMain.on('getbird', async e => { e.returnValue = (await storage.getbird()) });
ipcMain.on('clearbird', async () => storage.clearbird());
ipcMain.on('removebird', async (e, id) => storage.removebird(id));


/* Sistem Ayarları Kaydet Ve Geri Dönüş İşlemleri */
ipcMain.on('store', async (e, purpose, name, value) => {
if (purpose == 'set') {
store.set(name, value);

/* left sidebar */
if(name == 'settings.leftbarmenu'){
leftbarmenu();
}

/* Anasayfa Button Göster Kapat */
if(name == 'settings.home'){
if(value){ document.getElementById("home").style.display = "flex"; } else { document.getElementById("home").style.display = "none"; }
}

/* Dil Güncelle */
if(name == 'settings.langs'){
setTimeout(async function() {}, 1000);
app.relaunch();
app.quit();
app.exit();
}
/* Arama Motoru Güncelle */
if(name == 'settings.search_engine'){
setSearchEngine();
}

/* user agent Güncelle */
if(name == 'settings.user_agent'){
app.relaunch();
app.quit();
app.exit();
}

/* Eklenti Aktif Pasif */
var exmodules = name.split(".");
if(exmodules[0] == 'extensions'){
loadUzatilar();
if(value){ document.getElementById(exmodules[1]).style.display = "flex"; } else { document.getElementById(exmodules[1]).style.display = "none"; }
}

/* Kaydedilenleri Göster Kapat */
if(name == 'settings.bookmarkViews'){
//if(value){  } else { }
ipcRenderer.send('bookmarksonaktif');
}

} else {
e.returnValue = store.get(name);
}
});

/* Ayarlar Genel Eklentileri Aktif Et */
ipcMain.on('settingsViewStatusSet', async (e, action) => {
/* Anasayfa Button Göster */
if(action == 'home'){ 
if(store.get('settings.home')){
document.getElementById("home").style.display = "flex";
}
}
/* Anasayfa Button Göster Son */

/* Arama Önerileri Göster */
if(action == 'ss'){e.returnValue = store.get('settings.ss');}
/* Arama Önerileri Göster Son */
});

/* Bookmarks Kaydedilenleri Ekranda Göster */
ipcMain.on('bookmarksonaktif', async (e) => {
e.returnValue = 'true'; genelKitaplikEkle();
});
/* Kaydelilenler Url Git */
ipcMain.on('openLoadUrlGoBooks', async (e, url) => {
e.returnValue = 'true'; tabs.newView(url);
});

ipcMain.on('siteInfo', async (e, action) => {
switch (action) {
case 'Certificate':
let host = new URL(tabs.current().webContents.getURL()).host;

let https = require('https');
let options = {
host: host,
port: 443,
method: 'GET'
};

let req = https.request(options, res => {
let cert = res.connection.getPeerCertificate();
showCertificateDialog(cert);
});

req.on('error', () => {
showAlert({
type: 'alert',
message: i18n.__('Sitenin SSL sertifikası yok yada geçersiz bir SSL sertifikası kullanıyor.'),
url: 'Nickel'
});
});

req.end();
break;
case 'site-info':
let host_1 = new URL(tabs.current().webContents.getURL()).host;

let https_1 = require('https');
let options_1 = {
host: host_1,
port: 443,
method: 'GET'
};

let req_1 = https_1.request(options_1, res_1 => {
let cert_1 = res_1.connection.getPeerCertificate();
toggleSiteInfo(cert_1);
});

req_1.on('error', () => {
if(!tabs.current().webContents.getURL().includes('Nickel://')){toggleSiteInfo(false);}
});

req_1.end();
break;

case 'realseUpdateInfo':
var urlGetInfoRealse = store.get('stroe_au_releaseInfo');
tabs.newView('https://github.com/shineyNickle/main/releases/tag/v'+urlGetInfoRealse.version);
break;

case 'adsBlockInfos':
tabs.newView('https://en.wikipedia.org/wiki/AdBlock');
break;

case 'certifikasInfos':
tabs.newView('https://en.wikipedia.org/wiki/HTTPS');
break;

case 'Cookies':
cookies()
.then(cookies => {
console.log(cookies);
})
.catch(console.error);
break;
case 'Site Settings':
break;
default:
}
});

ipcMain.on('shield-toggle', async (e,val) => (e.returnValue = 'true', changeAdBlock(val)));

ipcMain.on(
'getBlockCount',
async e => (e.returnValue = tabs.current().webContents.session.ads_blocked)
);

ipcMain.on(
'getVersions',
async e => (e.returnValue = { ...process.versions, Nickel: version, env: process.env })
);

ipcMain.on('getThemes', async e =>
require('fs').readdir(join(__dirname, 'css/themes'), (err, files) => {
let result = [];
for (let file of files) {
if (file.endsWith('.css')) {
let theme = file.replace('.css', '');
result.push(theme[0].toUpperCase() + theme.slice(1));
}
}
e.returnValue = result;
})
);

ipcMain.on('getTheme', async e => (e.returnValue = window.theme));
ipcMain.on('getDarkmode', async e => (e.returnValue = window.darkMode));

// Sayfa Kaynağını Görüntüle Ön Bellek Logları
ipcMain.on('viewSourceURL', async e => (e.returnValue = store.get('viewSourceURL'), store.delete('viewSourceURL')));
ipcMain.on('viewSourceMAINCode', async e => (e.returnValue = store.get('viewSourceMAINCode'), store.delete('viewSourceMAINCode')));

//Güncelleme Ön Bellek Logları
ipcMain.on('st_au_app_download', async e => (e.returnValue = store.get('stroe_au_app_download')));
ipcMain.on('st_update_downloaded', async e => (e.returnValue = store.get('stroe_update_downloaded')));
ipcMain.on('st_au_releaseInfo', async e => (e.returnValue = store.get('stroe_au_releaseInfo')));

//Ayarlar Tema, Üst Header Güncelleme
ipcMain.on('loadThemeNews', async e => (e.returnValue = 'true',loadTheme()));
ipcMain.on('loadHeaderViews', async e => (e.returnValue = 'true',loadHeaderViews()));

//Gerçerli Sekmedeki Url Çek
ipcMain.on('getCurrentURLTabss', async e => (e.returnValue = tabs.current().webContents.getURL()));

/* Tüm Yapıyı Yeniden Boyutlandır Verilen Üst Ölçüye Göre -> Çağır */
ipcMain.on('newTopBarOlcus', async (e) => {
e.returnValue = 'true'; windowPageAllResize();
});

ipcMain.on('dowloandsHEdef', async (e) => {
e.returnValue = store.get('appGetPath');
});

//vpn data
ipcMain.on('vpndata', async (e) => {
e.returnValue = store.get('vpn-proxy-data');
});

ipcMain.on('vpnproxyip', async e => (e.returnValue = store.get('vpn-proxy-ip')));

ipcMain.on('changevpn', async (e,value) => {
store.set('vpn-proxy-ip', value);
var proxyList = value;
tabs.current().webContents.session.setProxy({
proxyRules: proxyList,
pacScript: undefined,
proxyBypassRules: 'localhost'
}, () => {});
});

ipcMain.on('vpnproxyopendstatus', async e => (e.returnValue = store.get('vpn-proxy-opend')));

ipcMain.on('vpnproxyopend', async (e) => {
var vpnproxyopend = store.get('vpn-proxy-opend');
if(vpnproxyopend){
document.getElementById('vpnimagevpn').src = join(__dirname, 'static/extensions/vpn/Holla-VPN-Closed.png');
store.set('vpn-proxy-opend', false);
var proxyList = '';
tabs.current().webContents.session.setProxy({
proxyRules: proxyList,
pacScript: undefined,
proxyBypassRules: 'localhost'
}, () => {});
} else {
document.getElementById('vpnimagevpn').src = join(__dirname, 'static/extensions/vpn/Holla-VPN.png');
store.set('vpn-proxy-opend', true);
var proxyList = store.get('vpn-proxy-ip');
tabs.current().webContents.session.setProxy({
proxyRules: proxyList,
pacScript: undefined,
proxyBypassRules: 'localhost'
}, () => {});
}
});
//vpn-proxy-opend


ipcMain.on('savePermission', async (e, site, permission, allowed) => {
savePermission(site, permission, allowed);
tabs.current().webContents.reload();
});

//Kullanılan Dil Kodunu Al
ipcMain.on('langCodeCache', async (e) => {
e.returnValue = store.get('settings.langs');
});

//Dil Dosyalarını Bul Ve Döndür, Veri Kaydet
ipcMain.on('langAllPack', async (e) => {
e.returnValue = store.get('langAllPack');
});

async function langAllPackFunc(){
var arrayDataLangsox = [];
var transKlasorx = join(__dirname, 'translations/lang');
fs.readdir(transKlasorx, (err, files) => {
files.forEach(file => {
var langcodedisx = file.replace(".js", "");
arrayDataLangsox.push(langcodedisx);
});
store.set('langAllPack', arrayDataLangsox);
});
}
langAllPackFunc();

//Eklenti Dosyalarını Çek
ipcMain.on('exiPackeLoadData', async (e) => {
e.returnValue = store.get('exiPackeLoadData');
});

//Eklenti Dosyalarını Bul Ve Döndür, Veri Kaydet
async function pluginDatafind(){
var arrayDataExis = [];
var transKlasor = join(__dirname, 'static/extensions');
fs.readdir(transKlasor, (err, files) => {
files.forEach(file => {
arrayDataExis.push(file);
});
store.set('exiPackeLoadData', arrayDataExis);
});
}
pluginDatafind();

//Uygulamayı Sıfırla - Full Reset Clean
ipcMain.on('factoryReset', async (e) => {
e.returnValue = 'true'; 

session.defaultSession.flushStorageData();
session.defaultSession.clearCache();
session.defaultSession.clearStorageData();
session.defaultSession.cookies.flushStore();

store.clear();
storage.clearHistory();
storage.clearDownloads();
storage.clearBookmark();
storage.clearSaveInfoXcont();
storage.cleartabsPins();
storage.clearbird();
app.relaunch();
app.quit();
app.exit();
});

var serachmotorname;
getSearchEngine(async e => { 
if(e.name == 'Google'){
serachmotorname = i18n.__('google_txt_key'); 
} else {
serachmotorname = i18n.__('Ara')+` ${e.name} `+i18n.__('yada url dene'); 
}
});

//Arama moturu adı çek
ipcMain.on('getsearchenginenames', async (e) => {
e.returnValue = serachmotorname;
});


ipcMain.on('ckode40', async (e, bulsssinnerText) => {
document.getElementById('url').focus();
document.getElementById('url').value = '';
setTimeout(() => {
document.getElementById('url').value = bulsssinnerText;
}, 10);
});

ipcMain.on('ckode38', async (e, bulsssinnerText) => { 
document.getElementById('url').focus();
document.getElementById('url').value = '';
setTimeout(() => {
document.getElementById('url').value = bulsssinnerText;
}, 10);
});

async function keyboardShortcut(shortcut) {
switch (shortcut) {
case 'browserDevTools':
remote.getCurrentWindow().openDevTools({ mode: 'detach' });
break;
case 'devTools':
if(!tabs.current().webContents.getURL().includes('holla://') && !isDevMode) tabs.current().webContents.openDevTools({ mode: 'right' });
if(isDevMode) tabs.current().webContents.openDevTools({ mode: 'right' });
break;
case 'nextTab':
tabs.nextTab();
break;
case 'backTab':
tabs.backTab();
break;
case 'newTab':
tabs.newView();
break;
case 'newWindow':
document.getElementById('newWindowsOpens').click();
break;
case 'newWindowGizli':
document.getElementById('newIncognitoWindowsOpens').click();
break;
case 'closeTab':
tabs.close();
break;
case 'openClosedTab':
tabs.openClosedTab();
break;
case 'zoomIn':
tabs.current().webContents.zoomFactor += 0.1;
break;
case 'zoomOut':
tabs.current().webContents.zoomFactor -= 0.1;
break;
case 'resetZoom':
tabs.current().webContents.zoomFactor = 1;
break;
case 'focusSearchbar':
document.getElementById('url').focus();
document.getElementById('url').select();
break;
case 'backPage':
tabs.current().webContents.goBack();

if (tabs.current().webContents.canGoBack()) { document.getElementById('back').removeAttribute('disabled') }
else { document.getElementById('back').setAttribute('disabled', true) }
if (tabs.current().webContents.canGoForward()){ document.getElementById('forward').removeAttribute('disabled') }
else{ document.getElementById('forward').setAttribute('disabled', true) }
break;
case 'forwardPage':
tabs.current().webContents.goForward();

if (tabs.current().webContents.canGoBack()) { document.getElementById('back').removeAttribute('disabled') }
else { document.getElementById('back').setAttribute('disabled', true) }
if (tabs.current().webContents.canGoForward()) { document.getElementById('forward').removeAttribute('disabled') }
else{ document.getElementById('forward').setAttribute('disabled', true) }
break;
case 'savePage':
tabs.savePage(tabs.current().webContents);
break;
case 'refreshPage':
tabs.current().webContents.reload();
break;
case 'forceReload':
tabs.current().webContents.reloadIgnoringCache();
break;
case 'restart':
app.relaunch();
app.exit(0);
break;
case 'scrollToTop':
tabs
.current()
.webContents.executeJavaScript(
`window.scrollTo({ top: 0, behavior: 'smooth' })`
);
case 'openHistory': tabs.newView('Nickel://gecmis'); break;
case 'openBookmarks': tabs.newView('Nickel://yer-imleri'); break;
case 'openSettings': tabs.newView('Nickel://ayarlar'); break;
default:
break;
}
}

//ipcMain.on('loadPage', async (e, a) => loadPage(a));
ipcMain.on('loadPage', async (e,a) => (e.returnValue = 'true', loadPage(a)));

ipcMain.on('openPage', async (e, a) => tabs.newView(a));
ipcMain.on('openPageNews', async (e,a) => (e.returnValue = 'true', tabs.newView(a)));

ipcMain.on('loadTheme', async () => loadTheme());

ipcMain.on('viewAdded', async () => {
if(!store.get('loadEnableAdBlockings')){
enableAdBlocking(); 
store.set('loadEnableAdBlockings', true);
}
pageZoomInOutALL();
tabs
.current()
.webContents.session.setPermissionRequestHandler(handlePermission);
});

/* Yeni Menü İşlemleri */
ipcMain.on('newWinOpenTabs', async (e, a) => keyboardShortcut('newTab'));
ipcMain.on('newWinOpenSettings', async (e, a) => tabs.newView('Nickel://ayarlar'));
ipcMain.on('newWinOpenHistory', async (e, a) => tabs.newView('Nickel://gecmis'));
ipcMain.on('newWinOpenBookMarks', async (e, a) => tabs.newView('Nickel://yer-imleri'));
ipcMain.on('newWinOpenDowloand', async (e, a) => tabs.newView('Nickel://indirilenler'));
ipcMain.on('newWinOpenHakkinda', async (e, a) => tabs.newView('Nickel://versiyon'));
ipcMain.on('newWinOpenExits', async (e, a) => app.exit());

//Auto Fill
async function autoFills(site, title, pass, loginurl) {
var autofillss = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
width: 320,
height: 330,
x: Math.ceil(document.getElementById('bookmark').getBoundingClientRect().left + window.screenX)-280,
y: Math.ceil(document.getElementById('bookmark').getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(document.getElementById('bookmark'), null).height.replace("px", ""))),
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

var autodatafill = [{ xsite: site, xtitle: title, xpass: pass, xloginurl: loginurl }];
let paramsx = encodeURIComponent(JSON.stringify(autodatafill));
autofillss.loadURL(
require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/autofill.html'),
protocol: 'file:',
slashes: true
}) +
'?' +
paramsx
);

autofillss.on('blur', () => {
if(autofillss) autofillss.close();
autofillss = null;
remote.getCurrentWindow().focus();
remote.getCurrentWindow().focus();
});

autofillss.on('close', () => {
autofillss = null;
remote.getCurrentWindow().focus();
remote.getCurrentWindow().focus();
});

}

// ADBLOCK
async function enableAdBlocking() {
let tone = window.theme === 'dark' ? 'dark' : 'light';
document.getElementById('shieldIMG').src = 'images/loading-' + tone + '.gif';
let session = tabs.current().webContents.session;

var uzantiADsBlocks = join(__dirname, 'static/module/adblock/easylist.txt');
ElectronBlocker.parse(fs.readFileSync(uzantiADsBlocks, 'utf-8'));
/*
ElectronBlocker.fromLists(fetch, ['https://easylist.to/easylist/easylist.txt']);
*/
ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
document.getElementById('shieldIMG').src = 'images/Holla-Shield.svg';
session.adblockSystemStatus = true;
this.ns_ads_blocker = blocker; 
this.ns_ads_blocker.enableBlockingInSession(session); 
blocker.on('request-blocked', async (e) => {
//session.ads_blocked = 0; store.set('blocked', 0); 
store.set('blocked', store.get('blocked') + 1);
session.ads_blocked = session.ads_blocked + 1;
//document.getElementById('adBlockNumsx').innerHTML = session.ads_blocked;
});
});
}

async function disableAdBlocking() {
let session = tabs.current().webContents.session;
/*
ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
blocker.disableBlockingInSession(session);
});
*/
session.adblockSystemStatus = false;
this.ns_ads_blocker.disableBlockingInSession(session);
}

async function changeAdBlock(enabled) {
if (enabled) {
enableAdBlocking();
} else {
disableAdBlocking();
}
toggleAdblockReloadPage(enabled);
}

async function toggleAdblockReloadPage(enabled) {
let tone = window.theme === 'dark' ? 'dark' : 'light';
document.getElementById('shieldIMG').src = 'images/loading-' + tone + '.gif';

setTimeout(async function() {
//let suffix = window.theme === 'dark' ? '-White' : '';
let suffix = enabled ? '' : '-Empty';
document.getElementById('shieldIMG').src = 'images/Holla-Shield' + suffix + '.svg';
tabs.current().webContents.reload();

let length = tabs.tabs.length; 
if (length == 1) {
let cachetabs = tabs.current().webContents.getURL();
tabs.newView(cachetabs);
tabs.backTab(); tabs.close();
} else {
let cachetabs = tabs.current().webContents.getURL();
store.set('cacheGetLiURL', cachetabs);
tabs.close();
tabs.newView(store.get('cacheGetLiURL'));
}

}, 3000);
}

async function toggleAdblock() {
let adblock = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
width: 320,
height: 230,
x: Math.ceil(document.getElementById('shield').getBoundingClientRect().left + window.screenX)-285,
y: Math.ceil(document.getElementById('shield').getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(document.getElementById('shield'), null).height.replace("px", ""))),
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

let address = require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/shields.html'),
protocol: 'file:',
slashes: true
});

adblock.focus();

adblock.webContents.once('dom-ready', async () => {  
//let suffix = window.theme === 'dark' ? '-White' : '';
let suffix = '-Empty';
let enabled = !document.getElementById('shieldIMG').src.endsWith('images/Holla-Shield' + suffix + '.svg');
adblock.webContents.send('count', tabs.current().webContents.session.ads_blocked, enabled);
});

adblock.on('blur', async () => {
adblock.close();
});

adblock.loadURL(address);
}

// THEMES
async function loadTheme() {
if(newtabBased == 'gizli-yeni-sekme'){

} else {

let themeObj = store.get('settings.theme');
if(themeObj){ themeObj = themeObj.toLowerCase(); }

if (document.querySelector('head link[href*="css/themes"]')) document.querySelector('head link[href*="css/themes"]').remove();
document.head.innerHTML += '<link rel="stylesheet" href="css/themes/'+themeObj+'.css">';
window.theme = themeObj;

if (themeObj == 'default') {}
if (themeObj == 'black') {}

}
}
loadTheme();

// Ust Header Tasarım
async function loadHeaderViews() {
let HeaderObj = store.get('settings.headerView');
if(HeaderObj){ HeaderObj = HeaderObj.toLowerCase(); }
if(HeaderObj == 'compact'){
if(!document.querySelector('link[href="css/newbars.css"]')) document.head.innerHTML += '<link rel="stylesheet" href="css/newbars.css">';
}
if(HeaderObj == 'default'){
if(document.querySelector('link[href="css/newbars.css"]')) document.querySelector('link[href="css/newbars.css"]').remove();
}
}
loadHeaderViews();

// ALERTS
async function initAlert() {
let screenSize = { width: window.outerWidth, height: window.outerHeight };
let args = {
frame: false,
resizable: false,
skipTaskbar: true,
x: screenSize.width / 2 - 450 / 2,
y: 50,
width: 450,
height: 150,
show: false,
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
},
parent: remote.getCurrentWindow(),
icon: join(__dirname, 'images/holla.png')
};

alertWin = new BrowserWindow(args);

alertWin.webContents.session.protocol.registerFileProtocol('assets', (req, cb) => {
let url = req.url.replace(new URL(req.url).protocol, '');

if(url.includes('..')) {
cb(join(__dirname, 'css/favicon.png'));
} else {
cb(join(__dirname, 'css/', url));
}
}, () => {});

let address = require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/alert.html'),
protocol: 'file:',
slashes: true
});

alertWin.loadURL(address);
// alertWin.openDevTools({ mode: 'detach' });
alertWin.on('page-title-updated', async () => {
alertWin.show();
});
}

 
async function fullscrenndoms() {
let screenSize = { width: window.outerWidth, height: window.outerHeight };
let argsx = {
frame: false,
resizable: false,
skipTaskbar: true,
transparent: true,
x: screenSize.width / 2 - 300 / 2,
y: 50,
width: 300,
height: 51,
show: false,
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
},
parent: remote.getCurrentWindow(),
icon: join(__dirname, 'images/holla.png')
};

dfullscrennss = new BrowserWindow(argsx);

let address = require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/modal/fullscreenchange.html'),
protocol: 'file:',
slashes: true
});

dfullscrennss.on('blur', () => {
//dfullscrennss.close();
dfullscrennss.hide();
//siteInfo = null;
});

dfullscrennss.on('close', () => {
//dfullscrennss = null;
dfullscrennss.hide();
});

dfullscrennss.loadURL(address);
//dfullscrennss.show();  
}

async function showAlert(data, callback) {
let params = { ...data, bg: window.theme };

alertWin.webContents.send('load', params);
alertWin.show();

switch (data.type) {
case 'prompt':
alertWin.setBounds({ height: 200 });
ipcMain.once('alert-reply', (e, r) => {
callback(r);
alertWin.setBounds({ height: 130 });
});
break;
case 'confirm':
ipcMain.once('alert-reply', (e, r) => {
callback(r);
});
break;
default:
break;
}

alertWin.focus();
alerted = false;
}

// SEARCHING
async function getSearchEngine(cb) {
let searchEngine = store.get('settings.search_engine');
let engines = store.get('searchEngines');
for (let engine of engines) {
if (engine.name == searchEngine) cb(engine);
}
}

async function loadPage(val) {
document.getElementById('url').blur();
try {
new URL(val);

if(val == 'Nickel://yeni-sekme'){
tabs.current().webContents.loadURL(require('url').format({
pathname: join(__dirname, 'static/pages/yeni-sekme.html'),
protocol: 'file:',
slashes: true
}));
} else {
if(val == 'Nickel://bird'){
tabs.current().webContents.loadURL(require('url').format({
pathname: join(__dirname, 'static/pages/bird.html'),
protocol: 'file:',
slashes: true
}));
} else {
tabs.current().webContents.loadURL(val);
store.set('cacheURLClicks', val);
}
}


} catch (e) {
if (val.includes('.') && !val.includes(' ')) {
if(newtabBased == 'gizli-yeni-sekme'){} else{
document.getElementById('url').value = val;
}
tabs.current().webContents.loadURL('https://' + val);
store.set('cacheURLClicks', 'https://' + val);
} else if (
val.includes('://') ||
val.startsWith('data:') ||
(val.startsWith('localhost:') && !val.includes(' '))
) {
if(newtabBased == 'gizli-yeni-sekme'){} else{
document.getElementById('url').value = val;
}

tabs.current().webContents.loadURL(val);
store.set('cacheURLClicks', val);

} else {
getSearchEngine(async function(engine) {
if(newtabBased == 'gizli-yeni-sekme'){} else{
document.getElementById('url').value = engine.url + val;
}
tabs.current().webContents.loadURL(engine.url + val);
store.set('cacheURLClicks', engine.url + val);
});
}
}


setTimeout(() => {store.set('cacheURLClicks', '');}, 500);
}

// SNACKBAR
async function showSnackbar(
text = '',
items = [],
buttons = [],
callback = console.log
) {
let snackbar = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
width: 320,
height: 130,
x: 228,
y: 81,
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

snackbar.webContents.once('dom-ready', async () => {
snackbar.webContents.send('permission-request', text, items, buttons);

ipcMain.once('permission-reply', (event, reply) => {
snackbar.close();
callback(reply);

remote.getCurrentWindow().focus();
remote.getCurrentWindow().focus();
});
});

snackbar.loadURL(
require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/snackbar.html'),
protocol: 'file:',
slashes: true
})
);
}

async function loadFlags() {
let flags = store.get('flags');
for (let flag of flags) {
//console.log(`Added flag: ${flag}`);
app.commandLine.appendSwitch(flag);
}
}

// SITE INFO & DIALOGS
let siteInfo;
async function toggleSiteInfo(certificate) {
if (!siteInfo) {
siteInfo = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
width: 320,
height: 330,
x: Math.ceil(document.getElementById('site-info').getBoundingClientRect().left + window.screenX),
y: Math.ceil(document.getElementById('site-info').getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(document.getElementById('site-info'), null).height.replace("px", ""))),
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

let params = encodeURIComponent(JSON.stringify(certificate));
siteInfo.loadURL(
require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/info.html'),
protocol: 'file:',
slashes: true
}) +
'?' +
params
);

siteInfo.on('blur', () => {
if(siteInfo) siteInfo.close();
siteInfo = null;
remote.getCurrentWindow().focus();
remote.getCurrentWindow().focus();
});

siteInfo.on('close', () => {
siteInfo = null;
remote.getCurrentWindow().focus();
remote.getCurrentWindow().focus();
});

let url = new URL(tabs.current().webContents.getURL());
let urlnews = new URL(tabs.current().webContents.getURL()).hostname;

let perms = store.get('permissions')[url.hostname];

siteInfo.webContents.once('dom-ready', async () => {
cookies()
.then(c => {
siteInfo.webContents.send('cookies', c.length);
})
.catch(console.error);

if (!perms) return;

for (let [item, val] of Object.entries(perms)) {
let allowed = val ? i18n.__('İzin Ver') : i18n.__('Engelle');
var chechkss = '';
if(val){ chechkss = "checked"; } else { chechkss = ''; }

var lnagcc = i18n.__(item);

siteInfo.webContents.send(
'perm',
`
<li id="info-perm">
<img src="../../../images/${item}.svg" id="perm-icon">
<p id="perm-text">${lnagcc}</p>
<input ${chechkss} id="${item}"  onclick="editPermission('${urlnews}', '${item}', '${val}')" type="checkbox" class="switch item-control permisonchecks">
</li>
`
);
}
});
}

}

async function savePermission(site, permission, allowed) {
let perms = store.get('permissions');
if (!perms[site]) {
perms[site] = {};
}
perms[site][permission] = allowed;

store.set('permissions', perms);
}

async function cookies(contents, site) {
contents = contents || tabs.current().webContents;
site = site || contents.getURL();
return contents.session.cookies.get({ url: site });
}

async function handlePermission(webContents, permission, callback, details) {
if (details.mediaTypes) {
}
if (permission == 'geolocation') permission = 'location';
if (permission == 'midiSysex') permission = 'midi';

let allowedPerms = ['fullscreen', 'pointerLock'];
if (!allowedPerms.includes(permission)) {
let url = new URL(webContents.getURL()).hostname;

let perms = store.get('permissions');

let checked;
try {
checked = perms[url][permission];
} catch (e) {
checked = undefined;
}

if (checked == undefined || checked == null) {
showSnackbar(
`${url} ${i18n.__('şunu yapmak istiyor:')}`,
[i18n.__(permission)],
[i18n.__('İzin Ver'), i18n.__('Engelle')],
function(response) {
if (response === i18n.__('İzin Ver')) {
callback(true);
savePermission(url, permission, true);
} else {
callback(false);
savePermission(url, permission, false);
}
}
);
} else {
callback(checked);
}
} else {
callback(true);
}
}

async function initCertDialog() {
let bg = window.theme == 'dark' ? '#292A2D' : '#FFFFFF';
certDialog = new BrowserWindow({
frame: false,
resizable: false,
backgroundColor: bg,
width: 490,
height: 600,
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
},
show: false,
parent: remote.getCurrentWindow(),
icon: join(__dirname, 'images/holla.png')
});

certDialog.on('page-title-updated', async () => {
certDialog.show();
});
}

async function showCertificateDialog(certificate) {
certificate.bg = window.theme == 'dark' ? '#292A2D' : '#FFFFFF';
let params = encodeURIComponent(JSON.stringify(certificate));
let { format } = require('url');
certDialog.loadURL(
format({
pathname: join(__dirname, 'static/pages/dialogs/certificate.html'),
protocol: 'file:',
slashes: true
}) +
'?' +
params
);
}

// HTML ELEMENTS
document.getElementById('shield').addEventListener('click', toggleAdblock);

document.getElementById('home').addEventListener('click', async () => {
if(newtabBased == 'gizli-yeni-sekme'){
tabs.current().webContents.loadURL('Nickel://'+newtabBased);
store.set('cacheURLClicks', 'Nickel://'+newtabBased);
setTimeout(() => {store.set('cacheURLClicks', '');}, 500);
} else {
//tabs.current().webContents.loadURL(join(__dirname, 'static', 'pages', 'yeni-sekme.html'));
tabs.current().webContents.loadURL(require('url').format({
pathname: join(__dirname, 'static/pages/yeni-sekme.html'),
protocol: 'file:',
slashes: true
}));
store.set('cacheURLClicks', 'Nickel://yeni-sekme');
setTimeout(() => {store.set('cacheURLClicks', '');}, 500);
}
document.getElementById('url').value = '';
}

);

document.getElementById('back').addEventListener('click', async () => keyboardShortcut('backPage'));
document.getElementById('forward').addEventListener('click', async () => keyboardShortcut('forwardPage'));
document.getElementById('refresh').addEventListener('mousedown', async e => {
switch (e.which) {
case 1:    
if (document.getElementById('refresh').firstElementChild.src.endsWith('refresh.svg')) {
tabs.current().webContents.reload();
} else {
tabs.current().webContents.stop();
}
break;
case 2:
let url = tabs.current().webContents.getURL();
tabs.newView(url);
break;
}
return true; // to allow the browser to know that we handled it.
});


var sidebartabs = [];

ipcMain.on('createLeftMenuAresOpenClosed', async (e, name,type,xwidht, xurl) => {
createLeftMenuAresOpenClosed(name,type,xwidht,xurl);
});

async function createLeftMenuAresOpenClosed(name,type,xwidht, xurl) {
let keyid = name.replace(/\s/g, '');

let cache_viewsx;

for (item of sidebartabs) {
if(item.id == keyid){
cache_viewsx = item.viewsx;
cache_viewsxTopbar = item.viewsxTopbar;
}
}

if(cache_viewsx){
var btnbulsc = document.getElementById(keyid);

if(type == 'open'){
cache_viewsxTopbar.show();
cache_viewsx.show();
cache_viewsx.focus();
btnbulsc.classList.add('activebtns');
}

if(type == 'close'){
cache_viewsxTopbar.hide();
cache_viewsx.hide();
btnbulsc.classList.remove('activebtns');
store.set('settings.leftbarmenuSize', 40);
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
document.getElementById('plugingoreas').style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
windowPageAllResize();
}

if(type == 'reload'){
//cache_viewsx.webContents.reload();
cache_viewsx.webContents.loadURL(xurl);
}

if(type == 'pin'){
btnbulsc.classList.add('pinned');
store.set('settings.leftbarmenuSize', 40+xwidht);
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
document.getElementById('plugingoreas').style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
windowPageAllResize();
}
if(type == 'unpin'){
btnbulsc.classList.remove('pinned');
store.set('settings.leftbarmenuSize', 40);
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
document.getElementById('plugingoreas').style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
windowPageAllResize();
}

}
}



async function createLeftMenuAres(item) {
let name = item.name;
let url = item.url;
let xwidht = item.widht;
let keyid = item.name.replace(/\s/g, '');

let cache_viewsx;
let cache_viewsxTopbar;


for (item of sidebartabs) {
if(item.id == keyid){
cache_viewsx = item.viewsx;
cache_viewsxTopbar = item.viewsxTopbar;
} else {
item.viewsx.hide();
item.viewsxTopbar.hide();
var btnbulsc = document.getElementById(item.id);
if(btnbulsc.classList.contains('activebtns')){
btnbulsc.classList.remove('activebtns');
}

if(btnbulsc.classList.contains('pinned')){
store.set('settings.leftbarmenuSize', 40)
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
document.getElementById('plugingoreas').style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
windowPageAllResize();
}

}
}

store.set('cache_viewsx_keyid', keyid);

var btnbuls = document.getElementById(keyid);


if(!cache_viewsx){

var oSessionsXGT;
if(store.get('--incognitotab') == '--incognitotab'){
let cids = v1();
oSessionsXGT = 'persist:'+cids+cids;
} else { oSessionsXGT=''; }

let viewsx = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
titleBarStyle: 'customButtonsOnHover',
minimizable: false,
maximizable: false,
backgroundColor: '#FFFFFF',
closable: false,
width: xwidht,
height: window.outerHeight-25,
x:Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY+25,
useContentSize: true,
parent: remote.getCurrentWindow(),
webPreferences: {
partition: oSessionsXGT,
nodeIntegration: false,
nativeWindowOpen: false,
nodeIntegrationInSubFrames: false,
worldSafeExecuteJavaScript: true,
executeJavaScript: true,
plugins: true ,
spellcheck: true,
preload: join(__dirname, 'js/preload.js')
}
});

viewsx.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
});

viewsx.webContents.on('will-prevent-unload', async (e) => { 
//e.preventDefault();
var cacheurlsxx = store.get('cacheURLClicks');
const choice = dialog.showMessageBoxSync(win, {
type: 'question',
buttons: [i18n.__('Leave'), i18n.__('Stay')],   
title: i18n.__('Do you want to leave this site?'),
message: i18n.__('Changes you made may not be saved.'),
defaultId: 0,
cancelId: 1
})
const leave = (choice === 0)
if (leave) {
e.preventDefault();

setTimeout(() => {
viewsx.webContents.forcefullyCrashRenderer();

setTimeout(() => {
if(cacheurlsxx){
viewsx.webContents.loadURL(cacheurlsxx);
} else {
viewsx.webContents.reload();
}
}, 120);
}, 50);

} else {
}
});

let viewsxTopbar = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
titleBarStyle: 'customButtonsOnHover',
minimizable: false,
maximizable: false,
closable: false,
backgroundColor: '#FFFFFF',
width: xwidht,
height: 25,
x:Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY,
//alwaysOnTop: true,
useContentSize: true,
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true,
worldSafeExecuteJavaScript: true,
executeJavaScript: true,
}
});


var autogetdates = [{ xname: name, xurl: url, xwidht: xwidht, xkeyid: keyid }];
let paramsxx = encodeURIComponent(JSON.stringify(autogetdates));
viewsxTopbar.loadURL(
require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/sidebartopbar.html'),
protocol: 'file:',
slashes: true
}) +
'?' +
paramsxx
);

viewsx.webContents.session.setPreloads([join(__dirname, 'js/preload-get-display-media-polyfill.js')]);
viewsx.webContents.session.setPreloads([join(__dirname, 'js/preload-get-sidebar.js')]);

//viewsxTopbar.openDevTools({ mode: 'detach' });
//viewsx.openDevTools({ mode: 'detach' });
viewsx.focus();

viewsx.webContents.once('dom-ready', async () => {});

viewsx.on('blur', () => {
//viewsx.hide(); viewsxTopbar.hide(); 
//remote.getCurrentWindow().focus();
});


viewsx.on('close', () => {
viewsx = null; viewsxTopbar = null;
remote.getCurrentWindow().focus();
});


if(!btnbuls.classList.contains('activebtns')){
btnbuls.classList.add('activebtns');
} else {
btnbuls.classList.remove('activebtns');
}

viewsx.loadURL(url);

if(keyid == 'Vk'){
viewsx.webContents.setUserAgent("Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36");
} else {
if(keyid == 'WhatsApp'){ 
viewsx.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0"); 
} else {   
if(keyid == 'FacebookMessenger'){ 
viewsx.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/78.0.4093.231"); 
} else {       
viewsx.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64 ; rv:92.0) AppleWebKit/537.36 (KHTML, like Gecko/20100101) Firefox/92.0 Chrome/87.0.4280.141 Safari/537.36"); 
}
}
}

let dsadsa = {'id':keyid, viewsx, viewsxTopbar}
sidebartabs.push(dsadsa);

} else {

if(!btnbuls.classList.contains('activebtns')){
btnbuls.classList.add('activebtns');
cache_viewsx.show();
cache_viewsxTopbar.show();
cache_viewsx.focus();

setTimeout(() => {
if(cache_viewsx && cache_viewsxTopbar){
cache_viewsx.setBounds({
width: xwidht,
height: window.outerHeight-25,
x: Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY+25,
});

cache_viewsxTopbar.setBounds({
width: xwidht,
height: 25,
x: Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY,
});
}
}, 5);

if(btnbuls.classList.contains('pinned')){
store.set('settings.leftbarmenuSize', 40+xwidht);
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
document.getElementById('plugingoreas').style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
windowPageAllResize();
}

} 
else {
btnbuls.classList.remove('activebtns');
cache_viewsx.hide();
cache_viewsxTopbar.hide();


if(btnbuls.classList.contains('pinned')){
//btnbulsc.classList.remove('pinned');
store.set('settings.leftbarmenuSize', 40)
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
document.getElementById('plugingoreas').style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = store.get('settings.leftbarmenuSize')+'px';
windowPageAllResize();
}

}


}

}

// Menü Buton - Menü Yeni
document.getElementById('menu').addEventListener('click', async e => {
createWindowMenuTs();
});

async function createWindowMenuTs() {
let mainWindowMenus = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
titleBarStyle: 'customButtonsOnHover',
minimizable: false,
maximizable: false,
closable: false,
//skipTaskbar: true,
width: 290,
height: 450,
x: Math.ceil(document.getElementById('menu').getBoundingClientRect().left + window.screenX) - 238,
y: Math.ceil(document.getElementById('menu').getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(document.getElementById('menu'), null).height.replace("px", ""))) - 9,
//alwaysOnTop: true,
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

let create_loadModal = require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/modal/menu.html'),
protocol: 'file:',
slashes: true
});

mainWindowMenus.focus();

mainWindowMenus.webContents.once('dom-ready', async () => {
});

mainWindowMenus.setClosable(true);

mainWindowMenus.on('blur', async () => {
mainWindowMenus.close();
});

mainWindowMenus.loadURL(create_loadModal);
}

document.getElementById('url').addEventListener('keypress', async e => {
if (e.which == 13 || e.which == 10) {
if (e.ctrlKey) {
document.getElementById('url').value = 'www.' + document.getElementById('url').value;
document.getElementById('url').value = document.getElementById('url').value + '.org';
} else if (e.shiftKey) {
document.getElementById('url').value = 'www.' + document.getElementById('url').value;
document.getElementById('url').value = document.getElementById('url').value + '.net';
} else {
loadPage(document.getElementById('url').value);
document.getElementById('url').blur();
}
}
});


document.getElementById('url').addEventListener('focus', async e => {
e.preventDefault();
document.getElementById('nav-center').style.border = 'var(--accent) 2px solid';
if(tabs.current().webContents.getURL().includes('holla://') || tabs.current().webContents.getURL().includes('file://')){
} else {
document.getElementById('url').value = tabs.current().webContents.getURL();
}

/*
if(newtabBased == 'gizli-yeni-sekme' || newtabBased == 'yeni-sekme'){} else{
document.getElementById('url').value = tabs.current().webContents.getURL();
}
*/
/*
document.getElementById('url').placeholder = '';
setTimeout(function(){  
document.getElementById('url').focus();
document.getElementById('url').select();
}, 120);
*/
});


document.getElementById('url').addEventListener('click', async e => {
e.preventDefault();
document.getElementById('url').select();
document.getElementById('url').focus(); 
/*
document.getElementById('url').placeholder = '';
setTimeout(function(){  
document.getElementById('url').focus();
document.getElementById('url').select();
}, 120);
*/
});



document.getElementById('url').addEventListener('input', async e => {
search.show(document.getElementById('url').value, searchBounds());
});



document.getElementById('url').addEventListener('blur', async () => {
document.getElementById('nav-center').removeAttribute('style');

document.getElementById('url').setSelectionRange(0,0);
document.getElementById('url').placeholder = document.getElementById('url').getAttribute('data-placeholder');
setTimeout(function() {
search.hide();
web.setSearchIcon(tabs.current().webContents.getURL());
}, 100);
});




document.getElementById('bookmark').addEventListener('click', async () => {
//console.log('bookmarking...');
let url = tabs.current().webContents.getURL();
let title = tabs.current().webContents.getTitle();

//console.log('checking if is book of the marked');
storage.isBookmarked(url).then(isBookmarked => {
//console.log('is bookmarked?', isBookmarked ? 'yes' : 'no');
if (isBookmarked) {
document.getElementById('bookmark').firstElementChild.src = 'images/bookmark.svg';
//console.log('removing bookmark');
storage.removeBookmark(isBookmarked);
genelKitaplikDataPross();
} else {
document.getElementById('bookmark').firstElementChild.src = 'images/bookmark-saved.svg';
//console.log('adding bookmark');
storage.addBookmark(url, title);
genelKitaplikDataPross();
}
});
});


/* Güncelleme Ekranı  */
document.getElementById('system_update').addEventListener('click', async () => {
createWindowUpdate();
});

async function createWindowUpdate() {
let mainWindowUpdate = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
width: 320,
height: 320,
x: Math.ceil(document.getElementById('system_update').getBoundingClientRect().left + window.screenX) - 285,
y: Math.ceil(document.getElementById('system_update').getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(document.getElementById('system_update'), null).height.replace("px", ""))),
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

let create_loadModal = require('url').format({
pathname: join(__dirname, 'static/pages/dialogs/modal/update_app.html'),
protocol: 'file:',
slashes: true
});

mainWindowUpdate.focus();

mainWindowUpdate.webContents.once('dom-ready', async () => {
});

mainWindowUpdate.on('blur', async () => {
mainWindowUpdate.close();
});

mainWindowUpdate.loadURL(create_loadModal);
}

getSearchEngine(async e => {
document.getElementById('url').placeholder = serachmotorname;
document.getElementById('url').setAttribute('data-placeholder', serachmotorname);
});

async function setSearchEngine() {
var engineMotors = store.get('settings.search_engine');
document.getElementById('url').placeholder = i18n.__('Ara')+` ${engineMotors} `+i18n.__('yada url dene');
document.getElementById('url').setAttribute('data-placeholder', i18n.__('Ara')+` ${engineMotors} `+i18n.__('yada url dene'));
};

// INITIALIZE WINDOWS
initCertDialog();
initAlert();

loadFlags();

// WINDOW HANDLERS
remote.getCurrentWindow().on('close', async (e) => {
remote
.getCurrentWindow()
.getChildWindows()
.forEach(win => win.close());
});

remote.getCurrentWindow().on('move', async () => {
search.hide();
document.getElementById('url').blur();
});

let win = remote.getCurrentWindow();

win.on('resize', () => { 
let view = tabs.current(); 
let topbarHeight = store.get('settings.topbarHeight');
view.setBounds({x:windowxview, y:topbarHeight, width:win.getContentBounds().width+windowxviewW, height:win.getContentBounds().height - topbarHeight });


for (item of sidebartabs) {
if(item.id == store.get('cache_viewsx_keyid')){
let xcache_viewsx = item.viewsx;
let xcache_viewsxTopbar = item.viewsxTopbar;

setTimeout(() => {
if(xcache_viewsx && xcache_viewsxTopbar){
xcache_viewsx.setBounds({
//width: xwidht,
height: window.outerHeight-25,
x: Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY+25,
});

xcache_viewsxTopbar.setBounds({
//width: xwidht,
height: 25,
x: Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY,
});
}
}, 5);

} 
}

});

win.on("move", () => { 
if(!win.isMinimized()) {}
for (item of sidebartabs) {
if(item.id == store.get('cache_viewsx_keyid')){
let xcache_viewsx = item.viewsx;
let xcache_viewsxTopbar = item.viewsxTopbar;

setTimeout(() => {
if(xcache_viewsx && xcache_viewsxTopbar){
xcache_viewsx.setBounds({
//width: xwidht,
height: window.outerHeight-25,
x: Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY+25,
});

xcache_viewsxTopbar.setBounds({
//width: xwidht,
height: 25,
x: Math.ceil(document.getElementById('menusleftbar').getBoundingClientRect().left + window.screenX) + 40,
y:window.screenY,
});
}
}, 5);

} 
}
});


if(newtabBased == 'gizli-yeni-sekme'){
tabs.newView(remote.process.argv[2] && (remote.process.argv[2].startsWith('http') ||
remote.process.argv[2].startsWith('Nickel')) ? remote.process.argv[2] : 'Nickel://'+newtabBased);
} else {

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms));
const timer2 = ms => new Promise(res => setTimeout(res, ms));

async function loadDatapintabs () { 
// We need to wrap the loop into an async function for this to work
var datapintabs =  storage.gettabsPinsNo();
let itemCachesPins = [];

Object.values(datapintabs).forEach((datapintabsItem, i) => {
itemCachesPins.push(datapintabsItem);
});
var datasitemsPins = itemCachesPins;

if(datasitemsPins.length){
for (item of datasitemsPins){
tabs.newView(item.url, '', item.id);
await timer(500); // then the created Promise can be awaited
}
}
}


async function loadCacheStarterAppsUrl () { 
for (items of store.get('cacheStarterAppsUrl')) {
tabs.newView(items.url);
await timer2(500); // then the created Promise can be awaited
}
}


setTimeout(() => {

loadDatapintabs();

// /* Kaldığın Yerden Devam Et Kapalı İse NewTab Aç*/
if (store.get('settings.starter') == 1) {
if(!store.get('cacheStarterAppsUrl')){
tabs.newView(remote.process.argv[2] && (remote.process.argv[2].startsWith('http') ||
remote.process.argv[2].startsWith('Nickel')) ? remote.process.argv[2] : 'holla://'+newtabBased);
}
}

/* Kaldığın Yerden Devam Et Açıksa Sekmeleri Aç */
if (store.get('settings.starter') == 2) {
if(store.get('cacheStarterAppsUrl')){


if(store.get('cacheStarterAppsUrl').length){
loadCacheStarterAppsUrl();

setTimeout(() => {
store.delete('cacheStarterAppsUrl');
}, 2500);

} else {
tabs.newView(remote.process.argv[2] && (remote.process.argv[2].startsWith('http') ||
remote.process.argv[2].startsWith('Nickel')) ? remote.process.argv[2] : 'Nickel://'+newtabBased);
}


} else {
tabs.newView(remote.process.argv[2] && (remote.process.argv[2].startsWith('http') ||
remote.process.argv[2].startsWith('Nickel')) ? remote.process.argv[2] : 'Nickel://'+newtabBased);
}
}

if (store.get('settings.starter') == 3) {
getSearchEngine(async e => {
var locUrlSafes = new URL(e.url);
tabs.newView(locUrlSafes.origin);
});
}

}, 400);
}

// Quit when all windows are closed.
app.on('window-all-closed', async () => {
closedAppWindowExit();
});

async function closedAppWindowExit() {
if(store.get('settings.auto_clear_history')){
storage.clearHistory();
}
if(store.get('settings.auto_clear_cookies')){
}
}

/* Fare İle Yakınlaştır Uzaklaştır */
async function pageZoomInOutALL() {
let win = tabs.current(); 

// If reduced below Minimum value 
// Error - 'zoomFactor' must be a double greater than 0.0 
win.webContents.setZoomFactor(1.0); 
win.webContents.zoomFactor = 1.0;
let porrzomm = false;
// Upper Limit is working of 500 % 
win.webContents 
.setVisualZoomLevelLimits(1, 5) 
.then(/*console.log("Zoom Levels Have been Set between 100% and 500%")*/) 
.catch((err) => console.log(err)); 

win.webContents.on("zoom-changed", (event, zoomDirection) => { 
if(!porrzomm){ porrzomm = true;
var currentZoom = win.webContents.getZoomFactor(); 
//console.log("Current Zoom Level at - ", win.webContents.zoomLevel); 
if (zoomDirection === "in") { 
if(currentZoom < 5){
win.webContents.zoomFactor = currentZoom + 0.2; }
//console.log("Zoom Factor Increased to - ", win.webContents.zoomFactor * 100, "%"); 
} 
if (zoomDirection === "out") { 
if(currentZoom > 0.30000000000000004){ 
win.webContents.zoomFactor = currentZoom - 0.2; 
}
//console.log("Zoom Factor Decreased to - ", win.webContents.zoomFactor * 100, "%"); 
}
setTimeout(() => {
porrzomm = false;
}, 500);
}
//console.log(currentZoom);
});
}

/* Eklentileri Bul Ve Aktif Et */
async function loadUzatilar() {
var uzantilarKlasor = join(__dirname, 'static/extensions');
fs.readdir(uzantilarKlasor, (err, files) => {
files.forEach(file => {
//const manifest = require(uzantilarKlasor+'/'+file+'/manifest.json');
var manifest = JSON.parse(fs.readFileSync(uzantilarKlasor+'/'+file+'/manifest.json').toString());
if(store.get('extensions.'+manifest.idkey)){
require(uzantilarKlasor+'/'+file+'/'+manifest.js);
}
});
});
}
loadUzatilar();


/* Ust Tuş Uygulama Kapat */
let closeButton = document.getElementById('close-button');
closeButton.addEventListener("click", event => {
if(newtabBased == 'gizli-yeni-sekme'){} else{
/* Kaldığın Yerden Devam Et Açıksa Verileri Sakla */
if (store.get('settings.starter') == 2) {
let itemCachesStartUrl = [];
for (item of tabs.tabs) {

var anatabssxx = document.getElementById(item.tab.element.id);  
if(!anatabssxx.classList.contains('tab-pins')){
var itemNewsUrlCac = { url: item.webContents.getURL() }
itemCachesStartUrl.push(itemNewsUrlCac);
} else {
storage.removetabsPins(anatabssxx.id);
storage.logtabsPins(item.webContents.getURL(),anatabssxx.id);
}

}
store.set('cacheStarterAppsUrl', itemCachesStartUrl);
} else{

for (item of tabs.tabs) {
var anatabssxx = document.getElementById(item.tab.element.id);  
if(!anatabssxx.classList.contains('tab-pins')){
} else {
storage.removetabsPins(anatabssxx.id);
storage.logtabsPins(item.webContents.getURL(),anatabssxx.id);
}
}

}
}
/* Kaldığın Yerden Devam Et Açıksa Verileri Sakla Son */

});


function leftbarmenu () {
if(store.get('settings.leftbarmenu')){
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
if(document.querySelector('link[href="css/leftbarmenu.css"]')) document.querySelector('link[href="css/leftbarmenu.css"]').remove();
if(!document.querySelector('link[href="css/leftbarmenu.css"]')) document.head.innerHTML += '<link rel="stylesheet" href="css/leftbarmenu.css">';
document.getElementById('plugingoreas').style.paddingLeft = '40px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = '40px';
} else {
windowxview = 0;
windowxviewW = -0;
if(document.querySelector('link[href="css/leftbarmenu.css"]')) document.querySelector('link[href="css/leftbarmenu.css"]').remove();

document.getElementById('plugingoreas').style.paddingLeft = '0px';
document.getElementsByClassName('ntabsedits')[0].style.paddingLeft = '0px';
store.set('settings.leftbarmenuSize', 40);

for (item of sidebartabs) {
var btnbulsc = document.getElementById(item.id);
btnbulsc.classList.remove('activebtns');
btnbulsc.classList.remove('pinned');
item.viewsx.hide();
item.viewsxTopbar.hide();
item.viewsx.close();
item.viewsxTopbar.close();
item.viewsx = null;
item.viewsxTopbar = null;
}
sidebartabs = [];
}
windowPageAllResize();
}

/* Tüm Yapıyı Yeniden Boyutlandır Verilen Üst Ölçüye Göre */
async function windowPageAllResize() {
let win = remote.getCurrentWindow();
let topbarHeight = store.get('settings.topbarHeight');
let bounds = win.getBounds();
for (ntabs of tabs.tabs) {
ntabs.setBounds({x:windowxview, y:topbarHeight, width:win.getContentBounds().width+windowxviewW, height:win.getContentBounds().height - topbarHeight });
win.on('resize', () => {
ntabs.setBounds({x:windowxview, y:topbarHeight, width:win.getContentBounds().width+windowxviewW, height:win.getContentBounds().height - topbarHeight });
});

}
}

/* Bookmarks Kaydedilenleri Ekranda Göster */
async function genelKitaplikEkle() {
if(store.get('settings.bookmarkViews')){
store.set('settings.topbarHeight', 106);
ipcRenderer.send('newTopBarOlcus');
genelKitaplikDataPross();
} else { 
store.set('settings.topbarHeight', 70); 
ipcRenderer.send('newTopBarOlcus');
let anaIcerikData = document.getElementById('bookmarksAlls');
if(anaIcerikData){
anaIcerikData.style.display='none';
anaIcerikData.innerHTML = '';
}
}
}

async function genelKitaplikDataPross() {
if(store.get('settings.bookmarkViews')){
/* Temizle */
let anaIcerikDataCleans = document.getElementById('bookmarksAlls');
if(anaIcerikDataCleans){ anaIcerikDataCleans.innerHTML = ''; }
/* Geçmiş Getir Döngüye Sok Ve Veri Formatına Çevir */
let itemCachesboks = [];
let historyBooks = (await storage.getBookmarks());
Object.values(historyBooks).forEach((historyItem, i) => {
itemCachesboks.push(historyItem);
});
let rowsItems = itemCachesboks;
/* Geçmiş Getir Döngüye Sok Ve Veri Formatına Çevir Son */

/* Verileri Ekrana Yazıdır */
let anaIcerikData = document.getElementById('bookmarksAlls');
anaIcerikData.style.display = 'flex';
for (nbookitems of rowsItems.splice(0, 10)) {
var itemElTwos = document.createElement('div');
itemElTwos.title = nbookitems.url;
itemElTwos.id = nbookitems.id;
itemElTwos.className = "tab-boomarks";
var icons = `https://www.google.com/s2/favicons?sz=64&domain_url=${nbookitems.url}`;
if(!nbookitems.url.includes('holla://')){
var iconsPack = `<img src="${icons}">`
} else { var iconsPack = ''; }

itemElTwos.innerHTML = `
<div class="tab" onclick="openLoadUrlGoBooks('${ nbookitems.url }')">
${iconsPack}
<p class="sc-booktextt">
${ nbookitems.title }
</p>
</div>
`.trim();
anaIcerikData.appendChild(itemElTwos);
}
var itemElTwos = document.createElement('div');
itemElTwos.title = i18n.__('Kitaplık');
itemElTwos.id = 'BookMarks';
itemElTwos.className = "tab-boomarks tab-book-mores";
itemElTwos.innerHTML = `
<div class="tab" onclick="openLoadUrlGoBooks('Nickel://yer-imleri')">
<img src="images/bookmark.svg">
<p class="sc-booktextt">
</p>
</div>
`.trim();
anaIcerikData.appendChild(itemElTwos);
/* Verileri Ekrana Yazıdır Son */
}
}