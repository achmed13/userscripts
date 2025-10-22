// ==UserScript==
// @name			slYoutubeRemoveRedirect
// @version			2017.01.01
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			https://seanloos.com/icons/sean.png
// @description
// @match			*://*.youtube.com/redirect?*
// @run-at			document-end
// ==/UserScript==

document.location.href = decodeURIComponent(document.location.href.match(/(redirect\?q=)(.*?)&session_token/i)[2]);