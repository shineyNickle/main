const { desktopCapturer } = require('electron');
if(window.navigator.mediaDevices){
window.navigator.mediaDevices.getDisplayMedia = () => {
return new Promise(async (resolve, reject) => {
try {
const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });

const selectionElem = document.createElement('div');
selectionElem.classList = 'desktop-capturer-selection'
selectionElem.innerHTML = `
<style>
.desktop-capturer-selection {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100vh;
background: rgba(30,30,30,.75);
color: #fff;
z-index: 10000000;
display: flex;
align-items: center;
justify-content: center;
}
.desktop-capturer-selection__scroller {
width: 100%;
max-height: 100vh;
overflow-y: auto;
}
.desktop-capturer-selection__list {
max-width: calc(100% - 100px);
margin: 50px;
padding: 0;
display: flex;
flex-wrap: wrap;
list-style: none;
overflow: hidden;
justify-content: center;
}
.desktop-capturer-selection__item {
display: flex;
margin: 4px;
}
.desktop-capturer-selection__btn {
display: flex;
flex-direction: column;
align-items: stretch;
width: 145px;
margin: 0;
border: 0;
border-radius: 3px;
padding: 4px;
background: #ffffff;
text-align: left;
transition: background-color .15s, box-shadow .15s;
}
.desktop-capturer-selection__btn:hover,
.desktop-capturer-selection__btn:focus {
background: rgb(3 169 244 / 69%);
}
.desktop-capturer-selection__thumbnail {
width: 100%;
height: 81px;
object-fit: cover;
}
.desktop-capturer-selection__name {
margin: 6px 0 6px;
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
}
.closedxx {
position: fixed;
top: 22px;
z-index: 99999999;
right: 22px;
}

.closedxx .svg-icon {
width: 35px;
height: 35px;
}

.closedxx .svg-icon path,
.closedxx .svg-icon polygon,
.closedxx .svg-icon rect {
fill: white;
}

.closedxx .svg-icon circle {
stroke: white;
stroke-width: 1;
}
</style>
<div id="closedxx" class="closedxx">
<svg class="svg-icon" viewBox="0 0 20 20">
<path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
</svg>
</div>
<div class="desktop-capturer-selection__scroller">
<ul class="desktop-capturer-selection__list">
${sources.map(({id, name, thumbnail, display_id, appIcon}) => `
<li class="desktop-capturer-selection__item">
<button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
<img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
<span class="desktop-capturer-selection__name">${name}</span>
</button>
</li>
`).join('')}
</ul>
</div>
`
document.body.appendChild(selectionElem);

document.querySelectorAll('.desktop-capturer-selection__btn')
.forEach(button => {
button.addEventListener('click', async () => {
try {
const id = button.getAttribute('data-id');
const source = sources.find(source => source.id === id);
if(!source) {
throw new Error(`Source with id ${id} does not exist`);
}

const stream = await window.navigator.mediaDevices.getUserMedia({
audio: false,
video: {
mandatory: {
chromeMediaSource: 'desktop',
chromeMediaSourceId: source.id
}
}
})
resolve(stream);

selectionElem.remove();
} catch (err) {
console.error('Error selecting desktop capture source:', err);
reject(err);
}
})
})


var closedxx = document.getElementById('closedxx');
closedxx.addEventListener('click', async () => {
selectionElem.remove()
});

} catch (err) {
console.error('Error displaying desktop capture sources:', err)
reject(err);
}
});

}
}