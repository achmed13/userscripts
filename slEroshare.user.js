// ==UserScript==
// @name			slEroshare
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icon.png
// @include			https://eroshare.com/*
// @version			2017.01.01
// @grant			none
// ==/UserScript==

var imgs=document.querySelectorAll('img.album-image');
var i=0;
document.addEventListener('keydown', onKeyDown, false);
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
	}
}

function go(direction){
   if(direction=='n'){
      i++;
      if(i>=imgs.length){i=imgs.length-1;}
   } else {
      i--;
      if(i<0){i=0;}
   }
   imgs[i].scrollIntoView();
}