// ==UserScript==
// @name			slBlogHotkeys
// @icon			http://seanloos.com/icon.png
// @version			2017.01.01
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @description
// @include			http://*seanloos.com/blog/*
// ==/UserScript==

var n;
var p;
try {
	n=document.getElementById('SPLNext').firstChild.nextSibling;
	p=document.getElementById('SPLPrev').firstChild.nextSibling;
} catch(e) {

}

if(p != null && n==null && window.history.length==2){
	window.close();
}

(function(){

	var onKeyDown = function(event) {
		if (p==null){
			if(event.altKey && String.fromCharCode(event.keyCode) == 'I') {
				event.preventDefault();
				insertVideo();
			}
			if(event.altKey && String.fromCharCode(event.keyCode) == 'S') {
				event.preventDefault();
				publish();
			}
		} else {
			if (event.target.tagName=='INPUT' || event.target.tagName=='TEXTAREA'){
				return;
			}
			if(String.fromCharCode(event.keyCode) == 'F') {
				event.preventDefault();
				n.click();
			}
			if(String.fromCharCode(event.keyCode) == 'R') {
				event.preventDefault();
				console.dir(p);
				p.click();
			}
		}
	};
	document.addEventListener('keydown', onKeyDown, false);
})();

function insertVideo(){
	document.querySelector('a.select.button').click();
	publish();
}

function publish(){
	document.querySelector('.publish-button').click();
}
