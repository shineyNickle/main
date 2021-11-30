// PACKAGE LOADING
const { remote, ipcRenderer } = require('electron');
const { dialog } =  require('electron').remote;

const { v1 } = require('uuid'); // Şifrele Method 1
const base64KeysTo = require('./base64.min.js'); // Şifrele Method 2

var i18n = new(require('./../translations/i18n-ex'));

if(store.get('--incognitotab') == '--incognitotab'){
var newtabBased = 'gizli-yeni-sekme';
} else {
var newtabBased = 'yeni-sekme';
}

let windowxview = 0;
let windowxviewW = 0;

if(store.get('settings.leftbarmenu')){
windowxview = store.get('settings.leftbarmenuSize');
windowxviewW = -store.get('settings.leftbarmenuSize');
}

// INITIALIZE LOCAL SCRIPTS:
const web = require('./web'); // Used for managing webpage loading and websites
const storage = require('./store'); // Manages bookmark and history storage

const { BrowserView, BrowserWindow, ipcMain, Menu } = remote;
const contextMenu = require('electron-context-menu');

const { join } = require('path'); // Helps create full paths to local files

async function getUserAgento(cb) {
let daUserAgent = store.get('settings.user_agent');
let enginesUa = store.get('userAgent');
for (let engine of enginesUa) {
if (engine.name == daUserAgent) cb(engine);
}
}


let dataUserAgentRe;
getUserAgento(async e => { 
dataUserAgentRe = e.url; 
});

//const fs = require('fs');
const tabs = require('./tabs.js');

remote.app.on('browser-window-created',function(e,window) {
window.setMenu(null);
window.nativeWindowOpen = false;
});

const win = remote.getCurrentWindow(); // Grabs the Holla window

function realNowtopbarHeight() {
if(store.get('settings.leftbarmenu')){
windowxview = store.get('settings.leftbarmenuSize'); 
windowxviewW = -store.get('settings.leftbarmenuSize');
} else {
windowxview = 0;
windowxviewW = 0;
}

let topBarOlcus = 70;
if(store.get('settings.topbarHeight')){ topBarOlcus = store.get('settings.topbarHeight'); }
return topBarOlcus;
}

let topbarHeight = realNowtopbarHeight();

let Sortable = require('sortablejs'); // Library for draggable/sortable elements
var el_ssort = document.getElementById("tabs");
var sortable = new Sortable(el_ssort, {
sort: true,  // sorting inside list
animation: 150,
ghostClass: 'blue-background-class',
direction: 'horizontal',
filter: ".tab-pins",  // Selectors that do not lead to dragging (String or Function)
preventOnFilter: false, // Call `event.preventDefault()` when triggered `filter`
draggable: '.tab-drag',
});

var el_ssort_pin = document.getElementById("npin-tab");
var sortablepin = new Sortable(el_ssort_pin, {
sort: true,  // sorting inside list
animation: 150,
ghostClass: 'blue-background-class',
direction: 'horizontal',
draggable: '.tab-pins',
});

var el_ssort_sidebar = document.getElementById("sidebarAdds");
var sortablesidebar = new Sortable(el_ssort_sidebar, {
sort: true,  // sorting inside list
animation: 150,
ghostClass: 'blue-background-class',
direction: 'vertical',
draggable: '.draggledsidebar',
});

exports.tabs = []; // Array of all open tabs
var closedTabs = []; // Array of previously closed tabs, used in the Reopen Closed Tab shortcut
var activeTab; // Currently selected tab
var downloadWindow; // Stores the downloads window globall

// Initialize the downloads window:
exports.initDownloads = async () => {
downloadWindow = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
width: window.outerWidth,
height: 70,
x: Math.ceil(window.screenX),
y: Math.ceil(window.outerHeight-70),
parent: remote.getCurrentWindow(),
show: false,
hasShadow: false,
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

win.on("resize", function () {/*
var size = win.getSize();
var width = size[0];
var height = size[1];
// win.webContents.send("resized", height);
console.log(size);
console.log("width: " + width);
console.log("height: " + height);*/
downloadWindow.setBounds({width: window.outerWidth, height:70, x: Math.ceil(window.screenX), y: Math.ceil(window.outerHeight-70)});
});


win.on("move", function () {
downloadWindow.setBounds({width: window.outerWidth, height:70, x: Math.ceil(window.screenX), y: Math.ceil(window.outerHeight-70)});
});

downloadWindow.loadURL(require('url').format({
pathname: join(__dirname, '../static/pages/dialogs/download.html'),
protocol: 'file:',
slashes: true
}));

//downloadWindow.openDevTools({ mode: "detach" });
}

// Decide whether file should be viewer (pdf) or downloaded:
exports.handleDownload = async (event, item, webContents) => {

if(!store.get('setDowloandLoads')){
store.set('setDowloandLoads', true);
setTimeout(function(){ store.set('setDowloandLoads', false); }, 200);

/*
let filters = [
{ name: 'Web Sayfası, Tamamı', extensions: ['htm', 'html'] },
{ name: 'Web Sayfası, Yalnızca HTML', extensions: ['html', 'htm'] },
{ name: 'Web Sayfası, Tek Dosya', extensions: ['mhtml'] },
{ name: 'Resim', extensions: ['jpg', 'png', 'gif'] },
{ name: 'Video', extensions: ['mkv', 'avi', 'mp4'] },
{ name: 'Custom File Type', extensions: ['as'] },
{ name: 'Tüm Dosyalar', extensions: ['*'] }
];

let options = {
title: 'Farklı Kaydet',
defaultPath: store.get('appGetPath')+'\\'+item.getFilename(),
filters: filters
//message: "Please pick your poison",
};

item.setSaveDialogOptions(options); 
*/

//item.setSavePath(store.get('appGetPath'));
item.setSavePath(store.get('appGetPath')+'\\'+item.getFilename());
item.pause();
this.resumeOnLives = false;
this.downloadWindowShows = false;


let itemAddress = item.getURL();
/*
if(item.getMimeType() === 'application/pdf' && itemAddress.indexOf('blob:') !== 0 && itemAddress.indexOf('#pdfjs.action=download') === -1) {
event.preventDefault();
let query = '?file=' + encodeURIComponent(itemAddress);
this.current().webContents.loadURL(join(__dirname, '..', 'static', 'pdf', 'index.html') + query);
} else {}
*/
var savePath;

if(!this.downloadWindowShows){
if (store.get('settings.dowloadnAltPencere')) { downloadWindow.show(); }
this.downloadWindowShows = true;
}

//let id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
let id = v1();
downloadWindow.webContents.send('newDownload', id, item.getFilename(), itemAddress, item.getTotalBytes(), item.getMimeType());
storage.addDownloads(id, item.getFilename(), '', item.getURL(), item.getTotalBytes(), item.getMimeType(), 'wait');

item.on('updated', (event, state) => {
if(!this.resumeOnLives){ 
item.resume(); 
this.resumeOnLives = true; 
}


if (state === 'interrupted') { 
if (store.get('settings.dowloadnAltPencere')) { downloadWindow.webContents.send('stoppedDownload', id, state); }
} else if (state === 'progressing') { 
savePath = item.savePath;
if (item.isPaused()) {  
if (store.get('settings.dowloadnAltPencere')) { downloadWindow.webContents.send('stoppedDownload', id, 'paused'); }
} else {  
let percentage = (item.getReceivedBytes() / item.getTotalBytes()) * 100;
if (store.get('settings.dowloadnAltPencere')) { downloadWindow.webContents.send('updateDownload', id, percentage, item.getReceivedBytes(), item.getTotalBytes()); }
if(tabs.current().webContents.getURL() == 'holla://indirilenler'){
tabs.current().webContents.send('updateDownload', id, percentage, item.getReceivedBytes(), item.getTotalBytes());
}
}
}


});

ipcMain.once('cancel-download-' + id, () => { 
item.cancel();  
storage.StatusDownloads(id, 'cancel-download');

/*
if (fs.existsSync(savePath)) {
fs.unlink(savePath, (err) => {
if (err) {
console.log("An error ocurred updating the file" + err.message);
console.log(err);
} else { console.log("File succesfully deleted"); }
});
} else {
console.log("This file doesn't exist, cannot delete");
}
*/

});

ipcMain.once('getCurrentWindowHides', () => { 
this.downloadWindowShows = false;
});


item.once('done', (event, state) => {
if (state === 'completed') {
//console.log(savePath);
if (store.get('settings.dowloadnAltPencere')) { downloadWindow.webContents.send('completeDownload', id, savePath); }
storage.SavePathDownloads(id, savePath.replace(/\\/g, "/"));
storage.StatusDownloads(id, 'completed');
if(tabs.current().webContents.getURL() == 'holla://indirilenler'){
tabs.current().webContents.send('completeDownload', id, savePath.replace(/\\/g, "/"));
}
this.resumeOnLives = false; 
} else {
if (store.get('settings.dowloadnAltPencere')) { downloadWindow.webContents.send('failedDownload', id); }
storage.StatusDownloads(id, 'failed');
if(tabs.current().webContents.getURL() == 'holla://indirilenler'){
tabs.current().webContents.send('failedDownload', id);
}
this.resumeOnLives = false; 
}
});


}
}

// Opens a recently closed tab:
exports.openClosedTab = function () {
if(closedTabs.length == 0) return;
let item = closedTabs[closedTabs.length-1];
this.newView(item);

const index = closedTabs.indexOf(item);
if (index > -1) closedTabs.splice(index, 1);
}

// Returns the current tab:
exports.current = function () {
return activeTab;
}

// Initializes a view with bindings from web.js:
exports.initBrowserView = async (view) => {

view.webContents.on('did-start-loading', async () => { 
web.loadStart(view);
});

view.webContents.on('did-stop-loading', async () => { web.loadStop(view) });
view.webContents.on('did-fail-load', async (e, ec, ed, vu) => {web.failLoad(e, view, ec, ed, vu); });

view.webContents.on('enter-html-full-screen', async () => { 
web.enterFllscrn(view, remote.screen);
});

view.webContents.on('leave-html-full-screen', async () => {  
setTimeout(() => {
web.leaveFllscrn(view, win.getBounds().height) ;
}, 5);

});
view.webContents.on('dom-ready', async () => { web.domReady(view, storage) });

view.webContents.on('did-finish-load', () => {
//view.webContents.executeJavaScript(``);
});

view.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
event.preventDefault();
/*
if(disposition){
const winxx = new BrowserWindow({
webContents: options.webContents, // use existing webContents if provided
show: true
})
winxx.setMenu(null);
winxx.minimize();
winxx.loadURL(url); // existing webContents will be navigated automatically
winxx.close();
event.newGuest = winxx;
//event.sender.destroy();
*/

if(disposition){
if(disposition == 'foreground-tab'){
this.newView(url);
options.webContents.destroy();
} else {
if(disposition == 'new-window'){
}
}
}

});

view.webContents.on('media-started-playing', async (e) => { 
setTimeout(() => {
if(view.webContents.isAudioMuted()){
view.tab.setIcon('images/volume_off.svg');
} else {
view.tab.setIcon('images/volume_on.svg');
}
}, 150); 
});

view.webContents.on('media-paused', async (e) => { 
setTimeout(() => {
if(view.webContents.getURL()){
let origin = new URL(view.webContents.getURL()).origin;
if(!view.webContents.getURL().includes('holla://') && !view.webContents.getURL().includes('file://')){
var icons = `https://www.google.com/s2/favicons?sz=64&domain_url=${origin}`;
view.tab.setIcon(icons);
} else { 
view.tab.setIcon('//:0'); 
}
}
}, 100); 
});


// view.webContents.on('page-favicon-updated', async (e) => { web.faviconUpdated(view, e.favicons) });
view.webContents.on('page-title-updated', async (e, t) => { web.titleUpdated(view, e, t) });
view.webContents.on('did-navigate', async (e, url) => { web.didNavigate(url, view, storage) });
view.webContents.on('did-navigate-in-page', async (e, url) => { web.didNavigate(url, view, storage) });
view.webContents.on('preload-error', async (e, path, err) => { console.error("PRELOAD ERROR", err); });

//bekle
view.webContents.on('login', async (e, path, err) => { console.log('ok'); });

view.webContents.on('will-prevent-unload', async (e) => { 
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
view.webContents.forcefullyCrashRenderer();

setTimeout(() => {
if(cacheurlsxx){
view.webContents.loadURL(cacheurlsxx);
} else {
view.webContents.reload();
}
}, 120);
}, 50);

} else {
}
});

//view.webContents.session.on('before-download', (event, item, webContents) => {});
view.webContents.session.on('will-download', this.handleDownload);
//view.webContents.session.on('will-download', async (event, item, webContents) => { willDowloandss(event, item, webContents); });

view.webContents.on('certificate-error', async (e, url, err) => {
e.preventDefault();
console.log(err);
});
}

// Saves an HTML page:
exports.savePage = function(contents) {
let filters = [
{ name: i18n.__('Web Sayfası, Tamamı'), extensions: ['htm', 'html'] },
{ name: i18n.__('Web Sayfası, Yalnızca HTML'), extensions: ['html', 'htm'] },
{ name: i18n.__('Web Sayfası, Tek Dosya'), extensions: ['mhtml'] }
];

let options = {
title: i18n.__('Farklı Kaydet'),
defaultPath: this.current().webContents.getTitle(),
filters: filters
};

dialog.showSaveDialog(options).then((det) => {
if(!det.cancelled){
let path = det.filePath;
let saveType;
if(path.endsWith('htm')) saveType = 'HTMLComplete';
if(path.endsWith('html')) saveType = 'HTMLOnly';
if(path.endsWith('mhtml')) saveType = 'MHTML';

contents.savePage(path, saveType).then(() => {
let input = { message: i18n.__('Sayfa başarıyla kaydedildi.'), type: 'alert',	url: 'Holla' };
ipcRenderer.send('alert',input);
}).catch(err => { console.error(err) });
}
});
}

// Activate (select) a certain tab:
exports.activate = function (view) {
let win = remote.getCurrentWindow();
let views = win.getBrowserViews();
for (let i = 0; i < views.length; i++) {
if(views[i].type == 'tab') win.removeBrowserView(views[i]);
}
win.addBrowserView(view);
document.getElementById('url').value = '';

this.viewActivated(view);

if(document.getElementsByClassName('selected')[0]) {
document.getElementsByClassName('selected')[0].classList.remove('selected');
}

view.tab.element.classList.add('selected');
activeTab = view;

// Synchronize view size with parent window size:
//Code in Mac, Makes pages appear when navigating between tabs 
topbarHeight = realNowtopbarHeight();
view.setBounds({x:windowxview, y:topbarHeight, width:win.getContentBounds().width+windowxviewW, height:win.getContentBounds().height - topbarHeight });
}

// Close a tab:
exports.close = async (view) => { 

view = view || this.current();

if(activeTab == view) {
let id = this.tabs.indexOf(view);
let length = this.tabs.length;

ipcRenderer.send('removetabsPins', view.tab.element.id); 

if (length == 1) { remote.app.quit(); return; }

let nextTab = (id != 0) ? this.tabs[id - 1] : this.tabs[id + 1];
this.activate(nextTab);
}

view.tab.element.remove();

closedTabs.push(view.webContents.getURL());

this.viewClosed(view);
view.webContents.destroy();

}



var oSessionsXGT;
if(store.get('--incognitotab') == '--incognitotab'){
let cids = v1();
oSessionsXGT = 'persist:'+cids+cids;
} else { oSessionsXGT=''; }

// Create a new tab:
exports.newView = function (url='holla://'+newtabBased, active=true, pinsid) {

// BROWSERVIEW CREATION
let view = new BrowserView({
frame: false,
x:windowxview,
with:window.outerWidth+windowxviewW,
webPreferences: {
partition: oSessionsXGT,
nodeIntegration: false,
//webviewTag: true,
nativeWindowOpen: true,
nodeIntegrationInSubFrames: false,
plugins: true ,
webSecurity: true,
worldSafeExecuteJavaScript: true,
executeJavaScript: true,
spellcheck: true,
preload: join(__dirname, 'preload.js')
}
});

/* VPN - Proxy */
var proxyList;
if(store.get('vpn-proxy-opend')){ proxyList = store.get('vpn-proxy-ip'); } else {proxyList = ''; }

view.webContents.session.setProxy({
proxyRules: proxyList,
//proxyRules:`http=foopy,direct://${proxyList}`,  
pacScript: undefined,
proxyBypassRules: 'localhost'
}, () => {
});

// USER AGENT RANDOMIZATION
let version = Math.floor(Math.random() * (69 - 53) + 53); // Grab a random number from 68 to 53 inclusive
// Use the number above as your 'Firefox version' user agent:
//var userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:' + version + '.0) Gecko/20100101 Firefox/' + version + '.0';

var userAgent = dataUserAgentRe;
if(dataUserAgentRe){
view.webContents.setUserAgent(userAgent, store.get('settings.langs')+"tr-TR,en-US,fr,de,ko,zh-CN,ja");
}

let tabSession = view.webContents.session;

view.webContents.session.setPreloads([join(__dirname, 'preload-get-display-media-polyfill.js')]);

view.webContents.setZoomFactor(1.0); 
view.webContents.zoomFactor = 1.0;

// WEBRTC IP HANDLING POLICY
//view.webContents.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');
topbarHeight = realNowtopbarHeight();

// Synchronize view size with parent window size:
view.setBounds({x:windowxview, y:topbarHeight, width:win.getContentBounds().width+windowxviewW, height:win.getContentBounds().height - topbarHeight });

// consider all urls for integrated authentication. '*googleapis.com, *google.com, *google'
tabSession.allowNTLMCredentialsForDomains('*');

// HEADER CONFIGURATION
const filter = { 
urls: [
'*://*.google.com/*', 
'*://*.google.com.tr/*', 
'*://*.googleapis.com/*',
'*://*.gstatic.com/*',
'*://*.spotify.com/*',
'*://*.scdn.com/*',
'*://*.cookielaw.org/*',
'*://*.onetrust.com/*',
'*://*.google-analytics.com/*'
] 
}; 

tabSession.webRequest.onBeforeSendHeaders(filter, (det, callback) => {
let headers = det.requestHeaders;
//if(store.get('flags').includes('--no-referrers')) headers['Referer'] = ''; // Omit 'Referer' header when 'no-referrers' flag is enabled
if(store.get('flags').includes('--do-not-track')) headers['DNT'] = '1'; // Enable DNT for 'do-not-track' flag

headers['Access-Control-Allow-Headers'] = '*';
headers['Access-Control-Allow-Origin'] = '*';
headers['Access-Control-Allow-Credentials'] = true;
/*headers['Accept'] = '*//*';*/
headers['Accept-Language'] = store.get('settings.langs')+', tr-TR;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5'; 

if(dataUserAgentRe){
var url = new URL(det.url); 
if(url.hostname == 'web.whatsapp.com'){
headers['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0";
} else {
if(url.hostname == 'discord.com' || url.hostname == 'cdn.discord.com' || url.hostname == 'cdn.discordapp.com' || url.hostname == 'media.discordapp.net' || url.hostname == 'russia6024.discord.media' || url.hostname == 'gateway.discord.gg'){
headers['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";
} else {
if(url.hostname == 'messenger.com' || url.hostname == 'www.messenger.com'){
headers['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/78.0.4093.231";
} else {
headers['User-Agent'] = userAgent;
}
}
}
}
callback({ cancel: false, requestHeaders: headers }); // Don't cancel the request but use these modified headers instead
});


// THIRD-PARTY COOKIE BLOCKING - Geliştirilicek, google.com, google.com.tr oturum açma çerez engelli
tabSession.cookies.on('changed', async (e, cookie, cause, rem) => {
if(!rem) {
let split = cookie.domain.split('.');
let domain = split[split.length - 2] + '.' + split[split.length - 1];
try {
split = (new URL(view.webContents.getURL())).host.split('.');
let host = split[split.length - 2] + '.' + split[split.length - 1];
if(domain != host) {
if(host == 'google.com' || host == 'youtube.com'){} else {
if(store.get('settings.auto_clear_cookies')){
tabSession.cookies.remove(view.webContents.getURL(), cookie.name);
//console.log('COOKIE Passive '+domain);
} else { /*console.log('bu özellik kapalı');*/ }
}

}
} catch (error) {
//console.log('### COOKIE OOF')
}
}
});


// CUSTOM PROTOCOLS
tabSession.protocol.registerHttpProtocol('ipfs', (req, cb) => {
var hash = req.url.substr(7);
cb({ url: 'https://ipfs.io/ipfs/' + hash });
}, () => {});

// PDF READER , JSON VİEWWER
tabSession.webRequest.onResponseStarted(async (det) => {

let type = det.responseHeaders['Content-Type'] || det.responseHeaders['content-type'];
let resource = det.resourceType;

if(!resource || !type) return;
let query = '?url=' + encodeURIComponent(det.url);
if(resource == 'mainFrame' && type[0].includes('application/json')) {
if(store.get('settings.json_viewer')){ 
view.webContents.loadURL(join(__dirname, '..', 'static', 'json-viewer', 'index.html') + query);
}
} else if (resource == 'mainFrame' && type[0].includes('application/pdf')) {
//view.webContents.loadURL(join(__dirname, '..', 'static', 'pdf', 'index.html') + query);
} 
});


/*
tabSession.protocol.interceptFileProtocol('chrome-extension', async (req, cb) => {
if(!req.url.includes('mhjfbmdgcfjbbpaeojofohoefgiehjai')) return;
let relative = req.url.replace('chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/', '');
cb(join(__dirname, '..', 'static', 'pdf', relative));
});
*/

// tabSession.protocol.registerFileProtocol('pdf', (req, cb) => {
//   var url = req.url.substr(6);
//   let result = join(__dirname, '../static/pdf/', url);
//   console.log(result);
//   cb(result); // + '' + url
// }, (error) => {});

/* hata oluyor bazı sayfalar yüklenmiyor
tabSession.protocol.interceptFileProtocol('chrome-extension', async (req, cb) => { 
var url = req.url.replace(new URL(req.url).protocol, ''); 
if(req.url.includes('pkedcjkdefgpdelpbcmbmeomcjbeemfm')){
cb(join(__dirname, '../chrome-extension/', url));    
}
});
*/

/*
tabSession.protocol.registerFileProtocol('chrome-extension', (req, cb) => {
var url = req.url.replace(new URL(req.url).protocol, ''); 
console.log(join(__dirname, '../chrome-extension/', url));
cb(join(__dirname, '../chrome-extension/', url));
}, () => {});
*/

tabSession.protocol.registerFileProtocol('assets', (req, cb) => {
var url = req.url.replace(new URL(req.url).protocol, '');
if(url.includes('..')) {
cb(join(__dirname, '../css/favicon.png'));
} else {
cb(join(__dirname, '../css/', url));
}
}, () => {});

tabSession.protocol.registerFileProtocol('holla', (req, cb) => {
var url = new URL(req.url); 
if(url.pathname == '//ag-hatasi') {
cb(join(__dirname, '../static/pages/', `ag-hatasi.html`));
} else {

if(url.pathname == '//gizli-yeni-sekme') {

if(newtabBased == 'gizli-yeni-sekme'){ 
if(url.pathname == '//yeni-sekme') {
cb(join(__dirname, '../static/pages/', `gizli-yeni-sekme.html`));
} else {
url = req.url.replace(url.protocol, '');
cb(join(__dirname, '../static/pages/', `${ url }.html`));
}

} else {
cb(join(__dirname, '../static/pages/', `yeni-sekme.html`));
}

} else {        
url = req.url.replace(url.protocol, '');
cb(join(__dirname, '../static/pages/', `${ url }.html`));
}

}
}, () => {});

// CLOSE HANDLING
ipcMain.on('closeCurrentTab', async (e, id) => { 
if(id == view.webContents.id) this.close(view);
});

// CONTEXT (RIGHT-CLICK) MENU
contextMenu({
//window  : view.webContents,
window  : view,
prepend: (defaultActions, params, WebContents) => [
{
label: i18n.__('Geri'),
accelerator: 'Alt+Left',
visible: params.selectionText.length == 0,
enabled: view.webContents.canGoBack(),
click: async () => { view.webContents.goBack(); }
},
{
label: i18n.__('İleri'),
accelerator: 'Alt+Right',
visible: params.selectionText.length == 0,
enabled: view.webContents.canGoForward(),
click: async () => { view.webContents.goForward(); }
},
{
label: i18n.__('Yeniden Yükle'),
accelerator: 'CmdOrCtrl+R',
visible: params.selectionText.length == 0,
click: async () => { view.webContents.reload(); }
},
{
type: 'separator'
},
{
label: i18n.__('Farklı Kaydet'),
accelerator: 'CmdOrCtrl+S',
visible: params.selectionText.length == 0,
click: async () => { this.savePage(view.webContents); }
},
{
type: 'separator'
},
{
label: i18n.__('Resmi Yeni Sekmede Aç'),
visible: params.mediaType === 'image',
click: async () => { this.newView(params.srcURL); /* view.webContents.loadURL(params.srcURL); */ }
},
{
label: i18n.__('Bağlantıyı Yeni Sekmede Aç'),
visible: params.linkURL.length > 0,
click: async () => { this.newView(params.linkURL); }
},
{
label: i18n.__('Google İle Ara')+' “{selection}”',
visible: params.selectionText.trim().length > 0,
click: async () => { this.newView(`https://www.google.com/search?q=${encodeURIComponent(params.selectionText)}`); }
},
{
label: i18n.__('Sayfa Kaynağını Görüntüle'),
visible: view.webContents.getURL().includes('holla://') == false,
click: async () => { 
let currentURL = view.webContents.getURL();
$.get(currentURL, async (data,status,xhr) => {
store.set('viewSourceMAINCode', data);
store.set('viewSourceURL', currentURL);
this.newView('holla://kaynagi-goruntule');
});
}
},
{
label: i18n.__('İncele'),
visible: view.webContents.getURL().includes('holla://') == false,
click: async () => { 
//view.webContents.openDevTools({ mode: 'detach' }); 
view.webContents.inspectElement(params.x, params.y);
}
},
{
label: i18n.__('Görünüm'),
submenu: [
{ 
label: i18n.__('resetZoom'), 
//role: 'resetZoom' 
click: async () => { 
view.webContents.setZoomFactor(1.0); 
view.webContents.zoomFactor = 1.0;
}
},
{ 
label: i18n.__('zoomIn'), 
//role: 'zoomIn' 
click: async () => { 
var currentZoom = view.webContents.getZoomFactor(); 
view.webContents.zoomFactor = currentZoom + 0.2; 
}
},
{ 
label: i18n.__('zoomOut'), 
//role: 'zoomOut' 
click: async () => { 
var currentZoom = view.webContents.getZoomFactor(); 
view.webContents.zoomFactor = currentZoom - 0.2; 
}
},
{ type: 'separator' },
{ label: i18n.__('togglefullscreen'), role: 'togglefullscreen' }
]
}
],
labels: {
//spellCheck: 'xxx-spellCheck',
//learnSpelling: 'xxx-learnSpelling',
//separator: 'xxx-altBoşlukÇizgi',
lookUpSelection: i18n.__('Danışın')+' “{selection}”',
searchWithGoogle: i18n.__('Google İle Ara'),
cut: i18n.__('Kes'),
copy: i18n.__('Kopyala'),
paste: i18n.__('Yapıştır'),
saveImage: i18n.__('Resmi Kaydet'),
saveImageAs: i18n.__('Resmi Farklı Kaydet'),
copyImage: i18n.__('Resmi Kopyala'),
copyImageAddress: i18n.__('Resim Adresini Kopyala'),
copyLink: i18n.__('Bağlantıyı Kopyala'),
saveLinkAs: i18n.__('Bağlantıyı Kaydet'),
inspect: i18n.__('İncele'),
//services: 'xxx'
},
showLookUpSelection: true,
showCopyImageAddress: true,
showSaveImageAs: true,
showInspectElement: false,
showSearchWithGoogle: false
});

//burası tab html oluşturma yeri
var tabEl = document.createElement('div');
tabEl.classList.add('tab');
tabEl.classList.add('tab-drag');
let v1ids;

if(pinsid){
v1ids = pinsid;
} else {
v1ids = v1();   
}

let tone = window.theme === 'dark' ? 'dark' : 'light';
tabEl.innerHTML = `<img id="${v1ids}" class="tab-icon" src="images/loading-${tone}.gif">
<p id="${v1ids}" class="tab-label">${ i18n.__('Yükleniyor...') }</p>
<img id="${v1ids}" class="tab-close" src="images/close.svg">`.trim();
//view.tab.setIcon(); 
document.getElementById('new-tab').insertAdjacentElement('beforebegin', tabEl);

view.tab = {
element: document.getElementById('new-tab').previousElementSibling,
setIcon: async (icon) => {
/*view.tab.icon.addEventListener("error", () => { view.tab.icon.src = '//:0' });*/
if(icon && icon != 'null/favicon.ico') { view.tab.icon.src = icon; }
},
setTitle: async (title) => { view.tab.title.innerText = title; },
close: async () => { view.tab.element.remove(); }
};

view.tab.element.style.opacity = '1';
view.tab.element.style.width = '200px';
view.tab.element.id =  v1ids;
view.tab.icon = view.tab.element.children[0];

if(pinsid){ 
if(url.includes('holla://')){ 
view.tab.setIcon('images/public.svg');
}
}

view.tab.title = view.tab.element.children[1];
view.tab.button = view.tab.element.children[2];


if(pinsid){
var anatabssx = document.getElementById(pinsid);

var parentx = document.getElementById('npin-tab');
var parentsx = document.getElementById('tabs');

if(!anatabssx.classList.contains('tab-pins')){
parentx.append(anatabssx);
}
parentsx.prepend(parentx);

anatabssx.classList.add('tab-pins');
anatabssx.classList.add('tab-drag');
}


//async function xnewView(view){this.newView(view.webContents.getURL());}

async function tabmenuss(view,xid){
// TAB MENU
let tabMenuTemp = [
{ label: i18n.__('Yeniden Yükle'), click: async() => view.webContents.reload() },
{ label: i18n.__('Yenile'), click: async() => { ipcRenderer.send('openPage', view.webContents.getURL()); } },

{ 
label: view.webContents.isAudioMuted() ? i18n.__('Sitenin Sesini Aç') : i18n.__('Sitenin Sesini Kapat'), 
click: async() => {
if(!view.webContents.isAudioMuted()){
view.webContents.setAudioMuted(true);
if(view.webContents.isCurrentlyAudible()){
view.tab.setIcon('images/volume_off.svg');
} 

} else { 
view.webContents.setAudioMuted(false);
if(view.webContents.isCurrentlyAudible()){
view.tab.setIcon('images/volume_on.svg');
}
}

} 
},

{ 
label: document.getElementById(xid).classList.contains('tab-pins') ? i18n.__('Sabitlemeyi Kaldır') : i18n.__('Sabitle'), 
click: async() => {
//alert(i18n.__('Geliştirme aşamasında !'))
var anatabss = document.getElementById(xid);

var parent = document.getElementById('npin-tab');
var parents = document.getElementById('tabs');

if(!anatabss.classList.contains('tab-pins')){
//view.webContents.session.tabpinid = xid;
parent.append(anatabss);
} else {
//view.webContents.session.tabpinid = "";
parents.prepend(anatabss);
}

parents.prepend(parent);

anatabss.classList.toggle('tab-pins');
anatabss.classList.toggle('tab-drag');
if(view.webContents.getURL().includes('holla://') || view.webContents.getURL().includes('file://')){
if(!anatabss.classList.contains('tab-pins')){view.tab.setIcon('//:0');} else {view.tab.setIcon('images/public.svg');}
}
ipcRenderer.send('logtabsPins', view.webContents.getURL(), xid); 
}
},

{ type: 'separator' },

{ 
label: i18n.__('Kapat'), 
click: async() => {
// this.close(view); 
var closed = document.getElementById(xid);
var cloedimg = closed.querySelector(".tab-close");
cloedimg.click();
} 
}
];

Menu.buildFromTemplate(tabMenuTemp).popup();
}

view.tab.element.addEventListener('mousedown', async (e) => {
switch (e.which) {
case 1:
this.activate(view);
break;
case 2:
this.close(view);
break;
case 3:
tabmenuss(view,e.path[0].id); 
break;
default:
break;
}
});

view.tab.button.addEventListener('click', async (e) => {
e.stopPropagation();
this.close(view);
});

view.type = 'tab';

if(url == 'holla://yeni-sekme'){
//view.webContents.loadURL(join(__dirname, '..', 'static', 'pages', 'yeni-sekme.html'));
view.webContents.loadURL(require('url').format({
pathname: join(__dirname, '../static/pages/yeni-sekme.html'),
protocol: 'file:',
slashes: true
}));
} else {
if(url == 'holla://bird'){
view.webContents.loadURL(require('url').format({
pathname: join(__dirname, '../static/pages/bird.html'),
protocol: 'file:',
slashes: true
}));
} else {    
view.webContents.loadURL(url);
}
}

this.initBrowserView(view);
this.viewAdded(view);
if(active) { this.activate(view); this.activate(view); }
return view;
}

// Navigate to the next tab relative to the active one:
exports.nextTab = async () => {
let length = this.tabs.length;
let index = this.tabs.indexOf(activeTab);

if (length == 1) return;

if (index == length - 1) { this.activate(this.tabs[0]); }
else { this.activate(this.tabs[index + 1]); }
}

// Navigate to the previous tab relative to the active one:
exports.backTab = async () => {
let length = this.tabs.length;
let index = this.tabs.indexOf(activeTab);

if (length == 1) return;

if (index == 0) { this.activate(this.tabs[length - 1]); }
else { this.activate(this.tabs[index - 1]); }
}

exports.viewActivated = function (view) { web.changeTab(view, storage); }
exports.viewAdded = function (view) { this.tabs.push(view); ipcRenderer.send('viewAdded'); }
exports.viewClosed = function (view, tabs=this.tabs) {
const index = tabs.indexOf(view);
if (index > -1) tabs.splice(index, 1);
}

exports.showDialog = async (text) => {
let { BrowserView } = remote;
let view = new BrowserView();
view.webContents.loadURL('data:,' + encodeURIComponent(text));
remote.getCurrentWindow().addBrowserView(view);
}

document.getElementById('new-tab').addEventListener('click', async () => this.newView('holla://'+newtabBased));

remote.app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
console.log(certificate, error);
event.preventDefault();
callback(true);
});

setTimeout(() => {
this.initDownloads();
}, 2000);
