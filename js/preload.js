// PACKAGES
const {	ipcRenderer, remote } = require('electron');
const { v1 } = require('uuid');

//Dil Bağlantısı
//Language Connection
var i18n = new(require('../translations/i18n'));

// ANTI-FINGERPRINTING
async function modifyDefault (defaultVar, name, value) {
if (Object.defineProperty) {
Object.defineProperty(defaultVar, name, {
get: () => { return value }
});
} else if (Object.prototype.__defineGetter__) {
defaultVar.__defineGetter__(name, () => { return value });
}
}

modifyDefault(document, 'referrer', '');
modifyDefault(navigator, 'doNotTrack', '1');
//modifyDefault(navigator, 'deviceMemory', undefined);
modifyDefault(navigator, 'hardwareConcurrency', Math.round(Math.random()) == 0 ? 4 : 8);
modifyDefault(navigator, 'appCodeName', Math.round(Math.random()) == 0 ? 'Mozilla' : 'Holla');
modifyDefault(navigator, 'appName', Math.round(Math.random()) == 0 ? 'Netscape' : 'Holla');
modifyDefault(navigator, 'mimeTypes', Math.round(Math.random()) == 0 ? {} : navigator.mimeTypes);
modifyDefault(navigator, 'plugins', Math.round(Math.random()) == 0 ? {} : navigator.plugins);
modifyDefault(screen, 'colorDepth', Math.round(Math.random()) == 0 ? 24 : 32);

window.close = e => { ipcRenderer.send('closeCurrentTab', remote.getCurrentWebContents().id); };
/*
navigator.getBattery = () => {};
if(navigator.mediaDevices) navigator.mediaDevices.enumerateDevices = ()=>{return new Promise((r)=>{r(undefined)})}
*/

// DIALOG HANDLERS
global.alert = window.alert = (message) => {
let url = (window.location.href.startsWith('holla')) ? 'holla' : window.location.href;

ipcRenderer.send('alert', {
message: message,
type: 'alert',
url: url
});
}

global.confirm = window.confirm = (message) => {
let url = (window.location.href.startsWith('holla')) ? 'holla' : window.location.href;

return ipcRenderer.sendSync('alert', {
message: message,
type: 'confirm',
url: url
});
}

global.prompt = window.prompt = (message) => {
let url = (window.location.href.startsWith('holla')) ? 'holla' : window.location.href;

return ipcRenderer.sendSync('alert', {
message: message,
type: 'prompt',
url: url
});
}

// FULLSCREEN HANDLERS
let esc_pointer = event => { if (event.keyCode === 27) { document.exitPointerLock(); } };
let esc_fullscreen = event => { if (event.keyCode === 27) { document.exitFullscreen(); } };

let pointerlockchange = async (e) => {
if (document.pointerLockElement) {
alertNewPopups(i18n.__('Çıkmak İçin ESC Basın'),'fullScreenYaanis','col-fullscren-yaani',i18n.__('İmlecinizi göstermek için ESC ye basın'),2000);
document.addEventListener("keydown", esc_pointer);
} else {
document.removeEventListener("keydown", esc_pointer);
}
};
let fullscreenchange = async (e) => {
console.log('fullscreenchange');
if (document.fullscreenElement) {
//ipcRenderer.send('fullscreenchange');
alertNewPopups(i18n.__('Çıkmak İçin ESC Basın'),'fullScreenYaanis','col-fullscren-yaani',i18n.__('Tam ekrandan çıkmak için ESC tuşuna basın'),2000);
document.addEventListener("keydown", esc_fullscreen);
} else {
document.removeEventListener("keydown", esc_fullscreen);
}
}

document.addEventListener('pointerlockchange', pointerlockchange, false);

document.addEventListener('fullscreenchange', fullscreenchange);
document.addEventListener('webkitfullscreenchange', fullscreenchange);

// PDF Reader

// window.addEventListener('load', async e => {
// 	if(document.querySelectorAll('embed[type="application/pdf"]').length == 1) {
// 		document.body.innerHTML = `<iframe style="position: absolute; height: 100%; width: 100%; border: none;"
// 			src="https://holla.com.tr/pdf-viewer.html?file=${window.location.href}"></iframe>`;
// 	}
// });

// IPC FEATURES
if (window.location.protocol == 'holla:' || window.location.protocol == 'file:') {
ipcRenderer.once('setError', (event, details) => {
setError(details);
});

global.sendSync = ipcRenderer.sendSync;
global.send = ipcRenderer.send;
global.on = ipcRenderer.on;
global.ipcRenderer = ipcRenderer;
global.fs = require('fs');
global.dirname = __dirname;
global.i18n = i18n;
global.randomkey = v1();
}

async function alertNewPopups(xtitle,xid,xclass,xmessage,xduration) {
var itemEl = document.createElement('div');
itemEl.title = xtitle;
itemEl.id = xid;
itemEl.className = xclass;
itemEl.innerHTML = `
<style>.esc{font-size: 11px;display: inline-flex;border: solid 1px white;border-radius: 5px;padding: 8px;margin: 0 10px;color: white;}</style>
<div player-fullscreen fullscreen class="full-card-yaani" style="font-family: verdana;position: fixed;top: 60px;margin: 0 auto;z-index: 999999999;left: 0;right: 0;width: 100%;text-align: center;max-width: 290px;padding: 10px 3px;background: rgb(7 20 31 / 42%);color: white;font-size: 12px;border-radius: 5px;    backdrop-filter: blur(1px); ">
${xmessage}
</div>
`.trim();
document.body.appendChild(itemEl);

var hvideos = document.getElementsByTagName("video")[0];
if(hvideos){
var s = document.getElementById("fullScreenYaanis");
hvideos.insertAdjacentElement("afterend", s);
}

setTimeout(function(){ document.getElementById(xid).remove(); }, xduration);
}


/* Sayfa Yüklendi */
window.addEventListener('load', async e => {

/* Fare Sağ Ve Orta Tıklama - Yeni Pencere Açma _blank */
document.addEventListener('auxclick', async e => { 
if (e.button == 1) {
e.preventDefault();
var links = e.path;
for (items of links){
if(items.localName == 'a') {
ipcRenderer.send('openPageNews', items.href);
}
}
}
});

document.addEventListener('click', async e => { 
//if(e.target.localName == 'a') { 
if(e.target.closest('a')){

if(e.target.closest('a').href){
ipcRenderer.send('cacheURLClicks', e.target.closest('a').href, 'set');
}

if(e.target.closest('a').href && e.target.closest('a').target == '_blank'){
//e.preventDefault();
//ipcRenderer.send('openPageNews', e.target.closest('a').href);
}

}
});


/* Yeni Pencere Açma a etiketinde _blank varsa */
/*
[].forEach.call(document.getElementsByTagName("a"),function(el){ 
if (el.target == "_blank") { 
el.addEventListener("click",function(e){
e.preventDefault();  
//window.location.href = el.href;
ipcRenderer.send('openPageNews', el.href);
});
}
});
*/


setTimeout(() => {

/* şifre ve bilgieri kaydetme */
[].forEach.call(document.getElementsByTagName("form"),(el) =>{
var siteurl = window.location.hostname;
var loginurl = window.location.href;

if(!siteurl){siteurl='localhost'}
if(!loginurl){loginurl='localhost'}

var xinputs = el.getElementsByTagName("input");

var history = ipcRenderer.sendSync('getSaveInfoXcont');
let itemCaches = [];
Object.values(history).forEach((historyItem, i) => {
if(historyItem.url == siteurl){
itemCaches.push(historyItem);
}
});
var datasitems = itemCaches;


for (items of xinputs){

if(items.type == 'password' || items.name == 'password' || items.name == 'pass' || items.name == 'sifre' 
|| items.name == 'session[password]' || items.name == 'session_password'){
var password = items; 
}


if(items.type == 'email' || items.name == 'email' || items.name == 'mail' || items.name == 'eposta' || items.name == 'username' || items.name == 'kullaniciadi' 
|| items.name == 'session[username_or_email]' || items.name == 'session_key'){
var usernameormail = items; 

if(datasitems.length){ 

usernameormail.addEventListener("focus",function(e){ 
if(!usernameormail.id){usernameormail.id="username_auto_idcreates"}
var h = document.getElementById(usernameormail.id);
/*
usernameormail.insertAdjacentHTML('afterbegin',`
<div id="getSaveInfoXcont"></div>
`.trim());*/
document.body.insertAdjacentHTML('afterbegin',`
<div id="getSaveInfoXcont"></div>
`.trim());

var s = document.getElementById("getSaveInfoXcont");
//h.insertAdjacentElement("afterend", s);

var left = Math.ceil(h.getBoundingClientRect().left + window.screenX);
var top = Math.ceil(h.getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(h, null).height.replace("px", "")))+5;

s.innerHTML = `
<style>
.xsubmainproslo, #btnreas{
padding: 10px 10px;
cursor: pointer;
font-family: system-ui;
font-size: 14px;
margin: 1px 0;    text-align: left; color: black;
border-bottom: solid 1px rgb(243 243 243 / 49%);
}
.xsubmainproslo:hover, #btnreas:hover { background:#f7f7f7; }
#btnreas input{cursor: pointer;}
</style>
<div id="getSaveInfoXcont2" 
style="position: absolute;top: ${top}px;left: ${left}px;min-width: ${h.clientWidth}px;max-width: ${h.clientWidth}px;max-height: 260px;background: white;border: solid 1px #e4e4e4;overflow: auto;z-index: 999999;">
<div style="padding: 5px 0px;" id="addDataAutoFill">
</div>
</div>
`.trim();

for (item of datasitems){
var addDataAutoFill = document.getElementById("addDataAutoFill");
addDataAutoFill.innerHTML+= ` <div id="btnreas" class="${item.title},${item.pass}">
<input class="${item.title},${item.pass}" disabled style="opacity: 1;width: 50%;border: none;background: transparent;" type="text" value="${item.title}">
<input class="${item.title},${item.pass}" disabled style="opacity: 1;width: 50%;border: none;background: transparent;" type="password" value="${item.pass}">
</div>`;
}


});
usernameormail.addEventListener("blur",function(e){
if(document.getElementById("getSaveInfoXcont2")){
document.getElementById("getSaveInfoXcont2").addEventListener('click', async e => { 
var key = e.path[0].className.split(","); 
if(key[0] && key[1]){
usernameormail.value = key[0];
password.value = key[1];
}
});
}
setTimeout(() => {
if(document.getElementById("getSaveInfoXcont")){document.getElementById("getSaveInfoXcont").remove();}
}, 90);
});



}

}

}


window.onbeforeunload = function(e){ 
if(siteurl == 'www.twitter.com' || siteurl == 'twitter.com' || siteurl == 'accounts.google.com'){
e.preventDefault();
if(usernameormail && password){
if(usernameormail.value && password.value){
ipcRenderer.send('logSaveInfoXcont', siteurl, usernameormail.value, password.value, loginurl);
}}
}
};


el.addEventListener('submit', function(evt){ 
//evt.preventDefault(); 
if(usernameormail && password){
if(usernameormail.value && password.value){
ipcRenderer.send('logSaveInfoXcont', siteurl, usernameormail.value, password.value, loginurl);
}
}
});

});

}, 1000);

//Dil Çeviri Yap
var i18nTitle = document.getElementById("i18n");
if(i18nTitle){ i18nTitle.innerHTML = i18n.__(i18nTitle.innerHTML); }

[].forEach.call(document.getElementsByClassName("i18n"),function(el){ 
if(el.placeholder){ el.placeholder = i18n.__(el.placeholder); }
if(el.title){ el.title = i18n.__(el.title); }
});

[].forEach.call(document.getElementsByTagName("i18n"),function(el){ 
var keyslo = el.innerHTML;
el.innerHTML = i18n.__(keyslo);
el.style.display = 'block';
});


});