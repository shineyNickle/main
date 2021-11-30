const { app, BrowserWindow, dialog, ipcMain, ipcRenderer, session } = require('electron');

const isDevMode = require('electron-is-dev');
const { format } = require('url');
const { join } = require('path');
const os = require('os');

const shell = require('electron').shell;
//import { shell } from 'electron';

//STORAGE - DEPOLAMA
const Store = require('electron-store');
let store = new Store();
//let store = new Store({ name: 'sadsad' });


//user agent set
if (!store.get('settings.user_agent')) {
store.set('settings.user_agent', 'Holla');
}

if (!store.get('userAgent')) {
store.set('userAgent', [
{ name: 'Electron', url: '' },
{ name: 'Holla', url: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) AppleWebKit/537.36 (KHTML, like Gecko/20100101) Firefox/92.0 Chrome/87.0.4280.141 Safari/537.36' },
//{ name: 'Holla', url: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) AppleWebKit/537.36 KHTML, like Gecko/20100101 Firefox/92.0 Safari/537.36' },
{ name: 'Firefox', url: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' },
{ name: 'Opera', url: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/78.0.4093.184' },
{ name: 'Chorme', url: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36' }
]);
}

if (!store.get('settings.sidebar')) {
store.set('settings.sidebar', [
{ name: 'Facebook Messenger', url: 'https://www.messenger.com', status: true, widht: 600 },
{ name: 'WhatsApp', url: 'https://web.whatsapp.com', status: true, widht: 660  },
{ name: 'Telegram', url: 'https://web.telegram.org/k/', status: true, widht: 450  },
{ name: 'Discord', url: 'https://discord.com/app', status: true, widht: 1024  },
{ name: 'Vk', url: 'https://m.vk.com', status: true, widht: 550  },
{ name: 'Instagram', url: 'https://www.instagram.com', status: true, widht: 550  },
{ name: 'Twitter', url: 'https://twitter.com', status: true, widht: 550  },
{ name: 'Facebook', url: 'https://www.facebook.com', status: true, widht: 550  },
{ name: 'Twitch', url: 'https://www.twitch.tv', status: true, widht: 590  },
{ name: 'Youtube', url: 'https://www.youtube.com', status: true, widht: 550  },
{ name: 'Netflix', url: 'https://www.netflix.com', status: true, widht: 550  },
{ name: 'spector' },
{ name: 'YouTube Music', url: 'https://music.youtube.com', status: true, widht: 500  },
{ name: 'Apple Music', url: 'https://music.apple.com/tr/browse', status: true, widht: 500  },
{ name: 'Deezer', url: 'https://www.deezer.com/login', status: true, widht: 500  },
{ name: 'Google Translate', url: 'https://translate.google.com/', status: true, widht: 500  }
]);
}

if (!store.get('settings.leftbarmenuCacheStarter')) {
store.set('settings.leftbarmenu', true);
store.set('settings.leftbarmenuCacheStarter', true);
}

store.set('settings.leftbarmenuSize', 40);

store.set('vpn-proxy-opend', false);
let mainWindow;
let mainloaders;

process.noDeprecation = true;

app.setAppUserModelId("Holla Browser");

//Google Ayarları
// Google Settings -> https://console.cloud.google.com/
process.env.GOOGLE_API_KEY = 'AIzaSyBArCL81W8enc16MMuYy4Sj-xfZFNKyYSo';
process.env.GOOGLE_DEFAULT_CLIENT_ID = '590185167148-f09884kcvf5p736tcv9ahjtepttbttk6.apps.googleusercontent.com'
process.env.GOOGLE_DEFAULT_CLIENT_SECRET = 'MuenKtdB49ve9GKnEea8hpbA'
/*
//Flash Sistemi Kullanımdan Kaldırıldı
//Flash System Deprecated -> https://www.blog.google/products/chrome/saying-goodbye-flash-chrome/

//Bu kitaplığı kendiniz manuel olarak ekleyebilirsiniz

//You can manually add this library yourself
app.commandLine.appendSwitch('ppapi-flash-path', os.homedir()+'/AppData/Local/holla/PepperFlash/29.0.0.171/pepflashplayer.dll');
// Specify flash version, for example, v32.0.0.453
app.commandLine.appendSwitch('ppapi-flash-version', '29.0.0.171');

// You have to pass the directory that contains widevine library here, it is
// * `libwidevinecdm.dylib` on macOS,
// * `widevinecdm.dll` on Windows.
app.commandLine.appendSwitch('widevine-cdm-path', os.homedir()+'/AppData/Local/holla/WidevineCdm/_platform_specific/win_x64/widevinecdm.dll');
// The version of plugin can be got from `chrome://components` page in Chrome.
app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2209.0');
*/

app.disableHardwareAcceleration();


//Yeni Pencere Aç - Open New Window 
ipcMain.on('newWindowsOpens', () => {
var executablePath = process.execPath;
var parameters = ["--newtab"];
var spawn = require('child_process').spawn;
var child = spawn(executablePath,parameters, {'detached':true});
});

//Yeni Gizli Pencere Aç - Open Incognito New Window 
ipcMain.on('newIncognitoWindowsOpens', () => {
var executablePath = process.execPath;
var parameters = ["--incognitotab"];
var spawn = require('child_process').spawn;
var child = spawn(executablePath,parameters, {'detached':true});
});


async function createWindow() { 
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
process.env['ELECTRON_ENABLE_LOGGING'] = true;

//var parameters_newtab = app.commandLine.getSwitchValue("newtab");
//var parameters_incognitotab = app.commandLine.getSwitchValue("incognitotab");

var bgcolors;
if(process.argv[1] == '--incognitotab'){
bgcolors = '#202124';
} else{ bgcolors = '#FFFFFF'; }

mainWindow = new BrowserWindow({
title: 'DBS',
frame: false,
minWidth: 500,
minHeight: 450,
backgroundColor: bgcolors,
show: false,
webPreferences: {
nodeIntegration: true,
contextIsolation: false ,
enableRemoteModule: true,
backgroundThrottling: false,
nativeWindowOpen: false,
nodeIntegrationInSubFrames: false
},
width: 1280,
height: 720,
icon: join(__dirname, '/images/Icon-256x256.png'),
transparent: false
});

if (isDevMode) {
mainWindow.openDevTools({ mode: 'detach' });
}

mainWindow.loadURL(format({
pathname: join(__dirname, 'browser.html'),
protocol: 'file:',
slashes: true
}));

/* test
mainWindow.loadURL('https://www.google.com.tr/drive/about.html');
mainWindow.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) AppleWebKit/537.36 (KHTML, like Gecko/20100101) Firefox/92.0 Chrome/87.0.4280.141 Safari/537.36"); 
*/

//mainWindow.maximize();
mainWindow.webContents.on('crashed', async (e) => console.log('crashed', e));

/*Pencere kapatıldığında yayınlanır.
//Emitted when the window is closed.*/
mainWindow.on('closed', async () => {
store.delete('--incognitotab'); 
store.set('vpn-proxy-opend', false);
mainWindow = null; 
});

mainWindow.webContents.on('new-window', function(e, url) {
e.preventDefault();
});

if(process.argv[1] == '--newtab'){
/*console.log(parameters_newtab);*/
}

if(process.argv[1] == '--incognitotab'){
app.commandLine.appendSwitch('incognito');
store.set('--incognitotab', '--incognitotab');
}

mainWindow.webContents.on('did-finish-load', function () {
if(process.argv[1] == '--incognitotab'){
mainWindow.webContents.send('--incognitotab');
}
createUpdater();
});

/*loader başlat*/
createWindowLoaders();
}

async function createWindowLoaders() {
mainloaders = new BrowserWindow({
title: 'dbs Başla',
frame: false,
resizable: false,
skipTaskbar: true,
minWidth: 600,
minHeight: 400,
backgroundColor: '#fff',
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true,
},
width: 600,
height: 400,
icon: join(__dirname, '/images/Icon-256x256.png'),
transparent: false
});

mainloaders.loadURL(format({
pathname: join(__dirname, '/static/pages/basla.html'),
protocol: 'file:',
slashes: true
}));


mainloaders.webContents.on('did-finish-load', ()=> {
mainWindow.webContents.on('did-finish-load', ()=> {
mainloaders.hide();
mainWindow.show();
mainWindow.maximize();
mainWindow.focus();
setTimeout(() => {
mainWindow.focus();
}, 250);
if(!store.get('closedWelcomes')){setTimeout(()=>{ createWindowHosgeldin(); }, 1200);}
mainloaders = null;
});
});

}

async function createWindowHosgeldin() {
mainHosgeldin = new BrowserWindow({
title: 'dbs Hoş Geldin',
frame: false,
resizable: false,
skipTaskbar: true,
minWidth: 660,
minHeight: 464,
backgroundColor: '#a764ed',
parent: mainWindow,
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true,
},
width: 600,
height: 400,
icon: join(__dirname, '/images/Icon-256x256.png'),
transparent: false
});

mainHosgeldin.on('blur', () => {
if(mainHosgeldin) mainHosgeldin.close();
mainHosgeldin = null;
mainWindow.focus();
store.set('closedWelcomes', true);
});

mainHosgeldin.on('close', () => {
mainHosgeldin = null;
mainWindow.focus();
store.set('closedWelcomes', true);
});

mainHosgeldin.loadURL(format({
pathname: join(__dirname, '/static/pages/hosgeldin.html'),
protocol: 'file:',
slashes: true
}));


ipcMain.on('closedWelcomes', () => {
store.set('closedWelcomes', true);
if(mainHosgeldin) mainHosgeldin.close(); mainHosgeldin = null;
});
}

async function createUpdater() {
const { autoUpdater } = require("electron-updater");

//Bir güncelleme bulunduğunda otomatik olarak indirilip indirilemeyeceği.
//Whether an update can be downloaded automatically when it is found.
autoUpdater.autoDownload = false;
//İndirilen bir güncellemenin uygulamadan çıkıldığında otomatik olarak yüklenip yüklenmeyeceği ( quitAndInstalldaha önce çağrılmadıysa).
//Whether a downloaded update will be installed automatically upon exiting the application (if quitAndInstall was not called before).
autoUpdater.autoInstallOnAppQuit = false;
//Otomatik alpha beta testleri al indir özelliği
//Get automatic alpha beta tests download feature
autoUpdater.allowPrerelease = false;

mainWindow.once('ready-to-show', () => {
//Sunucuya güncelleme olup olmadığını sorar. Bildirim göndermez
//It asks the server if there is an update. Does not send notification
autoUpdater.checkForUpdates();
//Sunucuya bir güncelleme olup olmadığını sorar, indirme ve güncelleme varsa masaüstü bildirir.
//It asks the server if an update is available, and the desktop reports if there is a download or update.
//autoUpdater.checkForUpdatesAndNotify();
});

//Güncellemeleri kontrol etmek
//Checking for updates
autoUpdater.on("checking-for-update", () => {
//Güncellemeler Kontrol Ediliyor !! Komutlar Buraya
//Checking for Updates !! Commands Here
});

//Güncelleme yok
//No updates available
autoUpdater.on("update-not-available", info => {
//Yeni Güncelleme Bulunamadı !! Komutlar Buraya
//No New Update Found !! Commands Here
});

//Yeni güncelleme mevcut
//New Update Available
autoUpdater.on("update-available", info => {
if(info){ store.set('stroe_au_releaseInfo', info); }
mainWindow.webContents.send('update_available'); 
});

//Durum Raporunu İndir
//Download Status Report
autoUpdater.on("download-progress", progressObj => {
//Yeni Güncelleme Şu anda indiriliyor !!
//New Update is currently downloading !!
});

//İndirme Tamamlandı Mesajı
//Download Completion Message
autoUpdater.on("update-downloaded", info => {
//Artık yeni bir sürüm mevcut. Yeni sürüm indirildi.
//A new version is now available. I downloaded a new version.
store.set('stroe_au_app_download', false);
store.set('stroe_update_downloaded', true);
});

//İndirilmiş Olan Güncellemeyi Yüklemesini Başlat
//Start the Downloaded Update Installation
ipcMain.on('au_app_install_reset', () => {
store.delete('stroe_au_releaseInfo');
store.delete('stroe_au_app_download');
store.delete('stroe_update_downloaded');
setTimeout(function(){ autoUpdater.quitAndInstall(); }, 250);
});

//Güncellemeyi İndirmeye Başlat
//Start Downloading Update
ipcMain.on('au_app_download', () => {
store.set('stroe_au_app_download', true);
autoUpdater.downloadUpdate();
});
}


app.on('login', (event, webContents, request, authInfo, callback) => {
event.preventDefault();
//if(authInfo.isProxy) { callback('username', 'password'); }
})

//Tüm pencereler kapatıldığında çıkın.
//Quit when all windows are closed.
app.on('window-all-closed', async () => {
// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
if (process.platform !== 'darwin') {
if (mainWindow) {
mainWindow.webContents.closeDevTools();
}
app.quit();
}
store.delete('--incognitotab');
store.set('vpn-proxy-opend', false);
});

//Uygulama Hatası, Kilitlendi
//Application Error, Crashed
app.on('renderer-process-crashed', async () => {
console.log('rp-crashed');
});

app.on('activate', async () => {
// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
if (mainWindow === null) createWindow();
});

app.commandLine.appendSwitch('no-verify-widevine-cdm');
//app.commandLine.appendSwitch('widevine-base-dir');

// Demonstrating with constant, but this should be set dynamically
let isOffline = false;

// Demonstrating with the user data directory, which is the default
let widevineDir = app.getPath('userData');

app.on('ready', () => {
// Demonstrating with default session, but a custom session object can be used
app.verifyWidevineCdm({
session: session.defaultSession,
disableUpdate: isOffline,
baseDir: widevineDir
});

// Do other early initialization...
//Otomatik Dil Ayarlar // Auto Lang Select
if (!store.get('settings.langs')) {
store.set('settings.langs', app.getLocale());
}
store.set('tabslengthOnlys', 0);
store.set('loadEnableAdBlockings', false);
store.set('setDowloandLoads', false);
if(!store.get('appGetPath')){ store.set('appGetPath', app.getPath('downloads')); }
//app.on('login');

});

app.on('widevine-ready', () => {
// Open media browser window, etc... 
setTimeout(() => {
if(!mainWindow) {createWindow();} 
}, 500);
});
