// ==UserScript==
// @name			slYoutubeRemoveRedirect
// @version			2017.01.01
// @namespace		seanloos.com
// @homepageURL		http://seanloos.com/gm/
// @author			Sean Loos
// @icon			http://seanloos.com/icons/sean.png
// @description
// @include			*.youtube.com/redirect?*
// @run-at			document-end
// ==/UserScript==

document.location.href = decodeURIComponent(document.location.href.match(/(redirect\?q=)(.*?)&session_token/i)[2]);