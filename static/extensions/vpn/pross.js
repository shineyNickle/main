/* Alexa Traffic Uzantısı */
const { remote } = require('electron');
const {
BrowserWindow,
nativeTheme,
ipcMain,
app,
Menu,
ipcRenderer,
session 
} = remote;
const { join } = require('path');

/* Uzantıların Olduğu Yeri Bul - plugingoreas */
var headDivSelecetVPN = document.getElementById('extensionsMod');

var idkey = 'vpn';

/* Eklentiler Üst Menüye Ekle */
if(document.getElementById(idkey)){
document.getElementById(idkey).addEventListener('click', async () => { 
exVPN();
});
} else {
var vpnproxyopend = store.get('vpn-proxy-opend');
if(vpnproxyopend){
var logoss = join(__dirname, 'Holla-VPN.png');
} else {
var logoss = join(__dirname, 'Holla-VPN-Closed.png');
}

headDivSelecetVPN.innerHTML += `
<button id="${idkey}" class="re-site-info">
<img id="vpnimage${idkey}" src="${logoss}">
</button>`;

setTimeout(()=>{  
document.getElementById(idkey).addEventListener('click', async () => {
exVPN();
});
}, 1000);
}

async function exVPN() {
let mainWindowVPN = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
//skipTaskbar: true,
width: 300,
height: 400,
x: Math.ceil(document.getElementById(idkey).getBoundingClientRect().left + window.screenX) - 280,
y: Math.ceil(document.getElementById(idkey).getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(document.getElementById(idkey), null).height.replace("px", ""))),
//alwaysOnTop: true,
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

let create_loadModalVPN = require('url').format({
pathname: join(__dirname, 'index.html'),
protocol: 'file:',
slashes: true
});

mainWindowVPN.focus();
mainWindowVPN.webContents.once('dom-ready', async () => {
});

mainWindowVPN.on('blur', async () => {
mainWindowVPN.close();
});

//mainWindowVPN.openDevTools({ mode: 'detach' });

mainWindowVPN.loadURL(create_loadModalVPN);
}