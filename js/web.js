var firstTime = true;

let { remote, ipcRenderer } = require('electron');

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

function webContents(webview) { return remote.webContents.fromId(webview.getWebContentsId()); }
exports.webContents = webContents;

// STORAGE
const Store = require('electron-store');
window.store = new Store();

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

let countProsseLo = false;

function setURLBar(url) {
let bar = document.getElementById('url');
if(!firstTime) {
try {
if(url == 'holla://'+newtabBased) {
bar.value = '';
bar.focus();
bar.select();
} else {
let protocol = (new URL(url)).protocol;
if(!protocol.startsWith('file')) bar.value = protocol.startsWith('http') ? url.substr(protocol.length + 2) : url;
}
} catch (e) {}
} else {
firstTime = false;
}
}
exports.setURLBar = setURLBar;

function setSearchIcon(url) {
document.getElementById('site-info').style = '';

try {
let protocol = (new URL(url)).protocol;

if(protocol == 'http:') {
document.getElementById('site-info').classList.remove('secure');
document.getElementById('site-info').classList.add('insecure');
document.querySelector('site-info > img').src = 'images/alert.svg';
}
else if(protocol == 'https:') {
document.getElementById('site-info').classList.remove('insecure');
document.getElementById('site-info').classList.add('secure');
document.getElementById('site-info > img').src = 'images/lock.svg';
} else {
document.getElementById('site-info').classList.remove('secure');
document.getElementById('site-info').classList.remove('insecure');
document.querySelector('site-info > img').src = 'images/search.svg';
}
} catch (e) {}
}
exports.setSearchIcon = setSearchIcon;

exports.init = function (doc) { document = doc }

exports.loadStart = function(view, extensions) {
let tone = window.theme === 'dark' ? 'dark' : 'light';
view.tab.setIcon('images/loading-' + tone + '.gif');

view.tab.setTitle('Yükleniyor...');

document.getElementById('bookmark').style.visibility = 'hidden';
document.getElementById('refresh').firstElementChild.src = 'images/close.svg';
}

exports.loadStop = function(view, extensions) {
document.getElementById('refresh').firstElementChild.src = 'images/refresh.svg';

view.webContents.executeJavaScript(`document.querySelectorAll('link[rel="shortcut icon"]').length`)
.then(r => {
if(r > 0) {
view.webContents.executeJavaScript(`document.querySelector('link[rel="shortcut icon"]').href`)
.then(u => view.tab.setIcon(u));
} else {

view.webContents.executeJavaScript(`document.querySelectorAll('link[rel="icon"]').length`)
.then(r => {
if(r > 0) {
view.webContents.executeJavaScript(`document.querySelector('link[rel="icon"]').href`)
.then(u => view.tab.setIcon(u));
} else {
let origin = new URL(view.webContents.getURL()).origin;
//view.tab.setIcon(origin + '/favicon.ico');
if(!view.webContents.getURL().includes('holla://') && !view.webContents.getURL().includes('file://')){
var icons = `https://www.google.com/s2/favicons?sz=64&domain_url=${origin}`;
view.tab.setIcon(icons);
} else { 

if(view.tab.element.classList.contains('tab-pins')){
if(view.webContents.getURL().includes('holla://') || view.webContents.getURL().includes('file://')){
view.tab.setIcon('images/public.svg');
} else {view.tab.setIcon('//:0'); }
} else {view.tab.setIcon('//:0'); }

}
}
});

}
});
view.tab.setTitle(view.webContents.getTitle());
}

exports.failLoad = function(event, view, errorCode, errorDescription, validatedURL) {
if(errorCode != -27 && errorCode != -3 && view.webContents.getURL() == validatedURL) {
window.error = {errorCode: errorCode,
errorDescription: errorDescription,
validatedURL: validatedURL,
darkMode: window.darkMode};
view.webContents.loadURL('holla://ag-hatasi');
}
}

exports.didNavigate = function (url, view, storage) {
view.webContents.session.ads_blocked = 0;

try {
let protocol = (new URL(url)).protocol;
if(protocol.startsWith('http')) {
if(!countProsseLo){ 
countProsseLo = true;

if(newtabBased == 'gizli-yeni-sekme'){} else { 
setTimeout(()=>{ storage.logHistory(url, view.webContents.getTitle()); countProsseLo = false; }, 1300);
}

}
}
} catch (e) {}
setSearchIcon(url);
}

exports.enterFllscrn = function(view, screen) {
var xwidth = screen.getPrimaryDisplay().size.width;
var xheight = screen.getPrimaryDisplay().size.height;
view.setBounds({ x: 0, y: 0, width: xwidth, height: xheight });
}

exports.leaveFllscrn = function(view, bounds) {
topbarHeight = realNowtopbarHeight();
view.setBounds({x:windowxview, y:topbarHeight, width:bounds.width+windowxviewW, height:bounds.height-topbarHeight});
view.setBounds({x:windowxview, y:topbarHeight, width:bounds.width+windowxviewW, height:bounds.height-topbarHeight});
}

exports.domReady = function (view, storage) {

setURLBar(view.webContents.getURL());

view.webContents.insertCSS('input::-webkit-calendar-picker-indicator {display: none;}');

storage.isBookmarked(view.webContents.getURL()).then((result) => {
document.getElementById('bookmark').style.visibility = 'visible';
if(result){
document.getElementById('bookmark').firstElementChild.src = 'images/bookmark-saved.svg';
} else {
document.getElementById('bookmark').firstElementChild.src = 'images/bookmark.svg';
}
});

if (view.webContents.canGoBack()) { document.getElementById('back').removeAttribute('disabled') }
else { document.getElementById('back').setAttribute('disabled', true) }
if (view.webContents.canGoForward()) { document.getElementById('forward').removeAttribute('disabled') }
else { document.getElementById('forward').setAttribute('disabled', true) }

if(window.theme == 'dark') {
view.webContents.insertCSS(`
::-webkit-scrollbar { width: 17px; }
::-webkit-scrollbar-track { background-color: #2E3440;}
::-webkit-scrollbar-thumb { background-color: #3B4252;}
::-webkit-scrollbar-thumb:hover { background-color: #434C5E;}
::-webkit-scrollbar-corner { display: none; }`);
}

switch (view.webContents.getURL()) {
case 'holla://ag-hatasi':
view.webContents.send('setError', window.error);
window.error = {errorCode: '-300', validatedURL: 'holla://ag-hatasi', darkMode: window.darkMode};
break;
default:
break;
}
}

exports.newWindow = function (newView, url, frameName, disp, legit=false) {
if(legit) newView(url);
}

exports.faviconUpdated = function (view, favicons) {
if(favicons && favicons.length > 0) { view.tab.setIcon(favicons[0]); }
}

exports.titleUpdated = function (view, event, title) {
view.tab.setTitle(title);
view.tab.title.title = title;
}

exports.changeTab = function (view, storage) {
setURLBar(view.webContents.getURL());
setSearchIcon(view.webContents.getURL());

storage.isBookmarked(view.webContents.getURL()).then((result) => {
document.getElementById('bookmark').style.visibility = 'visible';
if(result){
document.getElementById('bookmark').firstElementChild.src = 'images/bookmark-saved.svg';
} else {
document.getElementById('bookmark').firstElementChild.src = 'images/bookmark.svg';
}
});

try {
let protocol = (new URL(view.webContents)).protocol;
if(protocol.startsWith('http')) setSearchIcon(view.webContents.getURL());
} catch (e) {}

try {
if (view.webContents.canGoBack()) { document.getElementById('back').removeAttribute('disabled') }
else { document.getElementById('back').setAttribute('disabled', true) }
if (view.webContents.canGoForward()) { document.getElementById('forward').removeAttribute('disabled') }
else { document.getElementById('forward').setAttribute('disabled', true) }
} catch (e) {}
}

exports.exitPointerLock = function (view) {
view.webContents.executeJavaScript(`document.exitPointerLock();`);
}