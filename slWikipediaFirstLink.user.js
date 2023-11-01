// ==UserScript==
// @name          slWikipediaFirstLink
// @version       2021.9.20-1659
// @namespace     seanloos.com
// @homepageURL   https://seanloos.com/userscripts/
// @updateURL     https://seanloos.com/userscripts/NAME
// @author        Sean Loos
// @icon          https://seanloos.com/icon.png
// @match         https://en.wikipedia.org/*
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

	let link = document.querySelector('#mw-content-text>.mw-parser-output>p>a,#mw-content-text>.mw-parser-output>b>a');
	if(link){
		link.style.backgroundColor = "#ff0";
		// link.click();
		document.addEventListener('keypress',(e)=>{
			console.log(e);
			if(e.key == 'g'){
				link.click();
			}
		});
	}
})();