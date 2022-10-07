// ==UserScript==
// @name			slWikipediaCopyCoordinates
// @version			2022.10.7-1023
// @description
// @namespace		seanloos.com
// @homepageURL		https://seanloos.com/userscripts/
// @downloadURL		https://seanloos.com/userscripts/slWikipediaCopyCoordinates.user.js
// @updateURL		https://seanloos.com/userscripts/slWikipediaCopyCoordinates.user.js
// @author			Sean Loos
// @icon			https://seanloos.com/icon.png
// @match			https://en.wikipedia.org/wiki/*
// @grant         GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
	let lat = document.querySelector('span.latitude').innerText;
	let lon = document.querySelector('span.longitude').innerText;
	let th = document.querySelectorAll('th');
	let loc = '';
	th.forEach((h)=>{
		if(h.innerText=='Location'){
			loc = h.nextElementSibling.innerText;
			return;
		}
	});
//	let desc = document.querySelector('#mw-content-text > .mw-parser-output > p:nth-child(6)').innerText;
	let desc = document.querySelector('table.infobox.vcard').nextElementSibling.innerText;
	let data = lat + '\t' + lon + '\t' + loc + '\t' + desc;
	GM_setClipboard(data);
})();
