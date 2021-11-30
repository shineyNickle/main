//Dil Çeviri Yap
[].forEach.call(document.getElementsByClassName("i18n"),function(el){ 
if(el.placeholder){ el.placeholder = i18n.__(el.placeholder); }
if(el.title){ el.title = i18n.__(el.title); }
});

[].forEach.call(document.getElementsByTagName("i18n"),function(el){ 
var keyslo = el.innerHTML;
el.innerHTML = i18n.__(keyslo);
el.style.display = 'block';
});