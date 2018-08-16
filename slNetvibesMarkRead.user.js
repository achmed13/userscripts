// ==UserScript==
// @name			slNetvibesMarkRead
// @version			2018.08.12.1315
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icons/sean.png
// @description
// @include			*.netvibes.com/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require			https://gist.githubusercontent.com/kepkin/ff99090c410ab1b5c8fa/raw/a1e229b38cb6eb169556ae9b5e751e5c81d59929/waitForKeyElements.js
// @run-at			document-end
// @grant			none
// ==/UserScript==


function fixAmp(){
	var titles = document.querySelectorAll('#column01 .rssreader-container .item-title');
	for(var t of titles){
		t.innerHTML = t.innerHTML.replace(/&amp;/gi,'&');
	}
}

waitForKeyElements('#column01 .rssreader-container .item-title',fixAmp);

// --------------------------------------
// Keyboard Listener
// --------------------------------------
	document.addEventListener('keyup',function(e){
		// check to see if we are in a text box
		if (e.shiftKey || e.ctrlKey || e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA'){
			return;
		}
		var key = String.fromCharCode(e.keyCode);

		// Mark All
		if(key == 'A' && e.altKey){
			e.preventDefault();
			markAll();
			return;
		}

		// Reload
		if(key == 'R' && !e.altKey){
			e.preventDefault();
			doReload();
			return;
		}
	},false);

function markAll(){
	var r = document.querySelector('span.counter:not([style*="display"])');
	fireClick(r);
}

function doReload(){
	document.querySelector('span[title*="Edit"]').click();
	document.querySelector('li[data-name*="options/refresh"]').click();
	fixAmp();
}

function fireClick(elem){
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
	elem.dispatchEvent(evt);
}

//setTimeout(function(){document.location.reload();},600000);