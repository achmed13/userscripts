// ==UserScript==
// @name          slInoreaderTweaks
// @version       2023.5.26-1622
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @updateURL     http://seanloos.com/userscripts/slInoreaderTweaks.user.js
// @author        Sean Loos
// @icon          http://seanloos.com/icons/sean.png
// @include       *inoreader.com*
// @run-at		  document-idle
// @grant         GM_openInTab
// @nocompat Chrome
// @noframes
// ==/UserScript==

'use strict';
document.title = 'Inoreader - ' + document.title;

let js = document.createElement('script');
js.src = '//platform.twitter.com/widgets.js';
(document.body || document.head || document.documentElement).appendChild(js);

// if ('loading' == document.readyState) {
//   alert("This script is running at document-start time.");
// } else {
//   alert("This script is running with document.readyState: " + document.readyState);
// }

document.addEventListener('keyup', function (e) {
	let vKey = e.which;
	let key = String.fromCharCode(vKey).toUpperCase();
	if (key == 'F' && !e.ctrlKey && !e.altKey) {
		e.stopImmediatePropagation();
		e.preventDefault();
		e.stopPropagation();
		goNext();
		colorTitles();
		return;
	}
	if (key == 'S' && e.shiftKey) {
		e.preventDefault();
		e.stopPropagation();
		simulateKey("f","press",{shiftKey:false});
		return false;
	}
	if (key == 'A' && e.altKey) {
		e.preventDefault();
		e.stopPropagation();
		simulateKey("a","down",{shiftKey:true});
		simulateKey("a","up",{shiftKey:true});
		return false;
	}
});

document.addEventListener('keydown', function (e) {
	if ( /INPUT|SELECT|TEXTAREA|CANVAS/i.test(e.target.tagName) ) {
		return true;
	}
	//Identifies the key
	let vKey = e.which;
	let key = String.fromCharCode(vKey).toUpperCase();

	if (key == 'W' && !e.ctrlKey && !e.altKey) {
		e.stopImmediatePropagation();
		e.preventDefault();
		e.stopPropagation();
		openArticle(true);
		return;
	}
	if (key == 'R' && !e.ctrlKey && !e.altKey) {
		e.stopImmediatePropagation();
		e.preventDefault();
		e.stopPropagation();
		goPrev();
		return;
	}
	if (key == 'Y') {
		e.preventDefault();
		e.stopPropagation();
		openYouTube();
		return;
	}
	if (key == 'Z') {
		e.preventDefault();
		e.stopPropagation();
		simulateKey('j', "down", {'shiftKey':true});
		simulateKey('j', "up", {'shiftKey':true});
		setTimeout(colorTitles,1000);
		return;
	}
	if (key == 'Q') {
		e.preventDefault();
		e.stopPropagation();
		simulateKey('k', "down", {'shiftKey':true});
		simulateKey('k', "up", {'shiftKey':true});
		setTimeout(colorTitles,1000);
		return;
	}
});


function openArticle(backgroundTab) {
	let l = document.querySelector('.article_current .column_view_title a');
	if (l) {
		GM_openInTab(l.href, backgroundTab);
	// } else {
		//  console.log('***no link found***');
	}
}

function goNext() {
	document.querySelector('#sb_rp_next_article').click();
	//window.setTimeout(checkAlbum, 150);
}

function checkAlbum() {
	let spa = document.querySelector('.article_content #splAlbum');
	if (spa) {
		spa.removeAttribute('id');
		openArticle(true);
		if (document.querySelector('#sb_rp_next_article')) {
			goNext();
		}
	}
}
function goPrev() {
	document.querySelector('#sb_rp_prev_article').click();
}

function openYouTube() {
	GM_openInTab(document.getElementById('splYouTube').href, false);
}

function doClick(elem) {
	let evt = document.createEvent('MouseEvents');
	evt.initEvent('click', true, true);
	elem.dispatchEvent(evt);
}

function getHue(title) {
	let hue = 0;
	let l = 0;
	let cc = 0;
	for (l = 0; cc = title.charCodeAt(l); l++) {
		hue += cc;
	}
	hue %= 360;
	return hue;
}

/********************************************
 * Simulate a key event.
 * @param {Number} keyCode The keyCode of the key to simulate
 * @param {String} type (optional) The type of event : down, up or press. The default is down
 * @param {Object} modifiers (optional) An object which contains modifiers keys { ctrlKey: true, altKey: false, ...}
 ********************************************/
function simulateKey (key, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	var modifier = (typeof(modifiers) === "object") ? modifier : {};
	var keyCode = (typeof(key) === "string") ? key.toUpperCase().charCodeAt(0) : key;
	let options = {
		"keyCode": keyCode
		,"cancelable":false
		,"bubbles":true
	}
	for (let i in modifiers) {
		options[i] = modifiers[i];
	}
	let event = new KeyboardEvent(evtName,options);
	document.dispatchEvent(event);
}

// create an observer instance
let articleObserver = new MutationObserver(function (mutations) {
	mutations.forEach(function (e) {
		let done = false;
		document.title = 'Inoreader - ' + document.title;

		let content = e.target.querySelector('.article_content');
		if (content) {
			if (content.classList.contains('splDone')) {
				return;
			}

			let s = content.parentNode.querySelector('.article_title');
			let f = content.parentNode.querySelector('.article_sub_title a[title="Go to feed"]');
			let c = 0;
			if (f) {
				c = getHue(f.innerHTML.trim());
			}
			if(s && c){
				s.style.backgroundColor = 'hsl(' + c + ',95%,90%)';
			}

			// ****************************************
			// ***** YouTube Links *****
			// ****************************************
			content.querySelectorAll('embed,iframe').forEach(function (em) {
				if (em.src.match(/youtube/)) {
					let rex = /.*(youtube)(-nocookie)?(\.com)?(\/|%2F)?(embed|v)?(\/|%2F)?(.*video-|.*v=)?([\w\d-]*).*/;
					let rep = '//$1.com/watch?v=$8';
					let yt = document.createElement('div');
					yt.innerHTML = '<a id="splYouTube" href="' + em.src.replace(rex, rep) + '" target="_blank" class="splYouTube">Watch on YouTube</a>';
					em.style.border = '2px solid #f00';
					em.parentNode.insertBefore(yt, em);
					// em.parentNode.style.minHeight='400px';
					done = true;
				}
			});


			// ****************************************
			// ***** Reddit thumbnails *****
			// ****************************************
			content.querySelectorAll('a').forEach(function (link) {
				if (link.innerHTML.match(/\[link\]/)) {
					let imgStyle = 'position:relative;z-index:100;width:auto;'; //max-width:'+wid+'px !important;max-height:' + hei + 'px;'
					let img;
					let img2;
					let node = document.createElement('div');

					// Youtube
					if (link.href.match(/youtube\.com/)) {
						img = link.href.replace(/.*?v(=|%3D)(.*)/, '$2');
						if (img.match(/(&|%26)/)) {
							img = img.replace(/(.*?)(&|%26).*/, '$1');
						}
						if (img.match(/(#)/)) {
							img = img.replace(/(.*?)(#).*/, '$1');
						}
						img = '//img.youtube.com/vi/' + img + '/0.jpg';
						node.innerHTML += '<img src="' + img + '" class="splRedditImg">';
						//link.parentNode.insertBefore(node,link.parentNode.firstChild);
					}
					// Youtube
					else if (link.href.match(/youtu\.be/)) {
						img = link.href.replace(/.*\/(.*)/, '$1');
						if (img.match(/\?/)) {
							img = img.replace(/(.*?)\?.*/, '$1');
						}
						img = '//img.youtube.com/vi/' + img + '/0.jpg';
						node.innerHTML = '<img src="' + img + '" class="splRedditImg">';
						//link.parentNode.insertBefore(node,link.parentNode.firstChild);
					}
					// gifv
					else if ((link.href.match(/\.(jpg|gif|png)/) && !link.href.match(/\.gifv/)) || link.href.match(/reddituploads/)) {
						// 						img = link.href;
						// 						node.innerHTML = '<img src="' + img + '" class="splRedditImg">';
					}
					// gfycat
					else if (!link.href.match(/jpg|gif|png/) && link.href.match(/gfycat/)) {
						img = link.href.match(/.*gfycat\.com\/([^\/"]+)/)[1];
						// 						console.log('gfycat: '+img);
						content.querySelector('iframe').style.visibility='hidden';
						node.innerHTML = "<div style='position:relative;padding-bottom:calc(100% / 1.78)'><iframe src='//gfycat.com/ifr/" + img + "' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>";
					}
					// Pornbot videos
					else if (!link.href.match(/jpg|gif|png/) && link.href.match(/pornbot/)) {
						img = link.href.replace(/(.*pornbot\.net\/)(.*)/, '$2');
						node.innerHTML = '<video autoplay="" src="//asstro.pornbot.net/public/pbot/' + img + '/' + img + '_720p.mp4" -webkit-transform: scale(1);max-width:100%;max-height:calc((100vh - 100px)*.95);"><source src="//asstro.pornbot.net/public/pbot/' + img + '/' + img + '_720p.mp4" type="video/mp4"></video>';
					}
					// Imgur Album
					else if (!link.href.match(/jpg|png/) && link.href.match(/imgur/)) {
						if (link.href.match(/\.gifv|\.mp4/)) {
							img = link.href.replace(/gifv/, 'mp4');
							node.innerHTML = '<video autoplay="" loop="loop" controls="true" muted="muted" style="-webkit-transform: scale(1);max-width:100%;max-height:calc((100vh - 100px)*.95);"><source src="' + img + '" type="video/mp4"></video>';
							//link.innerHTML += ' <span id="splAlbum" style="font-weight:bold;background-color:#0f0;color:#000;">GIFV<\/span>';
						} else {
							img2 = link.href + '.jpg';
							node.innerHTML = '<img src="' + img2 + '" class="splRedditImg">';
						}
					}
					// 							let innoImage = $("a img",content);
					// 							innoImage.each((key,value) => {
					// // 								console.log({ value });
					// 								if(value.dataset.originalSrc.match(/redd\.it/gi)){
					// 									value.classList.add('splInnoImage');
					// // 									node.innerHTML = '';
					// 								}
					// 							});

					content.insertBefore(node, content.firstChild);

					let icon = document.createElement('img');
					icon.src = '//www.google.com/s2/favicons?domain=' + link.href.match(/.*:\/\/(.*?)\//)[1];
					icon.classList.add('splFavIcon');
					link.parentNode.insertBefore(icon, link);
					link.innerHTML = link.innerHTML.replace(/\[link\]/, link.href.match(/.*:\/\/(www\.)?(.*?)\//)[2]);

					content.querySelectorAll('img').forEach(function (i) {
						// if (i.src.match(/.*thumbs\.reddit.*/)) {
						if ('originalSrc' in i.dataset && i.dataset.originalSrc.match(/(.*\.redd\.?it.*)|(.*imgur.*)/)) {
							if (img || img2) {
								i.style.display = "none";
							} else {
								i.src = i.dataset.originalSrc;
								//i.style.width = '350px';
							}
						}
						if (i.src.match(/(\.redd\.?it)|(imgur)/)) {
							i.classList.add('splRedditImg');
						}
					});
				}
			});

			// ****************************************
			// ***** Instagram Embed *****
			// ****************************************
			// content.innerHTML = content.innerHTML.replace(/<blockquote[\w\W]*?(http.*?instagram.*?\/p\/(.*?))[\/"'][\w\W]*?<\/blockquote>/gi, '<iframe class="spl_ig" src="$1/embed/captioned" scrolling="auto"></iframe><br/>$1<br/>');

			//                // ****************************************
			//                // ***** Gawker double image *****
			//                // ****************************************
			//                let dupimg = content.querySelector('img[src*="fl_progressive"]:first-of-type');
			//                if(dupimg && dupimg.nextSibling.tagName=='IMG'){
			//                    dupimg.classList.add('dupimg');
			//                }


			// ****************************************
			// ***** add anchor to links *****
			// ****************************************
			content.innerHTML = content.innerHTML.replace(/([^"'=\?&])(http[^"'<>\s\n]+)/gi, '$1<br/><a href="$2" target="_blank">$2</a><br/>');

// 			// ****************************************
// 			// ***** Embedded Tweets *****
// 			// ****************************************
// 			if (content.innerHTML.match(/twitter\-tweet/i)) {
// 				let ch = content.innerHTML;
// 				ch = ch.replace(/&lt;/g, '<');
// 				ch = ch.replace(/&gt;/g, '>');
// 				content.innerHTML = ch;
// 			}
// 			//content.innerHTML = content.innerHTML.replace(/([^"'].*?)(http.*?twitter.*?status.*)([^0-9]?)/gi,'$1<blockquote class="twitter-tweet"><a href="$2">$2</a></blockquote>$3');
// 			let bq = content.querySelectorAll('blockquote');
// 			if (bq) {
// 				bq.forEach(function (b) {
// 					if (b.innerHTML.match(/twitter.*?status.*?>/i)) {
// 						b.classList.add('twitter-tweet');
// 					}
// 				});

// 				let script = document.createElement('script');
// 				script.appendChild(document.createTextNode('(function(){twttr.widgets.load(document.querySelector(\'.article_content\'));})();'));
// 				content.appendChild(script);
// 			}

			content.classList.add('splDone');
		}
	});
});
// pass in the target node, as well as the observer options
articleObserver.observe(document.getElementById('three_way_contents'), {
	attributes: false,
	childList: true,
	characterData: false,
	subtree: false
});


let colorTitles = (nodeList = null) => {
	if(!nodeList){
		nodeList = document.getElementById('reader_pane').querySelectorAll('.article_no_thumbnail');
	}
	for(let i = 0;i < nodeList.length;i++){
		let s = nodeList[i];
		if(s.nodeType == 1){
			let f = s.querySelector('.article_feed_title');
			let c = 0;
			if (f) {
				c = getHue(f.innerHTML.trim());
				s.style.background = 'hsl(' + c + ',95%,90%)';
			}
		}
	}
}

let listObserver = new MutationObserver(function (mutations) {
	mutations.forEach(function (e) {
		setTimeout(colorTitles,500);
		// let stories = e.target.querySelectorAll('.article_no_thumbnail'); // e.addedNodes;
		// colorTitles(stories);
	});
});

listObserver.observe(document.getElementById('reader_pane'), {
	attributes: false,
	childList: true,
	characterData: false,
	subtree: false
});

setTimeout(colorTitles,2000);


