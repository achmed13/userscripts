// ==UserScript==
// @name			slRedditTweaks
// @icon			http://seanloos.com/icons/sean.png
// @namespace		seanloos.com
// @version			2018.08.11
// @description		Highlights comments for reddit stories based on comment points, loads images in comments, highlights author posts, go straight to URL
// @include			https://*reddit.com/*
// @include			http://*reddit.com/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant			GM_addStyle
// @grant			GM_openInTab
// @grant			GM_log
// @run-at			document-end
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
	//removeMale();
	show_images();
	// if (document.location.href.match(/gonewild|bdsmgw|bondage|girls|collegegirls|collegesluts|corsets|womenin|nsfwoutfits/gi)){
		// GM_log('images');
		// orig = document.body.innerHTML;
		// bigImages();
	// } else {
	// }
		highlightComments();
		authorColor();
	// fixLinks();
	// var heavy=document.querySelector('img');
	// if(heavy.src.match(/heavy\-load\.png/)){
		// document.addEventListener('click',function(e){
			// document.location.reload();
		// });
	// }
}

document.addEventListener('keydown',function(e){
	// check to see if we are in a text box
	if (e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA'){
		return;
	}
	var key = String.fromCharCode(e.keyCode);
	// if(key == 'E'){
		// e.preventDefault();
		// showComments();
		// return;
	// }
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
	// if(key == 'C'){
		// e.preventDefault();
		// document.location.href = toolbar;
		// return;
	// }
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
	// if(key == 'O'){
		// e.preventDefault();
		// document.body.innerHTML = orig;
		// highlightComments();
		// authorColor();
		// return;
	// }
	// if(key == 'N'){
		// e.preventDefault();
		// document.location.href = document.querySelector('.nextprev').lastChild.href;
		// return;
	// }
},false);
//GM_log(Math.round((new Date().getTime()-start)*1000)/1000 + 'ms');

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
			setTimeout(function(u){location.href=u},400,url);
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
		//url = url.replace(/(\/embed)/,'');
		url = url.replace(/(\?.*)/,'');
		url = url.replace(/(#.*)/,'');
		//url = url + '/layout/horizontal#0';
		//url = url + '?grid';
	}
	return url;
}

// function showComments(){
	// var collapsed = document.querySelectorAll('div.collapsed');
	// for (var i=0; i<collapsed.length; i++){
		// collapsed[i].style.display='none';
	// }
	// var noncollapsed = document.querySelectorAll('div.noncollapsed');
	// for (var i=0; i<noncollapsed.length; i++){
		// noncollapsed[i].style.display='block';
		// noncollapsed[i].parentNode.nextSibling.style.display = 'block';
	// }
	// var midcol = document.querySelectorAll('div.midcol');
	// for (var i=0; i<midcol.length; i++){
		// midcol[i].style.display='block';
	// }
// }

// function fixLinks(){
	// try{
		// //set the target for links in the comments
		// var commentLinks = document.querySelectorAll('div.usertext-body a');
		// for (var i=0; i<commentLinks.length; i++) {
			// var l = commentLinks[i];
			// //if (!l.innerHTML.match(/report|^\s*$/i)) {
			// if (!l.innerHTML.match(/report/i)) {
				// l.target='_blank';
			// }
		// }
		// //enlarge the link to the comments page
		// var commentLinks = document.querySelectorAll('li.first a.comments');
		// for (var i=0; i<commentLinks.length; i++) {
			// var l = commentLinks[i];
			// l.style.fontSize='18px';
		// }
	// } catch(e){
		// GM_log(e.message + ' (' + e.fileName.replace(/.*\/(.*)/g,'$1') + ':' + e.lineNumber + ')');
	// }
// }

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
		//if (gwl[i].parentNode.parentNode.parentNode.style.display!='none'){
			//var t = 500*(i+1);
			//setTimeout('window.open(\''+gwl[i].href+'\')',t);
			// var w = window.open(gwl[i].href);
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
	try{
		var author = document.querySelector('p.tagline a.author').innerHTML;
		var comments = document.querySelectorAll('a.author');
		for (var i=0; i<comments.length; i++) {
			if (comments[i].innerHTML == author) {
				comments[i].style.backgroundColor = '#aaf';
				comments[i].style.fontSize = '12px';
				comments[i].style.padding = '3px';
			}
		}
	} catch(e) {
		GM_log(e.message + ' (' + e.fileName.replace(/.*\/(.*)/g,'$1') + ':' + e.lineNumber + ')');
	}
}

function show_images(){
	var maxSize = 'max-width:' + window.innerWidth*.9 + 'px;max-height:' + window.innerHeight*.5 + 'px;'
	if (!document.location.href.match(/comments/gi)){
		maxSize = 'max-width:' + window.innerWidth*.7 + 'px;max-height:' + window.innerHeight*.3 + 'px;'
		//return;
	}
	try{
		var links = document.querySelectorAll('a');
		//GM_addStyle('.bigimagediv {border:1px solid #f00;float:left;overflow:hidden;text-align:center;} .imgclass{display:table-cell !important;'+maxSize+';}');
		GM_addStyle('.bigimagediv {border:1px solid #f00;overflow:hidden;text-align:center;} .imgclass{'+maxSize+';}');
		for (var i=0; i<links.length; i++) {
			var a = links[i];
			if (a.href.match(/img|\.jpe?g|\.png|\.gif/gi)) {
				var href = a.href.match(/\.jpe?g|\.png|\.gif/gi) ? a.href : a.href + '.jpg';
				if (!href.match(/reddit|imgur.com\/tools/gi)){
					var img = '<img class="imgclass imgheight" src="'+href+'" />';
					if(href.match(/imgur\.com\/a\//gi)){
						img = '<div style="height:30px;width:200px;background-color:#0c0;">ALBUM</div>';
					}
					a.innerHTML = '<div><a class="bigimagediv" href="' + a.href + '" style="font-size:18px;">' + a.innerHTML + '<br/>' + img + '</a></div>';
				}
			}
		}
	} catch(e) {
		GM_log(e.message + ' (' + e.fileName.replace(/.*\/(.*)/g,'$1') + ':' + e.lineNumber + ')');
	}
}

function bigImages(){
	var allimg = '';
	var irows = 1;
	var icount = 0;
	var icols = 5;
	if (!document.location.href.match(/comments/gi)){
		return;
	}
	try{
		allimg = '<div style="clear:both;border-bottom:5px solid #f00;font-size:22px !important;background-color:#ff9;overflow:hidden;padding-bottom:15px;">' + document.querySelector('p.title').innerHTML + '<a href="http://www.reddit.com/user/' + document.querySelector('p.tagline a.author').innerHTML + '/submitted" style="background-color:#afa;font-weight:bold;font-size:18px;">' + document.querySelector('p.tagline a.author').innerHTML + '</a></div>';
		var ls = document.querySelectorAll('div.usertext-body div.bigimagediv ');
		for (var l=0; l<ls.length; l++){
			if (ls[l].innerHTML.match(/<img/gi) && !ls[l].innerHTML.match('http://imgur.com/r/bondage') && !ls[l].innerHTML.match('http://imgur.com/removalrequest') && !ls[l].innerHTML.match('Imgmon')){
				allimg += '<div class="i">' + ls[l].innerHTML + '</div>';
				icount++;
				if(icount==1){irows++;}
			}
			if(icount>0 && icount % icols == 0){
				allimg += '<div style="clear:both;overflow:hidden;"></div>';
				irows++;
			}
		}
		allimg += '<div style="clear:both;background-color:#66f;color:#000;font-size:16px;height:18px;width:100%;font-style:italic;text-align:center;display:table;">fin</div>';
		GM_addStyle('.i {font-size:14px;padding:0px;float:left;border:1px solid #f00;background-color:#9f9;text-align:center;min-width:80px;min-height:80px;}');
		var iwidth = window.innerWidth-30;
		//alert('count:'+icount+' rows:'+irows);
		if(icount>0){
			iwidth = icount>=icols ? iwidth/icols : iwidth/(icount);
		}
		GM_addStyle('.imgheight {max-height:' + ((window.innerHeight-60)/irows) + 'px !important;max-width:' + iwidth + 'px !important;}');
		document.body.innerHTML = allimg;
	} catch(e) {
		//GM_log(e.message + ' (' + e.fileName.replace(/.*\/(.*)/g,'$1') + ':' + e.lineNumber + ')');
	}
}

// function removeMale(){
	// if (!document.location.href.match(/comments/gi)){
		// return;
	// }
	// try{
		// var s = document.querySelectorAll('a.title');
		// for (i=0;i<s.length;i++) {
			// if (/\[m\]|<m>|{m}|\s+m\s+|\(m\)|\[cd\]|<cd>|{cd}|[^(fe)]male/i.test(s[i].textContent) && !(/\[f*\]|<f*>|{f*}|\s+f*\s+|\(f*\)/i.test(s[i].textContent))) {
				// s[i].parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML = 'Nothing to see here.';
			// }
		// }
	// } catch(e) {
		// GM_log(e.message + ' (' + e.fileName.replace(/.*\/(.*)/g,'$1') + ':' + e.lineNumber + ')');
	// }
// }

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
		for(t in thresholds)
			if(numrecs>=arRecs[Math.floor(arRecs.length*t)]){
				newbgcolor=thresholds[t];
				newfontsize+=fontFactor;
			}else{
				break;
			}
		if(newbgcolor!=''){
			$(this).parents("div.entry").css({backgroundColor: newbgcolor, '-moz-border-radius':'7px', 'webkit-border-radius':'7px', 'padding':'2px 2px 2px 6px','border': 'solid black 1px'});
			$(this).parents("div.entry").find(".md").css({fontSize: newfontsize});
			$(this).parents('.tagline').css({fontSize: newfontsize,color:'black'});
			$(this).css({fontSize: newfontsize,color:'black'});
		}
	});
}
