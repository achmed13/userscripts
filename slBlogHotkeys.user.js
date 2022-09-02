// ==UserScript==
// @name			slBlogHotkeys
// @icon			http://seanloos.com/icon.png
// @version			2022.9.2-1411
// @description		Prev and Next hotkeys
// @namespace		seanloos.com
// @homepageURL		https://seanloos.com/userscripts/
// @downloadURL		https://seanloos.com/userscripts/slBlogHotkeys.user.js
// @updateURL		https://seanloos.com/userscripts/slBlogHotkeys.user.js
// @author			Sean Loos
// @match			http*://*seanloos.com/blog/*
// ==/UserScript==

var n;
var p;
try {
	//n = document.getElementById('SPLNext').firstChild.nextSibling;
	//p = document.getElementById('SPLPrev').firstChild.nextSibling;
	n = document.querySelector('a[rel=next]');
	p = document.querySelector('a[rel=prev]');
} catch (e) {}

if (p != null && n == null && window.history.length == 2) {
	window.close();
}

(function () {

	var onKeyDown = function (event) {
		if (p == null) {
			if (event.altKey && String.fromCharCode(event.keyCode) == 'I') {
				event.preventDefault();
				insertVideo();
			}
			if (event.altKey && String.fromCharCode(event.keyCode) == 'S') {
				event.preventDefault();
				publish();
			}
		} else {
			if (event.target.tagName == 'INPUT' || event.target.tagName == 'TEXTAREA') {
				return;
			}
			if (String.fromCharCode(event.keyCode) == 'F') {
				event.preventDefault();
				n.click();
			}
			if (String.fromCharCode(event.keyCode) == 'R') {
				event.preventDefault();
				console.dir(p);
				p.click();
			}
		}
	};
	document.addEventListener('keydown', onKeyDown, false);
})();

function insertVideo() {
	document.querySelector('a.select.button').click();
	publish();
}

function publish() {
	document.querySelector('.publish-button').click();
}
