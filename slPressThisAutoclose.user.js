// ==UserScript==
// @name			slPressThisAutoclose
// @version			2024.12.2-1309
// @namespace		seanloos.com
// @homepageURL		https://seanloos.com/userscripts/
// @author			Sean Loos
// @icon			https://seanloos.com/icons/sean.png
// @description
// @include			https://achmed13.com/wp-admin/press-this.php?action=post
// @include			https://achmed13.com/archives/*
// @run-at			document-start
// ==/UserScript==

if(window.history.length==2){
	console.log('close');
	window.close();
}

if(document.getElementById('message').innerHTML.match(/window\.close/i)){
	window.close();
}
