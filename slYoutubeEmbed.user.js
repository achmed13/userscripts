// ==UserScript==
// @name          slYoutubeEmbed
// @namespace     seanloos.com
// @homepageURL   https://seanloos.com/userscripts/
// @downloadURL     https://seanloos.com/userscripts/slYoutubeEmbed.user.js
// @updateURL     https://seanloos.com/userscripts/slYoutubeEmbed.user.js
// @author        Sean Loos
// @icon          https://seanloos.com/icon.png
// @version       2020-12-01
// @include       *
// @exclude       *.youtube.*/*
// @exclude       *.newsblur.*/*
// @exclude       *.inoreader.*/*
// @exclude       *.google.*/mail/*
// @exclude       http*://console.developers.google.com/*
// @exclude       *.facebook.com/*
// @exclude       *.reddit.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @run-at        document-end
// @grant         GM_openInTab 
// ==/UserScript==

//var gotoURL = '';
window.addEventListener ("load", init);
function init(){
	if (!document.body.innerHTML.match(/youtube(.*)\//i)){
		return;
	}
	var found = false;

	var vids = $('iframe, embed');

	vids.each(function(){
		try{
			var o = this;
			if (o.src.match(/youtube(.*)\/(embed|v)\//i))
			{
				var url = o.src.replace(/\/(embed|v)\//i,'/watch?v=');
				url = url.replace('-nocookie','');
				var d = getDiv(url);
				insertAfter(d,o);
				//gotoURL = gotoURL == '' ? url : gotoURL;
				//found = true;
			}
		} catch (err) {
			console.log(err.description);
		}
	});

	vids = $('object');
	vids.each(function(){
		try{
			var o = this;
			if (o.data.match(/youtube(.*)\/v\//i))
			{
				var url = o.data.replace(/\/v\//i,'/watch?v=');
				url = url.replace('-nocookie','');
				var d = getDiv(url);
				insertAfter(d,o);
				//gotoURL = gotoURL == '' ? url : gotoURL;
				//found = true;
			}
		} catch (err) {
			console.log(err.description);
		}
	});

	document.addEventListener('keydown',function(e){
		// check to see if we are in a text box
		if (e.altKey || e.ctrlKey || e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA' || e.target.contentEditable==true || e.target.parentNode.contentEditable==true || e.target.parentNode.contentEditable=='true' || e.target.contentEditable=='true'){
			return;
		}
		var key = String.fromCharCode(e.keyCode);
		if(key == 'Y'){
			e.preventDefault();
			openYouTube();
		}
	},false);
}

function openYouTube(){
	if(document.location.href.match('seanloos.com/blog')){
		//GM_openInTab(clean(document.getElementById('splYouTube').href),false);
		document.getElementById('splYouTube').click();
		
	}else{
		document.location.href = clean(document.getElementById('splYouTube').href);
	}
}

function getDiv(url){
	var d = document.createElement('div');
	d.style.margin=0;
	d.style.padding=0;
	d.innerHTML = '<a id="splYouTube" href="' + clean(url) + '" style="color:#fff;font-size:10px;font-weight:bold;padding:1px 3px;background-color:#c00;margin:0;">Watch on YouTube</a>';
	return d;
}

function clean(url){
	var m = url.match(/(.*?)(\?)([^\?]*)/); 
	return m[1] + m[2] + m[3];
}

function insertAfter(node, referenceNode) {
	referenceNode.style.border='2px solid #f00';
	referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
}

