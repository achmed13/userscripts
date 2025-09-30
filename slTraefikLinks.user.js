// ==UserScript==
// @name          slTraefikLinks
// @version       2025.9.28-1210
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @updateURL     http://seanloos.com/userscripts/slTraefikLinks
// @author        Sean Loos
// @icon          http://seanloos.com/icon.png
// @match         http://localhost:8080/dashboard/
// @match         https://traefik.xps.seanloos.com/dashboard/
// @run-at		  document-idle
// @grant         none
// ==/UserScript==


/*
setTimeout(()=>{
	addLinks(document.getElementById('root'));
},1000);
*/

let observer = new MutationObserver(function (mutations) {
	mutations.forEach(function (e) {
		addLinks(e.target);
	});
});

observer.observe(document.getElementById('root'), {
	attributes: false,
	childList: true,
	characterData: false,
	subtree: true
});


function addLinks(target){
	target.querySelectorAll('a>span').forEach(s=>{
		if(s.innerHTML.match(/href/)){
			return;
		}
		s.innerHTML = s.innerHTML.replace(/(Host\(`(.*?)`\))/,'$1<br/><br/><a href="https://$2" target="_blank" style="color:white;font-size:1.2em;line-height:1.4em;text-decoration:none;padding:0 .4em;background-color:#333;border:.5px solid #999;border-radius:1em;">$2</a>');
	});
}