// ==UserScript==
// @name          slDawarich
// @version       2026.1.20-1129
// @description	  Hotkeys for visits
// @namespace     seanloos.com
// @homepageURL   https://seanloos.com/userscripts/
// @updateURL     https://seanloos.com/userscripts/slDawarich.user.js
// @downloadURL   https://seanloos.com/userscripts/slDawarich.user.js
// @author        Sean Loos
// @icon          https://seanloos.com/icon.png
// @match         https://dawarich.seanloos.com/map*
// @match         https://dawarich.seanloos.com/visits*
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

	document.addEventListener("keydown", function(event) {
	/*
		console.log("key",event.key);
		console.log("keyCode", event.keyCode); // Deprecated, use event.key or event.code
		console.log("code", event.code); // Modern approach
	*/
		if(event.key=="c"){
			document.getElementsByClassName('btn-success')[0].click();
			// document.getElementsByClassName('confirm-visit')[0].click();
			// scrollTo(1);
		}
		if(event.key=="a"){
			confirmAll();
		}
		if(event.key=="d"){
			document.getElementsByClassName('btn-error')[0].click();
		}
		if(event.key=="n"){
			scrollTo();
		}
	});

	async function confirmAll(){
		for(let i = 9; i >=0; i--){
			document.body.style.cursor = 'wait';
			document.getElementsByClassName('btn-success')[i].click();
			await sleep(900);
			document.body.style.cursor = 'default';
		}
		document.body.style.cursor = 'default';
	}

	function scrollTo(index=0){
		document.getElementsByClassName('confirm-visit')[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	function sleep(ms) {
 		return new Promise(resolve => setTimeout(resolve, ms));
	}

})();