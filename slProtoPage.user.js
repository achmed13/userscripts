// ==UserScript==
// @name		slProtoPage
// @version		2024.3.20-1302
// @description		
// @namespace		seanloos.com
// @homepageURL		https://seanloos.com/userscripts/
// @downloadURL		https://seanloos.com/userscripts/slProtoPage.user.js
// @updateURL		https://seanloos.com/userscripts/slProtoPage.user.js
// @author		Sean Loos
// @icon		https://seanloos.com/icon.png
// @match		https://www.protopage.com/loossean*
// @grant		none
// ==/UserScript==

(function() {
    'use strict';

document.addEventListener('keydown', function (e) {
	if(e.key == 'a' && e.altKey){
		document.querySelectorAll('.scheme-header-text').forEach( d => {
			if(d.textContent.match(/Mark all/)){
				d.click();
			}
		});
	}
});

})();