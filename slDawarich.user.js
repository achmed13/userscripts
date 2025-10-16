// ==UserScript==
// @name          slDawarich
// @version       2025.10.16-1226
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @updateURL     http://seanloos.com/userscripts/slDawarich
// @author        Sean Loos
// @icon          http://seanloos.com/icon.png
// @match        https://dawarich.seanloos.com/map*
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

	document.addEventListener("keydown", function(event) {
		console.log("key",event.key);
		console.log("keyCode", event.keyCode); // Deprecated, use event.key or event.code
		console.log("code", event.code); // Modern approach
		if(event.key=="c"){
			document.getElementsByClassName('confirm-visit')[0].click();
			scrollTo(1);
		}
		if(event.key=="n"){
			scrollTo();
		}
	});

	function scrollTo(index=0){
		document.getElementsByClassName('confirm-visit')[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
})();