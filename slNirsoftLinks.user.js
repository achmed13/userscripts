// ==UserScript==
// @name			slNirsoftLinks
// @namespace		seanloos.com
// @version			2023.11.1-1525
// @icon			https://seanloos.com/icons/sean.png
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @description		Move NirSoft download links to the top of the page
// @match			*://*.nirsoft.net/*
// ==/UserScript==

var links = document.querySelectorAll('.downloadline');
var ele = document.createElement('div');
ele.style.textAlign = 'center';
for(var i=0;i<links.length;i++){
	ele.appendChild(links[i]);
	ele.appendChild(document.createElement('p'));
}
document.body.insertBefore(ele,document.body.firstChild);