// ==UserScript==
// @name			slPortableFreeware
// @version			2018.08.16
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icon.png
// @include			http://www.portablefreeware.com/*
// ==/UserScript==
document.body.innerHTML = document.body.innerHTML.replace(/target=._blank./gi,'');

function website(){
	var links = document.getElementsByTagName('a');
	for(var i=0;i<links.length;i++){
		if(/^website$/i.test(links[i].innerHTML)){
			document.location.href = links[i].href;
		}
	}
}

function download(){
	var links = document.getElementsByTagName('a');
	for(var i=0;i<links.length;i++){
		if(/^download.*/i.test(links[i].innerHTML)){
			document.location.href = links[i].href;
		}
		if(/^64\-bit$/i.test(links[i].innerHTML)){
			var url = links[i].href;
			var to = window.setTimeout(function(){document.location.href = url;},1000);
		}
	}
}

document.addEventListener('keydown',function(e){
	// check to see if we are in a text box
	if (e.altKey || e.ctrlKey || e.shiftKey || e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA'){
		return;
	}
	var key = String.fromCharCode(e.keyCode);
	if(key == 'W'){
		e.preventDefault();
		website();
		return;
	}
	if(key == 'D'){
		e.preventDefault();
		download();
		return;
	}
},false);

