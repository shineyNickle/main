// PACKAGE LOADING

const Store = require('electron-store'); // Used for readable/writable storage
const { v1 } = require('uuid'); // Used to generate random IDs for each history item
const base64KeysTo = require('./base64.min.js');

// ENCRYPTION

// const keytar = require('keytar');
// var pass = v1();
// keytar.getPassword('holla', 'encryptionKey').then(r => {
//   console.log(r, pass);
//   if(!r) keytar.setPassword('holla', 'encryptionKey', pass);
//   else pass = r;
// });

// STORAGE FILE INIT

// Initialize the ElectronStore objects:
const history = new Store({ name: 'history' });
const bookmarks = new Store({ name: 'bookmarks' });
const downloads = new Store({ name: 'downloads' });
const saveInfoXcont = new Store({ name: 'saveInfoXcont' });
const tabsPins = new Store({ name: 'tabsPins' });
const sideBarLeft = new Store({ name: 'sideBarLeft' });
const bird = new Store({ name: 'bird' });

// Create history.json and bookmarks.json:
history.set('app', 'holla');
bookmarks.set('app', 'holla');
downloads.set('app', 'holla');
saveInfoXcont.set('app', 'holla');
tabsPins.set('app', 'holla');
sideBarLeft.set('app', 'holla');
bird.set('app', 'holla');

history.delete('app');
bookmarks.delete('app');
downloads.delete('app');
saveInfoXcont.delete('app');
tabsPins.delete('app');
sideBarLeft.delete('app');
bird.delete('app');

// Globalize history for debugging:
window.hist = history;

// FUNCTIONS

// Manage bird:
exports.getbird = async () => bird.get(); // Returns all contents of history.json
exports.gettbirdNo = () => bird.get(); 
exports.gettbirdNoId = (id) => bird.get(id); 

exports.removebird = async (id) => bird.delete(id);

exports.clearbird = async () => bird.clear();

exports.logbird = async function (roomid, roomname, roomavatar, roompassword, roomcreateusername, type) {
let id = roomid;
let item = { "roomid": roomid, "roomname": roomname, "roomavatar": roomavatar, "roompassword": roompassword, "roomcreateusername": roomcreateusername, "type": type, "time": + new Date() };
return bird.set(id, item);
}

exports.isgetbird = async function (id) {
try {
let savebgvfds = bird.get(id); 
var exists = false; 
if(savebgvfds.roomid == id){exists = id;}
return exists;
} catch (error) {
return false;
}
}


// Manage tabsPins:
exports.gettabsPins = async () => tabsPins.get(); // Returns all contents of history.json
exports.gettabsPinsNo = () => tabsPins.get(); 

exports.removetabsPins = async (id) => tabsPins.delete(id);

exports.cleartabsPins = async () => tabsPins.clear();

exports.logtabsPins = async function (site,id) {
let ids = base64KeysTo.encode(site);
//let id = v1();
let item = { "id": id, "idBase64": ids, "url": site, "time": + new Date() };
return tabsPins.set(id, item);
}

exports.isgettabsPins = async function (id) {
try {
//let idscx = base64KeysTo.encode(site);
//let idscx = id;
let savebgvfds = tabsPins.get(id); 
var exists = false;
if(savebgvfds.id == id){exists = id;}
return exists;
} catch (error) {
return false;
}
}





// Manage saveInfoXcont:
exports.getSaveInfoXcont = async () => saveInfoXcont.get(); // Returns all contents of history.json

exports.removeSaveInfoXcontItem = async (id) => saveInfoXcont.delete(id);

exports.clearSaveInfoXcont = async () => saveInfoXcont.clear();

exports.logSaveInfoXcont = async function (site, title, pass, loginurl) {
let id = base64KeysTo.encode(site+title+pass);
let item = { "id": id, "idBase64": id, "url": site, "title": title, "pass": pass, "loginurl": loginurl, "time": + new Date() };
return saveInfoXcont.set(id, item);
}

exports.isgetSaveInfoXconted = async function (site, title, pass) {
try {
let idscx = base64KeysTo.encode(site+title+pass);
let savebgvfds = saveInfoXcont.get(idscx); 
var exists = false;
if(savebgvfds.url == site && savebgvfds.title == title && savebgvfds.pass == pass){exists = idscx;}
return exists;
} catch (error) {
return false;
}
}



// Manage history:
exports.getHistory = async () => history.get(); // Returns all contents of history.json

exports.removeHistoryItem = async (id) => history.delete(id);

exports.clearHistory = async () => history.clear();

exports.logHistory = async function (site, title) {
let id = v1(); let idBase64 = base64KeysTo.encode(site);
let item = { "id": id, "idBase64": idBase64, "url": site, "title": title, "time": + new Date() };
return history.set(id, item);
}

// Manage bookmarks:
exports.getBookmarks = async () => bookmarks.get(); // Returns all contents of bookmarks.json

exports.removeBookmark = async id => bookmarks.delete(id);

exports.clearBookmark = async () => bookmarks.clear();

exports.addBookmark = async function (site, title) {
let idBase64 = v1();
let id = base64KeysTo.encode(site);
let item = { "id": id, "idBase64": idBase64, "url": site, "title": title, "time": + new Date() };
return bookmarks.set(id, item);
}

exports.isBookmarked = async function (url) {
try {
let id = base64KeysTo.encode(url);
let bookmarks2 = bookmarks.get(id);
var exists = false;
if(bookmarks2.url == url){ exists = id;}
return exists;
} catch (error) {
return false;
}
}

exports.renameBookmark = async function (id, name) {
let bookmark = history.get(id);
bookmark.title = name;
history.set(id, bookmark);
}

// Manage downloads:
exports.getDownloads = async () => downloads.get(); // Returns all contents of downloads.json

exports.removeDownloads = async id => downloads.delete(id);

exports.clearDownloads = async () => downloads.clear();

exports.addDownloads = async function (id, Filename, Address, url, getTotalBytes, getMimeType, status) {
let idBase64 = base64KeysTo.encode(Filename);
let item = { "id": id, "idBase64": idBase64, "url": Address, "urlreal": url, "title": Filename, "getTotalBytes": getTotalBytes, "getMimeType": getMimeType, "status": status, "time": + new Date() };
return downloads.set(id, item);
}

exports.SavePathDownloads = async function (id, name) {
let bookmark = downloads.get(id);
bookmark.url = name;
downloads.set(id, bookmark);
}

exports.StatusDownloads = async function (id, name) {
let bookmark = downloads.get(id);
bookmark.status = name;
downloads.set(id, bookmark);
}