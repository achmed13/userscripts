// ==UserScript==
// @name			slNirsoftLinks
// @namespace		seanloos.com
// @version			2017.01.01
// @icon			http://seanloos.com/icons/sean.png
// @homepageURL		http://seanloos.com/gm/
// @author			Sean Loos
// @description		Move NirSoft download links to the top of the page
// @include			http://www.nirsoft.net/*
// ==/UserScript==

var links = document.querySelectorAll('.downloadline');
var ele = document.createElement('div');
ele.style.textAlign = 'center';
for(var i=0;i<links.length;i++){
	ele.appendChild(links[i]);
	ele.appendChild(document.createElement('p'));
}
document.body.insertBefore(ele,document.body.firstChild);