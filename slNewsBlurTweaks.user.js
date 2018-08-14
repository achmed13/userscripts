// ==UserScript==
// @name			slNewsblurTweaks
// @version			2017.01.01
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icons/sean.png
// @description
// @include			*newsblur.com/*
// @runat			document-end
// @grant			GM_openInTab
// ==/UserScript==

(function(){
	var onKeyDown = function(e) {
	if (e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA'){
			return;
		}
		var key = String.fromCharCode(e.keyCode);
		// if(e.keyCode == 13 /*enter*/) {
			// e.preventDefault();
			// collapseArticle();
		// }
		if(key == 'W' && !e.ctrlKey && !e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			openArticle(true);
			return;
		}
		if(key == 'V' && !e.ctrlKey && !e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			openArticle(false);
			return;
		}
		if(key == 'D' && !e.ctrlKey && !e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			//goNext();
			return;
		}
		if(key == 'F' && !e.ctrlKey && !e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			goNext();
			return;
		}
		if(key == 'R' && !e.ctrlKey && !e.altKey) {
			e.preventDefault();
			e.stopPropagation();
			goPrev();
			return;
		}
		if(key == 'Y') {
			e.preventDefault();
			e.stopPropagation();
			openYouTube();
			return;
		}
		if(e.altKey && key == 'A') {
			e.preventDefault();
			e.stopPropagation();
			markRead();
			return;
		}
		if(e.shiftKey && key == 'G') {
			e.preventDefault();
			e.stopPropagation();
			gotoSaved();
			return;
		}
	}
	window.addEventListener('keydown', onKeyDown, true);
})();

function openArticle(backgroundTab){
	var l = document.querySelector('.NB-selected a.NB-feed-story-title');
	if(l){
		GM_openInTab(l.href,backgroundTab);
	} else {
		//console.log('***no link found***');
	}
}

function goNext(){
	document.querySelector('.NB-task-story-next').click();
	window.setTimeout(checkAlbum,100);

}

function checkAlbum(){
	var spa = document.querySelector('.NB-selected #splAlbum');
	if(spa){
		spa.removeAttribute('id');
		openArticle(true);
		if(document.querySelector('.NB-task-story-next')){
			window.setTimeout(function(){goNext();},300);
		}
	}
}
function goPrev(){
	document.querySelector('.NB-task-story-previous').click();
}

function markRead(){
	document.querySelector('.NB-feedbar-mark-feed-read').click();
}

function share(){
	var node = document.querySelector('.NB-feed-story.NB-selected .NB-menu-manage-story-share-save');
	node.click();
}

function openYouTube(){
	var story = document.querySelector('.NB-feed-story.NB-selected');
		GM_openInTab(document.getElementById('splYouTube'),true);
}

function gotoSaved(){
	document.querySelector('.NB-feeds-header-starred').click();
}

function doClick(elem){
	evt = document.createEvent('MouseEvents');
	evt.initEvent( 'click', true, true );
	elem.dispatchEvent(evt);
}

// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(e) {
	var done = false;
	var content = e.target.querySelector('.NB-feed-story-content');
	if (content) {
		if (content.classList.contains('splDone')){return;}
		if (!content.tagName == 'LI'){return;}

		// ****************************************
		// ***** Embedded Facebook *****
		// ****************************************
		var m = document.getElementById('fb-root');
		if (m){
			var js = document.createElement('script');
			js.id = 'facebook-jssdk';
			js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";
			var v = content.querySelector('.fb-video');
			var p = content.querySelector('.fb-post');
			if(v){
				var vid = content.innerHTML.match(/cite=.*?com(.*?)"/)[1];
				v.outerHTML = v.outerHTML.replace('class="fb-video"','class="fb-video" data-allowfullscreen="1" data-href="'+vid+'?type=3"');
				m.parentNode.insertBefore(js, m);
			}
			if(p){
				var post = content.innerHTML.match(/cite="(.*?)"/)[1];
				p.outerHTML = p.outerHTML.replace('class="fb-post"','class="fb-post" data-href="'+post+'" data-width="500"');
				m.parentNode.insertBefore(js, m);
			}
		}
			
		// ****************************************
		// ***** YouTube Links *****
		// ****************************************
		var rex = /.*(youtube)(-nocookie)?(\.com)(\/|%2F)(embed|v)(\/|%2F)([\w\d-]*).*/;
		var rep = 'http://$1$3/watch?v=$7';
		var style = 'color:#fff;font-size:10px;font-weight:bold;padding:3px;background-color:#f00;';
		var embeds = content.querySelectorAll('embed,iframe');
		for (var em=0; em<embeds.length; em++){
			if (embeds[em].src.match(/youtube/)){
				var yt = document.createElement('div');
				yt.innerHTML = '<a id="splYouTube" href="' + embeds[em].src.replace(rex,rep) + '" target="_blank" style="'+style+'">Watch on YouTube</a>';
				embeds[em].style.border='2px solid #f00';
				embeds[em].parentNode.insertBefore(yt,embeds[em]);
				done = true;
			}
		}
		
		// ****************************************
		// ***** Reddit thumbnails *****
		// ****************************************
		var wid = document.getElementById('story_pane').clientWidth - 50;
		var hei = document.getElementById('story_pane').clientHeight - 100;
		var imgStyle = 'position:relative;z-index:100;width:auto;max-width:'+wid+'px !important;max-height:' + hei + 'px;'
		var links = content.querySelectorAll('a');
		for (var l=0; l<links.length; l++) {
			var link = links[l];
			if (link.innerHTML.match(/\[link\]/)) {
				// Youtube
				if (link.href.match(/youtube\.com/)){
					var img = link.href.replace(/.*?v(=|%3D)(.*)/,'$2');
					if(img.match(/(&|%26)/)){
						img = img.replace(/(.*?)(&|%26).*/,'$1');
					}
					if(img.match(/(#)/)){
						img = img.replace(/(.*?)(#).*/,'$1');
					}
					var node = document.createElement('div');
					img = 'http://img.youtube.com/vi/'+img+'/0.jpg';
					node.innerHTML += '<img src="' + img + '" style="'+imgStyle+'">';
					link.parentNode.insertBefore(node,link.parentNode.firstChild); 
					done = true;
				}
				// Youtube
				if (!done && link.href.match(/youtu\.be/)){
					var img = link.href.replace(/.*\/(.*)/,'$1');
					if(img.match(/\?/)){
						img = img.replace(/(.*?)\?.*/,'$1');
					}
					var node = document.createElement('div');
					img = 'http://img.youtube.com/vi/'+img+'/0.jpg';
					node.innerHTML = '<img src="' + img + '" style="'+imgStyle+'">';
					link.parentNode.insertBefore(node,link.parentNode.firstChild); 
					done = true;
				}
				// gifv
				if (!done && (link.href.match(/\.(jpg|gif|png)/) && !link.href.match(/\.gifv/)) || link.href.match(/reddituploads/)) {
					var img = link.href;
					var node = document.createElement('div');
					node.innerHTML = '<img src="' + img + '" style="'+imgStyle+'">';
					content.insertBefore(node,content.firstChild); 
					//link.parentNode.insertBefore(node,link.parentNode.firstChild); 
					done = true;
				}
				// gfycat
				if (!done && !link.href.match(/jpg|gif|png/) && link.href.match(/gfycat/)) {
					var img = link.href.replace(/(.*gfycat\.com\/)(.*)/,'$2');
					var node = document.createElement('div');
					node.innerHTML = '<video autoplay="" loop="" poster="//thumbs.gfycat.com/'+img+'-poster.jpg" style="-webkit-backface-visibility: hidden;-webkit-transform: scale(1);max-width:'+wid+'px;max-height:'+hei+'px;"><source id="webmsource" src="//zippy.gfycat.com/'+img+'.webm" type="video/webm"><source id="webmsource" src="//giant.gfycat.com/'+img+'.webm" type="video/webm"><source id="webmsource" src="//fat.gfycat.com/'+img+'.webm" type="video/webm"></video>';
					content.insertBefore(node,content.firstChild); 
					//link.parentNode.insertBefore(node,link.parentNode.firstChild); 
					done = true;
				}
				// Pornbot videos
				if (!done && !link.href.match(/jpg|gif|png/) && link.href.match(/pornbot/)) {
					var img = link.href.replace(/(.*pornbot\.net\/)(.*)/,'$2');
					var node = document.createElement('div');
					node.innerHTML = '<video autoplay="" src="http://asstro.pornbot.net/public/pbot/'+img+'/'+img+'_720p.mp4" -webkit-transform: scale(1);max-width:'+wid+'px;max-height:'+hei+'px;"><source src="http://asstro.pornbot.net/public/pbot/'+img+'/'+img+'_720p.mp4" type="video/mp4"></video>';
					content.insertBefore(node,content.firstChild); 
					//link.parentNode.insertBefore(node,link.parentNode.firstChild); 
					done = true;
				}
				// Imgur Album
				if (!done && !link.href.match(/jpg|png/) && link.href.match(/imgur/)) {
					if (link.href.match(/\/a\//)){
						link.innerHTML += ' <span id="splAlbum" style="font-weight:bold;background-color:#0f0;color:#000;">ALBUM<\/span>';
					}else if (link.href.match(/\.gifv/)){
						link.innerHTML += ' <span id="splAlbum" style="font-weight:bold;background-color:#0f0;color:#000;">GIFV<\/span>';
					} else {
						var img2 = link.href + '.jpg';
						//var img3 = link.href.match(/imgur\.com\/(.*)/)[1];
						//var imgdiv = '<blockquote class="imgur-embed-pub" lang="en" data-id="'+img3+'" data-context="false"></blockquote><script async src="//s.imgur.com/min/embedocument.js" charset="utf-8"></script>';
						
						var node = document.createElement('div');
						node.innerHTML = '<img src="' + img2 + '" style="'+imgStyle+'">';
						//node.innerHTML = imgdiv;
						content.insertBefore(node,content.firstChild); 
						//link.parentNode.insertBefore(node,link.parentNode.firstChild);
						done = true;
					}
				}
			
				var icon = document.createElement('img');
				icon.src = 'http://www.google.com/s2/favicons?domain=' + link.href.match(/.*:\/\/(.*?)\//)[1];
				icon.style = 'margin-bottom:-6px !important;padding:0px 3px !important;height:24px !important;width:24px !important;';
				link.parentNode.insertBefore(icon,link);
				link.innerHTML = link.innerHTML.replace(/\[link\]/,link.href.match(/.*:\/\/(www\.)?(.*?)\//)[2]);
			}
		}
		var imgs = content.querySelectorAll('img');
		for (var x=0;x<imgs.length;x++) {
			var i = imgs[x];
			if (i.src.match(/.*thumbs\.reddit.*/)) {
				if(img || img2){
					i.style.display = "none";
				} else {
					i.style.width = '350px';
				}
			}
		}
		
		var yt_nolink = content.innerHTML.match(/[^'"](https?:\/\/(www\.)?youtu[be|\.be](.*))\s/);
		if(!done && yt_nolink){
			content.innerHTML = content.innerHTML.replace(/([^'"])(https?:\/\/(www\.)?youtu[be|\.be](.*))\s/,'$1<a href="$2">$2</a>');
		}
		
		// ****************************************
		// ***** Cheeseburger Comments *****
		// ****************************************
		// if (content.innerHTML.match(/gocomments/i)){
			// content.innerHTML = content.innerHTML.replace(/.*gocomments[\s\S]*/gi,'');
		// }
		
		content.classList.add('splDone');
	}
  });    
});


// pass in the target node, as well as the observer options
observer.observe(document.getElementById('story_pane'), { attributes: false, childList: true, characterData: false , subtree: true});


var observer2 = new MutationObserver(function(mutations) {
  mutations.forEach(function(e) {
	e.target.querySelectorAll('.NB-storytitles-feed-border-inner').forEach(function(s){
		var f=s.parentNode.querySelector('.feed_title');
		if(!f){
			f=document.querySelector('.NB-story-titles-header .feed_title');
		}
		var c=0;
		if(f){
			c=getHue(f.innerHTML);
		}
		s.style.background='hsl('+c+',95%,90%)';
	});
  });    
});

observer2.observe(document.getElementById('story_titles'), { attributes: false, childList: true, characterData: false , subtree: false});


function getHue(title){
	var hue = 0,
	i = 0, cc = 0;
	for ( i = 0; cc = title.charCodeAt( i ); i++ ) {
		hue += cc;
	}
	hue %= 360;
	return hue;
}