// ==UserScript==
// @name          slCarsGame
// @version       2025.3.19-1539
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @updateURL     http://seanloos.com/userscripts/slCarsGame.user.js
// @author        Sean Loos
// @icon          http://seanloos.com/icon.png
// @match        https://rednuht.org/genetic_cars_2/
// @grant         none
// ==/UserScript==

document.addEventListener('keydown', function (e) {
	// check to see if we are in a text box
	if (e.ctrlKey || e.altKey || e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.contentEditable == true) {
		return;
	}
	var key = e.key;
	if (key == 'f') {
		document.getElementById('fast-forward').click();
	}
}, false);
