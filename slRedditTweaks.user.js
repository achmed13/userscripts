// ==UserScript==
// @name			slRedditTweaks
// @version			2018.09.12.1655
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icon.png
// @include			https://*reddit.com/*
// @include			http://*reddit.com/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant			GM_addStyle
// @grant			GM_openInTab
// @grant			GM_log
// @run-at			document-idle
// ==/UserScript==

var start = new Date().getTime();
var url;
var toolbar;
var orig;
//comment highlighting
var ChangeFontSize=true;
var thresholds={
	.5:'#ffc',
	.80:'#ff7',
	.9:'#cfc',
	.95:'#7f7'
};
var fontFactor=1;
if (!goToURL()){
	show_images();
	sizeThings();
	highlightComments();
	authorColor();
}

document.addEventListener('keydown',function(e){
	// check to see if we are in a text box
	if (e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA'){
		return;
	}
	var key = String.fromCharCode(e.keyCode);
	if(key == 'V'){
		e.preventDefault();
		url = imgurAlbum(url);
		document.location.href = url;
		return;
	}
	if(key == 'A'){
		e.preventDefault();
		document.location.href = document.querySelector('p.tagline a.author').href + '/submitted';
		return;
	}
	if(key == 'G'){
		e.preventDefault();
		openGWLinks();
		return;
	}
	if(key == 'I'){
		e.preventDefault();
		bigImages();
		return;
	}
},false);

//-----functions-------
function goToURL(){
	//try {
	var link = document.querySelector('p.title a');
	//GM_log(link);
	var linkParent = link.parentNode.innerHTML;
	url = link.href;
	toolbar = new RegExp(/this.href=\'(.*?)\'/i).test(linkParent) ? linkParent.match(/this.href=\'(.*?)\'/i)[1] : link.href;
	var page = document.querySelector('span.pagename');
	var domain = document.querySelector('span.domain');
	var go = (history.length>1 || page.innerHTML.match(new RegExp(document.location.href,'i')) || domain.innerHTML.match(/(self\.|v\.redd\.it)/)) ? false : true;
	var vid = false;
	if (vid){
		var v = document.createElement('span');
		v.innerHTML='[VIDEO]';
		v.style.backgroundColor='#ff0';
		v.style.color='#000';
		link.parentNode.appendChild(v);
		link.style.backgroundColor='#ff0';
	}
	if(go && !vid){
		url = imgurAlbum(url);
		setTimeout(function(u){location.href=u},1000,url);
		return true;
	}
	return false;
	//} catch(e) {
	//	GM_log(e.message + ' (' + e.fileName.replace(/.*\/(.*)/g,'$1') + ':' + e.lineNumber + ')');
	//}
}

function imgurAlbum(url) {
	if (/imgur\.com\/a\//.test(url)){
		if (/embed/.test(url)){
			return;
		}
		url = url.replace(/(\/layout.*)/,'');
		url = url.replace(/(\?.*)/,'');
		url = url.replace(/(#.*)/,'');
	}
	return url;
}


var lastGW = 0;
function openGWLinks(){
	var gwl = document.querySelectorAll('li.first a.comments');
	//gwl = document.querySelectorAll('p.title a.title');
	if (lastGW >= gwl.length){
		//alert('Nothing new');
		document.location.href = document.evaluate("//a[contains(string(),'next')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
		return;
	}
	for (var i=lastGW; i<gwl.length; i++){
		if (gwl[i].parentNode.parentNode.parentNode.parentNode.style.display!='none'){
			GM_openInTab(gwl[i].href,false);
			lastGW = i+1;
			if (i>0 && i%5==0){
				i = 100;
			}
			//GM_openInTab(gwl[i].href);
		}
	}
}

function authorColor(){
	var author = document.querySelector('p.tagline a.author').innerHTML;
	var comments = document.querySelectorAll('a.author');
	for (var i=0; i<comments.length; i++) {
		try{
			if (comments[i].innerHTML == author) {
				comments[i].style.backgroundColor = '#aaf';
				comments[i].style.fontSize = '12px';
				comments[i].style.padding = '3px';
			}
		} catch(e) {
		}
	}
}

function show_images(){
	var links = document.querySelectorAll('a');
	for (var i=0; i<links.length; i++) {
		try{
			var a = links[i];
			if (a.href.match(/img|\.jpe?g|\.png|\.gif|gfycat/gi)) {
				var img;
				var href = a.href.match(/\.jpe?g|\.png|\.gif/gi) ? a.href : a.href + '.jpg';
				img = '<img class="splRedditImg" src="'+href+'" />';
				if (!a.href.match(/jpg|gif|png/) && a.href.match(/gfycat/)) {
					img = a.href.match(/.*gfycat\.com\/([^\/"]+)/)[1];
					// img = "<iframe src='https://gfycat.com/ifr/"+img+"' frameborder='0' scrolling='no' width='100%' height='100%' allowfullscreen></iframe>";
					href = "https://thumbs.gfycat.com/"+img+"-poster.jpg";
											img = '<img class="splRedditImg splGfycat" src="'+href+'" />';
				}
				if (!href.match(/reddit|imgur.com\/tools/gi)){
					if(href.match(/imgur\.com\/a\//gi)){
						img = '<div class="splAlbum">ALBUM</div>';
					}
					a.innerHTML = '<div><a class="bigimagediv" href="' + a.href + '">' + a.innerHTML + '<br/>' + img + '</a></div>';
				}
			}
		} catch(e) {
		}
	}
}

function sizeThings(){
	if (!document.location.href.match(/comments/gi)){
// 		$(".thing:has(.splRedditImg)").addClass( "splThing" );
		$(".thing").addClass( "splThing" );
	}
}

function highlightComments(){
	if (!document.location.href.match(/comments/gi)){
		return;
	}
	var arRecs=new Array();
	$(".entry .score").each(function(){
		var recs=$(this).text().split(' ')[0];
		arRecs.push(parseInt(recs));
	});
	arRecs.sort(function (a, b) {return a - b;});
	$(".entry .score").each(function(){
		var recs=$(this).text().split(' ')[0];
		var numrecs=parseInt(recs);
		var newbgcolor='';
		var newfontsize=12;
		for(var t in thresholds){
			if(numrecs>=arRecs[Math.floor(arRecs.length*t)]){
				newbgcolor=thresholds[t];
				newfontsize+=fontFactor;
			}else{
				break;
			}
		}
		if(newbgcolor!=''){
			$(this).parents("div.entry").css({backgroundColor: newbgcolor, '-moz-border-radius':'7px', 'webkit-border-radius':'7px', 'padding':'2px 2px 2px 6px','border': 'solid black 1px'});
			$(this).parents("div.entry").find(".md").css({fontSize: newfontsize});
			$(this).parents('.tagline').css({fontSize: newfontsize,color:'black'});
			$(this).css({fontSize: newfontsize,color:'black'});
		}
	});
}
