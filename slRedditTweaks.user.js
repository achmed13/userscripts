// ==UserScript==
// @name			slRedditTweaks
// @version			2023.11.1-1353
// @namespace		seanloos.com
// @description
// @homepageURL		https://seanloos.com/userscripts/
// @downloadURL		https://seanloos.com/userscripts/slRedditTweaks.user.js
// @updateURL     	https://seanloos.com/userscripts/slRedditTweaks.user.js
// @author			Sean Loos
// @icon			https://seanloos.com/icon.png
// @match			*://*.reddit.com/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant			GM_addStyle
// @grant			GM_openInTab
// @grant			GM_log
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

init();

function init(){
	console.log('init');
	var rc = true;
	// rc = goToURL();
	if (!rc){
		authorColor();
		highlightComments();
		show_images();
		sizeThings();
	}
}

document.addEventListener('keydown',function(e){
	// check to see if we are in a text box
	if (e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA'){
		return;
	}
	var key = String.fromCharCode(e.keyCode);
	if(key == 'F'){
		e.preventDefault();
		document.location.href = document.evaluate("//a[contains(string(),'next')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
		return;
	}
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
},false);

//-----functions-------
function goToURL(){
	// try {
	var link = document.querySelector('p.title a');
	// var linkParent = link.parentNode.innerHTML;
	url = link.href;
	GM_log(url);
	// toolbar = new RegExp(/this.href=\'(.*?)\'/i).test(linkParent) ? linkParent.match(/this.href=\'(.*?)\'/i)[1] : link.href;
	var page = document.querySelector('span.pagename');
	var domain = document.querySelector('span.domain');
	// var go = (history.length > 1 || page.innerHTML.match(new RegExp(document.location.href,'i')) || document.location.href.match(/submitted/) || domain.innerHTML.match(/(self\.|v\.redd\.it)/)) ? false : true;
	var go = (history.length > 2 || page.innerHTML.match(new RegExp(document.location.href,'i')) || document.location.href.match(/submitted/) || domain.innerHTML.match(/(self\.|v\.redd\.it)/)) ? false : true;
		console.log('go',go);
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
		// url = imgurAlbum(url);
		setTimeout(function(u){location.href=u},1000,url);
		return true;
	}
	return false;
	// } catch(e) {
		// console.log(e);
	// }
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
var openurls=[];
function openGWLinks(){
	// var gwl = document.querySelectorAll('li.first a.comments');
	var gwl = document.querySelectorAll('p.title a.title');
	// if (lastGW >= gwl.length){
	// 	//alert('Nothing new');
	// 	document.location.href = document.evaluate("//a[contains(string(),'next')]",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	// 	return;
	// }
	for (var i=lastGW; i<gwl.length; i++){
		if (gwl[i].parentNode.parentNode.parentNode.parentNode.style.display!='none'){
			openurls.push(gwl[i].href);
			// GM_openInTab(gwl[i].href,false);
			// lastGW = i+1;
			// if (i>0 && i%5==0){
			// 	i = 100;
			// }
			//GM_openInTab(gwl[i].href);
		}
	}
		// console.log( 'urls',openurls );
		openurls = uniq(openurls);
		// console.log( 'urls',openurls );
		openurls.forEach(url=>{
			// console.log(url);
			GM_openInTab(url,false);
		});
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
	var links = document.querySelectorAll('a.thumbnail');
	links.forEach(a=>{
	// for (var i=0; i<links.length; i++) {
		try{
			// var a = links[i];
			if (a.href.match(/\.jpe?g|\.png|\.gif[^v]|gfycat/gi)) {
				var img;
				var href = a.href.match(/\.jpe?g|\.png|\.gif/gi) ? a.href : a.href + '.jpg';
				img = '<img class="splRedditImg" src="'+href+'" />';

				// if(href.match(/\.gifv/gi)){
				// 	href = href.replace(/.*imgur\.com\/(.*)\.gifv/gi,'\\\\imgur.com\\$1');
				// 	img = '<blockquote class="imgur-embed-pub" lang="en" data-id="2dIKVeY" data-context="false" ><a href="'+href+'">Mind if I do a little dance for you? :)</a></blockquote>';
				// 	console.log(img);
				// 	a.href = href;
				// }

				if (!href.match(/reddit|imgur.com\/tools/gi)){
					a.innerHTML = img;
				}
			}
		} catch(e) {
			console.log(e);
		}
	}
	);
	// var script = document.createElement('script');
	// script.src = "//s.imgur.com/min/embed.js"
	// script.async = true;
	// (document.body || document.head || document.documentElement).appendChild(script);
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

function uniq( a ) {
	var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];
	// console.table(a);
	return a.filter( function ( item ) {
		var type = typeof item;
		// console.table(item);
		if ( type in prims ){
			return prims[ type ].hasOwnProperty( item ) ? false : ( prims[ type ][ item ] = true );
		}
		else{
			return objs.indexOf( item ) >= 0 ? false : objs.push( item );
		}
	} );
}