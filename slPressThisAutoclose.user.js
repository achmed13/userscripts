// ==UserScript==
// @name			slPressThisAutoclose
// @version			2017.01.01
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icons/sean.png
// @description
// @include			http://seanloos.com/blog/wp-admin/press-this.php?action=post
// @include			http://seanloos.com/blog/archives/*
// @run-at			document-start
// ==/UserScript==

if(window.history.length==2){
	console.log('close');
	window.close();
}

if(document.getElementById('message').innerHTML.match(/window\.close/i)){
	window.close();
}
