var leftMenu = document.getElementById('left-menu');
if(leftMenu){
leftMenu.innerHTML = `
<div class="sc-f9ba9e bNoKEx">

<div id="ayarlar" title="Ayarlar" class="sc-1klqouq bECQfp i18n" onclick="openLoadURLMenu('holla://ayarlar')">
<div class="sc-lt5gah heosCI" style="background-image: url(assets://images/settings/settings.svg);"></div>
Ayarlar
</div>

<div id="gecmis" title="Geçmiş" class="sc-1klqouq bECQfp i18n" onclick="openLoadURLMenu('holla://gecmis')">
<div class="sc-lt5gah heosCI" style="background-image: url(assets://images/settings/history.svg);"></div>
Geçmiş
</div>

<div id="kaydedilenler" title="Kaydedilenler" class="sc-1klqouq bECQfp i18n" onclick="openLoadURLMenu('holla://yer-imleri')">
<div class="sc-lt5gah heosCI" style="background-image: url(assets://images/settings/bookmark.svg);"></div>
Kaydedilenler
</div>

<div id="indirilenler" title="İndirilenler" class="sc-1klqouq bECQfp i18n" onclick="openLoadURLMenu('holla://indirilenler')">
<div class="sc-lt5gah heosCI" style="background-image: url(assets://images/settings/download.svg);"></div>
İndirilenler
</div>

<div id="eklentiler" title="Eklentiler" class="sc-1klqouq bECQfp i18n" onclick="openLoadURLMenu('holla://uzantilar')">
<div class="sc-lt5gah heosCI" style="background-image: url(assets://images/settings/extension.svg);"></div>
Eklentiler
</div>

</div>
`;
}


/* Başka Url Git */
async function openLoadURLMenu (urls) { window.location.href = urls; }

function openLoadURLMenuX(url){
alert(`Bu bölüm yapım aşamasında. 
Yeni güncelleme ile en kısa sürede aktif olacaktır.
`);
}