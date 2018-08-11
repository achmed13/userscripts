// ==UserScript==
// @name			slImgurVerticalAlbum
// @version			2018.02.06.1511
// @namespace		seanloos.com
// @icon			http://seanloos.com/icon.png
// @homepageURL		http://seanloos.com/gm/
// @author			Sean Loos
// @description
// @include			http://imgur.com/a/*
// @include			https://imgur.com/a/*
// @run-at			document-idle
// ==/UserScript==


var url = document.location.href;
goEmbed();

// window.onLoad=setTimeout(init,1000);
init();

function goEmbed() {
	if (url.match(/spldone|grid/)){
		return false;
	}
	url = url.replace(/(\/layout.*)/,'');
	url = url.replace(/(\/embed)/,'');
	url = url.replace(/(\?.*)/,'');
	url = url.replace(/(#.*)/,'');
	//url = url + '/layout/horizontal#0';
	//url = url + '/embed';
	url = url + '?grid';
	document.location.replace(url);
	return true;
}

function init(){

	document.addEventListener('keydown', onKeyDown, false);
	var imgs = document.querySelectorAll('.post-grid-images span.post-grid-image');
	// console.log(imgs);
	if(!imgs){
		setTimeout(init,500);
		return;
	}
	if(!url.match(/spldone/)){
		var i = 0;
		var ic = document.createElement('div');
		ic.style.height = '100%';
		ic.style.width = '100%';
		ic.style.position = 'absolute';
		ic.style.top = 0;
		ic.style.left = 0;
		ic.style.zIndex = 999;
		ic.style.margin = '0 auto';
		ic.style.backgroundColor = '#000000';
		var txt = document.createElement('div');
		var img = document.createElement('img');
		img.style.maxHeight = (window.innerHeight-50) + 'px';
		img.style.margin = '0 auto';
		img.style.display = 'block';
		var pct = document.createElement('div');
		pct.innerHTML = '&nbsp;';
		pct.style.height = '25px';
		updatePct();
		txt.style.fontSize='16px';
		txt.style.marginTop='-25px';
		txt.style.padding='5px';
		txt.style.textAlign = 'center';
		txt.innerHTML = (i+1)+' of '+imgs.length;
		var mov = document.createElement('video');
		mov.style.maxHeight = (window.innerHeight-50) + 'px';
		mov.style.margin = '0 auto';
		mov.style.display = 'block';
		mov.autoplay = true;
		mov.loop = true;
		ic.appendChild(pct);
		ic.appendChild(txt);
		ic.appendChild(img);
		ic.appendChild(mov);
		document.body.appendChild(ic);
		go('');
	}

	function onKeyDown(e) {
		if(e.altKey || /INPUT|SELECT|TEXTAREA|CANVAS/i.test(e.target.tagName)) return;
		var ctrl = e.ctrlKey, key = e.keyCode, shift = e.shiftKey;
		var space = key == 32, home = key == 35, end = key == 36;
		var k = String.fromCharCode(e.keyCode);

		if(k=='F'){
			e.preventDefault();
			go('n');
		} else if(k=='R') {
			e.preventDefault();
			go('p');
			// } else if(k=='G') {
			// e.preventDefault();
			// document.body.appendChild(ic);
		} else if(k=='A') {
			e.preventDefault();
			document.location.href = document.location.href.replace('?grid','?spldone');
		}

	}

	function go(where){
		if(where=='n'){
			if(i<imgs.length){
				i++;
			}
		} else if(i>0){
			i--;
		}
		txt.innerHTML = (i+1)+' of '+imgs.length;
		updatePct();
		mov.src = '';

		var item = imgs[i];
		console.log(item);
		if(item){img.src = item.attributes['data-href'].value;}
		if(i == imgs.length){
			img.src = '';
		} else if(img.src.match(/\.mp4/)){
			mov.src = img.src;
			img.src = '';

		} else {
			// console.log(imgs[i].attributes['data-href'].value);
			img.src = img.src.replace(/(.*)(\..*)/,'$1h$2');
			// console.log(img.src);
		}
	}

	function updatePct(){
		pct.style.width = ((i+1)/imgs.length)*100+'%';
		if(i+1>=imgs.length){
			pct.style.backgroundColor='#990000';
			ic.style.backgroundColor = '#330000';
		} else {
			pct.style.backgroundColor='#006600';
			ic.style.backgroundColor = '#000000';
		}
	}


}