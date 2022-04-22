// ==UserScript==
// @name          slImgurGIFV
// @version       2022.4.22-1110
// @description   redirect .gifv to regular page
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @downloadURL   http://seanloos.com/userscripts/slImgurGIFV.user.js
// @updateURL     http://seanloos.com/userscripts/slImgurGIFV.user.js
// @author        Sean Loos
// @icon          http://seanloos.com/icon.png
// @match         https://*.imgur.com/*.gifv
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

	let url = window.location.href;
	url = url.replace(/.gifv$/i,'');
	console.log( url );
	//window.location.href = url;
	window.history.pushState('','',url);
	window.history.go();
})();