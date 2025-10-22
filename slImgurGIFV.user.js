// ==UserScript==
// @name          slImgurGIFV
// @version       2023.5.26-1252
// @description   redirect .gifv to .mp4
// @namespace     seanloos.com
// @homepageURL   https://seanloos.com/userscripts/
// @downloadURL   https://seanloos.com/userscripts/slImgurGIFV.user.js
// @updateURL     https://seanloos.com/userscripts/slImgurGIFV.user.js
// @author        Sean Loos
// @icon          https://seanloos.com/icon.png
// @icon          https://seanloos.com/icon.png
// @match         https://*.imgur.com/*.gifv
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

	let url = window.location.href;
	url = url.replace(/gifv$/i,'mp4');
	console.log( url );
	//window.location.href = url;
	window.history.pushState('','',url);
	window.history.go();
})();