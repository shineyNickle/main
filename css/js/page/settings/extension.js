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
let listIdName = document.getElementById('list');



/* Eklentileri Bul Ve Aktif Et */
var uzantilarKlasor = dirname.replaceAll('js', '') + 'static/extensions/';


/* Eklentileri Döndür */
const getLangPacs = sendSync('store', 'get', 'exiPackeLoadData').map(e => e);
Object.values(getLangPacs).forEach((file, i) => {  
var json = JSON.parse(fs.readFileSync(uzantilarKlasor+'/'+file+'/manifest.json').toString());

var itemEl = document.createElement('div');
itemEl.title = json.name;
itemEl.id = json.name;
itemEl.className = "col-md-4";
itemEl.innerHTML = `
<div class="card">
<div class="card-block" style="text-align: center;margin: 0 auto;">
<div class="card-images"> <img src="${ json.iconsbase64 }"> </div>
<h4 class="card-title">${ json.name }</h4>
<h6 class="card-subtitle text-muted">${ json.version }</h6>
<p class="card-text p-y-1">${ json.description }</p>
<div class="sc-ur64yn gINTBr"  style="display: flex;">
<div style="display: flex; width: 83%;">
<a href="${ json.homepage_url }" target="_blank" class="card-link">${ i18n.__('Uzantı web sitesi aç') }</a>
</div>
<div style="display: flex; width: 18%;" id="${ json.idkey }">
<input id="dowloadnAltPencereAlt" type="checkbox" class="switch item-control">
</div>
</div>
</div>
</div>
`.trim();
listIdName.appendChild(itemEl);

loadSettings();
bindControls(document.getElementsByClassName('item-control'));

});


/* Kayıtlı Tüm Eklentileri Çek Aktif Pasif */
async function loadSettings () {
let saved = sendSync('store', 'get', 'extensions');
for (let [key, val] of Object.entries(saved)) {
let element = document.getElementById(key);
if(!element) continue;
let control = element.lastElementChild;

if(control.tagName == 'SELECT') {control.value = val;}
if(control.tagName == 'INPUT') { control.checked = val; }

}
}

/* Eklenti Ayarları Değiştir Kaydet İşlemleri Canlandırma */
async function bindControls (controls) {
for (let control of controls) {
let key = control.parentElement.id;
if(control.tagName == 'SELECT') {
control.addEventListener('change', () => send('store', 'set', 'extensions.'+key, control.value));
}	else {    
control.addEventListener('click', () => send('store', 'set', 'extensions.'+key, control.checked));
}
}
}


/* Başka Url Git */
async function openLoadURL (urls) { window.location.href = urls; }

let leftMenuAffters = document.getElementById('eklentiler');
if(leftMenuAffters){ leftMenuAffters.classList.add('bEUiyY'); }