// ==UserScript==
// @name			slPortableFreeware
// @namespace		seanloos.com
// @version			2017.01.01
// @icon			http://seanloos.com/icons/sean.png
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

