// ==UserScript==
// @name			slVidible
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icon.png
// @version			2018.08.16
// @include			http://www.vidble.com/album/*
// @include			https://www.vidble.com/album/*
// @include			http://vidble.com/album/*
// @include			https://vidble.com/album/*
// @grant			none
// ==/UserScript==

var imgs = document.querySelectorAll('a[name^="pic"]');
var i = -1;
var len = imgs.length;

// --------------------------------------
// Keyboard Listener
// --------------------------------------
	document.addEventListener('keydown',function(e){
		// check to see if we are in a text box
		if (e.altKey || e.ctrlKey || e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA' || e.target.contentEditable==true || e.target.parentNode.contentEditable==true || e.target.parentNode.contentEditable=='true' || e.target.contentEditable=='true'){
			return;
		}

		var key = String.fromCharCode(e.keyCode);

		if(key == 'F'){
			if(i<len){
				i++;
				imgs[i].scrollIntoView();
				window.scrollBy(0,-60);
				e.preventDefault();
			}
			return;
		}

		if(key == 'R'){
			if(i>0){
				i--;
				imgs[i].scrollIntoView();
				e.preventDefault();
			}
			return;
		}

	},false);