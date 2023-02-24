// ==UserScript==
// @name			slWikipediaCopyCoordinates
// @version			2022.10.7-1258
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
	document.addEventListener('keydown',function(e){
		// check to see if we are in a text box
		if (e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA' || e.target.contentEditable == true){
			return;
		}
		var key = String.fromCharCode(e.keyCode);
		if(key == 'Z'){
			e.preventDefault();
			getInfo();
		}
	},false);

	function getInfo(){
		let link = document.location.href;
		let title = document.querySelector('.mw-page-title-main');
		let lat = document.querySelector('span.latitude');
		let lon = document.querySelector('span.longitude');
		let loc;
		let th = document.querySelectorAll('th');
		th.forEach((h)=>{
			if(h.innerText=='Location'){
				loc = h.nextElementSibling;
				return;
			}
		});
		let desc = (document.querySelector('table.infobox.vcard') && document.querySelector('table.infobox.vcard').nextElementSibling);
		let data = getTxt(title) + '\t' + link + '\t' + getTxt(lat) + '\t' + getTxt(lon) + '\t"' + getTxt(loc) + '"\t"' + getTxt(desc) + '"';
		GM_setClipboard(data);
		document.title = 'splWikiCopied';
		alert('Copied\n' + getTxt(title));
	}

	function getTxt(element){
		return (element && element.innerText) || '';
	}
})();
