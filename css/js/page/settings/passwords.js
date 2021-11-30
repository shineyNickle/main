/* Tema Çek Yükle */
function xloadThemes(){
const theme = sendSync('getTheme');
if(theme){ themeObj = theme.toLowerCase(); }/*
if (document.querySelector('head link[href*="assets://themes"]')) document.querySelector('head link[href*="assets://themes"]').remove();
document.head.innerHTML += '<link rel="stylesheet" href="assets://themes/'+themeObj+'.css">';*/
}
xloadThemes();
/* Tema Çek Yükle Son */

let theme = sendSync('getTheme');
let history = sendSync('getSaveInfoXcont');
let listIdName = document.getElementById('list');
let historyIds = Object.keys(history);


/* Geçmiş Listesini Filtrele Tarihlere Göre Süz */
function range(selectedRange) {
const current = new Date();
const day = current.getDate();
const month = current.getMonth();
const year = current.getFullYear();

let minDate = '';
let maxDate = '';

switch (selectedRange) {
case 'today': {
minDate = new Date(year, month, day, 0, 0, 0, 0);
maxDate = new Date(year, month, day, 23, 59, 59, 999);
break;
}
case 'yesterday': {
minDate = new Date(year, month, day - 1, 0, 0, 0, 0);
maxDate = new Date(year, month, day - 1, 23, 59, 59, 999);
break;
}
case 'last-week': {
let currentDay = current.getDay() - 1;
if (currentDay === -1) currentDay = 6;
minDate = new Date(year, month, day - currentDay - 7, 0, 0, 0, 0);
maxDate = new Date(year, month, day - currentDay - 1, 0, 0, 0, 0);
break;
}
case 'last-month': {
minDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
maxDate = new Date(year, month, 0, 0, 0, 0, 0);
break;
}
case 'older': {
let currentDay = current.getDay() - 1;
if (currentDay === -1) currentDay = 6;
minDate = new Date(0);
maxDate = new Date(year, month, day - currentDay - 7, 0, 0, 0, 0);
break;
}
}

return (
selectedRange !== 'all' && {
min: minDate.getTime(),
max: maxDate.getTime(),
}
);
}

/* Verileri Daha Fazla Yükle Fonksiyonu */
/* Varsayılan uzunluk Ayarla */
this.itemsLoaded = getDefaultLoaded();

/* Ekran Boyutu Değişirse Boyutları Yeniden Hesaplatır*/
window.addEventListener('resize', () => {
const loaded = getDefaultLoaded();
if (loaded > this.itemsLoaded) {
this.itemsLoaded = loaded;
}
});

/* Varsayılan uzunluk Ayarla - Funksiyonu */
function getDefaultLoaded() {
return (Math.floor(window.innerHeight / 48));
}

/* Kaydırmada Daha Fazla Yeni Verileri Yükle */
function scrollLoadDatas() {
var elementDiv = document.getElementById('newHistoryPagesID');

const scrollPos = elementDiv.scrollTop;
const scrollMax = elementDiv.scrollHeight - elementDiv.clientHeight - 256;

if (scrollPos >= scrollMax) {
this.itemsLoaded += getDefaultLoaded();

if(this.cacheSerachKeys){
AramaFunc(this.typeIsTime,this.cacheSerachKeys);
} else { ProssCoun2(this.typeIsTime,''); }

}
}

/* Ölçü Sıfırla */
function resetLoadedItems() {
this.itemsLoaded = getDefaultLoaded();
document.getElementById('newHistoryPagesID').scrollTop = 0;
}


/* Geçmiş Verileri İşle Tarihlere Ayır Ve Bir Araya Topla Filtre vb tüm ayarları burada */
function sections(typeIsTime,rsearch){
let history = sendSync('getSaveInfoXcont');
	
/* Geçmiş Getir Döngüye Sok Ve Veri Formatına Çevir */
let itemCaches = [];
Object.values(history).forEach((historyItem, i) => {
itemCaches.push(historyItem);
});
this.items = itemCaches;
/* Geçmiş Getir Döngüye Sok Ve Veri Formatına Çevir Son */

let list = [];
let section = [];
let loaded = 0;

for (let i = this.items.length - 1; i >= 0; i--) {
   // console.log(loaded);  console.log(this.itemsLoaded);
if (loaded > this.itemsLoaded) break;

const item = this.items[i];
const date = new Date(item.time);

if (
rsearch !== '' &&
!item.title.toLowerCase().includes(rsearch) &&
!item.url.includes(rsearch)
) {
continue;
}


if (range(typeIsTime)) {
if (date.getTime() >= range(typeIsTime).max) continue;
if (date.getTime() <= range(typeIsTime).min) break;
}

if (compareDates(section && section.date, date)) {
section.items.push(item);
} else {
section = {
label: getSectionLabel(date),
items: [item],
date,
};
list.push(section);
}

loaded++;
}

return list;
}

/* Arama Yap */
function AramaFunc(typeIsTime,rsearch){
this.cacheSerachKeys = rsearch;
ProssCoun2(this.typeIsTime,rsearch);
this.itemsLoaded = getDefaultLoaded();
}

/* Ana İşlem Olup Biten Herşeyi İşle */
function ProssCoun2(typeIsTime,rsearch){
this.typeIsTime = typeIsTime;

/* Menu Tıklama After Değiştir */
let solMenuClickAfter = document.getElementById('solmenus');
solMenuClickAfter.addEventListener('click', async e => {
   
var docBtunDivvs = document.getElementById(e.target.id);
var xSbSorg = false;
if(docBtunDivvs){
var xSbSorg = docBtunDivvs.classList.item('nbuttonload');
}

if(xSbSorg){
e.stopPropagation(); 
if(solMenuClickAfter.getElementsByClassName('bEUiyY')[0]) {
solMenuClickAfter.getElementsByClassName('bEUiyY')[0].classList.remove('bEUiyY');
}
document.getElementById(e.target.id).classList.add('bEUiyY');
}
});

/* Tüm İçeriği Temizle */
listIdName.innerHTML = '';

/* İşlenen Veriler Al */
var realHistoryData =  sections(typeIsTime,rsearch.toLowerCase().toLowerCase());


/* Geçmiş Boş Temizse Ekrana Yazdır */
if(realHistoryData.length == 0){
document.getElementById('nothing-here').style.display = 'block';
} else {
document.getElementById('nothing-here').style.display = 'none'; 
}

/* İşlenen Veri Artık Ekrana Yazdır */
Object.values(realHistoryData).forEach((realHistoryDataITEM, i) => {      

/* Tarih Oluştur Yazdır */
var itemEl = document.createElement('div');
itemEl.title = realHistoryDataITEM.label;
itemEl.id = realHistoryDataITEM.date;
itemEl.className = "sc-goxci2 hjjcXz";
itemEl.innerHTML = `
<div class="sc-zwakic kdfNg">${ realHistoryDataITEM.label }</div>
<div id="${realHistoryDataITEM.date}"></div>
`.trim();
listIdName.appendChild(itemEl);

/* Ana Geçmiş Verileri Yazdır */
let anaIcerikData = document.getElementById(realHistoryDataITEM.date);

Object.values(realHistoryDataITEM.items).forEach((rCitems, i) => {  
var itemElTwos = document.createElement('div');
itemElTwos.title = rCitems.url;
itemElTwos.id = rCitems.id;
itemElTwos.className = "newItemHistorys";

var icons = `https://www.google.com/s2/favicons?sz=64&domain_url=${rCitems.url}`;
var urlbasesxx = new URL(rCitems.loginurl);
var urlbases =rCitems.url;

itemElTwos.innerHTML = `
<div class="sc-1bmyqzo heDebU">
<div class="sc-h5xgu3 fSEvpp" style="background-image: url(${icons}); opacity: 1; filter: none;"></div>

<div class="sc-15gsxa4 NuyOs">
<a onclick="openLoadURLEx('${rCitems.loginurl}')" class="sc-1ik6ujx hpSWQf">${ rCitems.url }</a>
</div>

<div class="sc-15gsxa4 NuyOs"><input disabled style="border: none;background: transparent;" type="text" value="${rCitems.title}"></div>
<div class="sc-15gsxa4 NuyOs"><input disabled style="border: none;background: transparent;" type="password" value="${rCitems.pass}"></div>

<div style="display:none" class="sc-1uh5z3d kYVdAJ"> 
<a href="${urlbasesxx.origin}/.well-known/change-password">nono</a>
</div>

<div class="sc-1uh5z3d kYVdAJ"> ${timestampDate(rCitems.time)}</div>
<div id="oDelete" class="sc-m21a46 cBxkta"></div>
</div>
`.trim();
anaIcerikData.appendChild(itemElTwos);

/**/
let itemV2 = anaIcerikData.lastElementChild;

itemV2.addEventListener('click', async e => {
e.stopPropagation();
if(e.target.id == 'oDelete') {
itemV2.remove();
send('removeSaveInfoXcontItem', rCitems.id);
} else {

if(document.getElementsByClassName('selected')[0]) {
document.getElementsByClassName('selected')[0].classList.remove('selected');
}
itemV2.classList.add('selected'); 

}
});
/**/

});

});
}

ProssCoun2('all','');

/* Bu Fonksiyon Tarihe Göre Ayrım Yapıp Teke İndir, Veri eklemede aynı gündeki verileri bir bölümün içine yazar. */
function compareDates(first,second){
return (
first != null &&
second != null &&
first.getFullYear() === second.getFullYear() &&
first.getMonth() === second.getMonth() &&
first.getDate() === second.getDate()
);
}

/* Ayların Listesi Çevir */
function monthsList(mounth){
let FatRows = '';
if(mounth == '1'){ FatRows = i18n.__('Ocak'); }
if(mounth == '2'){ FatRows = i18n.__('Şubat'); }
if(mounth == '3'){ FatRows = i18n.__('Mart'); }
if(mounth == '4'){ FatRows = i18n.__('Nisan'); }
if(mounth == '5'){ FatRows = i18n.__('Mayıs'); }
if(mounth == '6'){ FatRows = i18n.__('Haziran'); }
if(mounth == '7'){ FatRows = i18n.__('Temmuz'); }
if(mounth == '8'){ FatRows = i18n.__('Ağustos'); }
if(mounth == '9'){ FatRows = i18n.__('Eylül'); }
if(mounth == '10'){ FatRows = i18n.__('Ekim'); }
if(mounth == '11'){ FatRows = i18n.__('Kasım'); }
if(mounth == '12'){ FatRows = i18n.__('Aralık'); }
return FatRows;
}

/* Günlerin Listesi Çevir */
function daysList(day){
let FastRows = '';
if(day == '1'){ FastRows = i18n.__('Pazar'); }
if(day == '2'){ FastRows = i18n.__('Pazartesi'); }
if(day == '3'){ FastRows = i18n.__('Salı'); }
if(day == '4'){ FastRows = i18n.__('Çarşamba'); }
if(day == '5'){ FastRows = i18n.__('Perşembe'); }
if(day == '6'){ FastRows = i18n.__('Cuma'); }
if(day == '7'){ FastRows = i18n.__('Cumartesi'); }
return FastRows;
}

/* Tarihi Saat Dakkika ya çevir */
function timestampDate(times){
let unix_timestamp = times / 1000;
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var date = new Date(unix_timestamp * 1000);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();
// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
var formattedTime = hours + ':' + minutes.substr(-2);
return formattedTime;
}

/* Label Tarihi Çevir Dil Ve 1,12 -> Pazartesi, Aralık*/
function getSectionLabel(date) {
let prefix = '';
const current = new Date();

if(
date.getFullYear() === current.getFullYear() &&
date.getMonth() === current.getMonth()
) {
if (current.getDate() === date.getDate()) {
prefix = i18n.__('Bugün')+' - ';
} else if (current.getDate() - 1 === date.getDate()) {
prefix = i18n.__('Dün')+' - ';
}
}

return `${prefix}${daysList(date.getDay())}, ${
monthsList(date.getMonth())
} ${date.getDate()}, ${date.getFullYear()}`;
};

/* Sayfa içinde başka bir yere tıklanırsa seçili iptal et */
document.body.addEventListener('click', async e => {
if(document.getElementsByClassName('selected')[0]) {
document.getElementsByClassName('selected')[0].classList.remove('selected');
}
});


/* Tüm Geçmişi Temizle */
document.getElementById('clear').addEventListener('click', async e => {
var result = confirm(i18n.__('Tarama verilerinin hepsi silinsinmi ?'));
if(result) {
send('clearSaveInfoXcont'); listIdName.innerHTML = '';
document.getElementById('nothing-here').style.display = 'block';
}
else {
}
});

/* Başka Url Git */
async function openLoadURL (urls) { window.location.href = urls; }

async function openLoadURLEx (urls) {
sendSync('openPageNews', urls);
}

let leftMenuAffters = document.getElementById('ayarlar');
if(leftMenuAffters){ leftMenuAffters.classList.add('bEUiyY'); }