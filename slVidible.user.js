// ==UserScript==
// @name			slVidible
// @namespace		seanloos.com
// @icon			http://seanloos.com/icons/sean.png
// @include			http://www.vidble.com/album/*
// @include			https://www.vidble.com/album/*
// @include			http://vidble.com/album/*
// @include			https://vidble.com/album/*
// @version			2017.01.01
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