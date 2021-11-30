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

/* Uzantıların Olduğu Yeri Bul */
var headDivSelecet = document.getElementById('extensionsMod');

var idkey = 'alexsa';

/* Eklentiler Üst Menüye Ekle */
if(document.getElementById(idkey)){
document.getElementById(idkey).addEventListener('click', async () => { console.log('alexsa');
exAlexaTraffic();
});
} else {
headDivSelecet.innerHTML += `<button id="${idkey}"><img src="${join(__dirname, 'Alexa-Traffic-Rank.png')}"></button>`;
setTimeout(()=>{  
document.getElementById(idkey).addEventListener('click', async () => {
exAlexaTraffic();
});
}, 1000);
}

async function exAlexaTraffic() {
let mainWindowExAlexsa = new BrowserWindow({
frame: false,
transparent: true,
resizable: false,
//skipTaskbar: true,
width: 416,
height: 381,
x: Math.ceil(document.getElementById(idkey).getBoundingClientRect().left + window.screenX) - 385,
y: Math.ceil(document.getElementById(idkey).getBoundingClientRect().top + window.screenY
+ parseFloat(getComputedStyle(document.getElementById(idkey), null).height.replace("px", ""))),
//alwaysOnTop: true,
parent: remote.getCurrentWindow(),
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true
}
});

let create_loadModal = require('url').format({
pathname: join(__dirname, 'index.html'),
protocol: 'file:',
slashes: true
});

mainWindowExAlexsa.focus();
mainWindowExAlexsa.webContents.once('dom-ready', async () => {
});

mainWindowExAlexsa.on('blur', async () => {
mainWindowExAlexsa.close();
});

//mainWindowExAlexsa.openDevTools({ mode: 'detach' });

mainWindowExAlexsa.loadURL(create_loadModal);
}