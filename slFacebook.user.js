// ==UserScript==
// @name			slFacebook
// @version			2018.08.11.1736
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icon.png
// @description   
// @include			https://www.facebook.com/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @noframes
// @grant			GM_addStyle
// ==/UserScript==


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

		// Load More
		if(key == 'S' && e.altKey){
			e.preventDefault();
			loadMore();
			return;
		}

		// // Ignore Suggestion
		// if(key == 'X' && e.altKey){
			// e.preventDefault();
			// ignore();
			// return;
		// }
	},false);

function markAll(){
	var r = document.querySelector('input[value="Mark All Read"]');
	r.click();
}

function loadMore(){
	var ll = document.getElementById('stream_pagelet').querySelectorAll('a');
	for(var i=ll.length-1;i>=0;i--){
		if(ll[i].innerHTML.match(/More Stories/)){
			ll[i].click();
			i = -1;
		}
	}
   var n = document.querySelector('.sfx_info.sfx-pager');
   if(n != null){
      simulateClick(n);
   }
}

function ignore(){
	var x = document.querySelectorAll('.ego_unit_container	.egoProfileTemplate .ego_x.uiCloseButton.uiCloseButtonSmall');
	var l = (x.length > 6) ? 6 : x.length;
	if (x.length < 1) {
		x = document.querySelectorAll('#pagelet_browse_all_suggestions div:not([class*="hidden_elem"])>a[title="Remove"]');
		l = (x.length/3 > 10) ? x.length/3 : x.length;
	}
	var i = 0;
	(function loop(){
		if (i>=l){
			return;
		}
		setTimeout(function(){
			x[i].click();
			i++;
			loop();
	  }, 300);
	})();
}

function simulateClick(anode) {
   var event = document.createEvent('MouseEvents');
   event.initEvent( 'click', true, true );
   anode.dispatchEvent(event);
}
