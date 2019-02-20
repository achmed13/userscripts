// ==UserScript==
// @name          slInoreaderTweaks
// @version       2019.2.20-1051
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @updateURL     http://seanloos.com/userscripts/slInoreaderTweaks.user.js
// @author        Sean Loos
// @icon          http://seanloos.com/icons/sean.png
// @include       *inoreader.com*
// @runat         document-idle
// @grant         GM_openInTab
// @noframes
// ==/UserScript==

(function () {
	'use strict';

	document.title = 'Inoreader - ' + document.title;

	var js = document.createElement('script');
	js.src = 'https://platform.twitter.com/widgets.js';
	(document.body || document.head || document.documentElement).appendChild(js);

	(function () {
		// Keyboard Listener
		var onKeyboard = function (e) {
			if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') {
				return;
			}
// 			var key = String.fromCharCode(e.keyCode);
			var key = e.key;
			if(key==undefined){
// 				console.log('key undefined');
				return;
			}
			key = key.toUpperCase();
// 			console.log(e.code + ' = ' + key);
			// if(e.keyCode == 13 /*enter*/) {
			// e.preventDefault();
			// collapseArticle();
			// }
			if (key == 'A' && e.altKey) {
				e.preventDefault();
				e.stopPropagation();
				simulateKey(65,"down",{shiftKey:true});
				simulateKey(65,"up",{shiftKey:true});
				return;
			}
			if (key == 'W' && !e.ctrlKey && !e.altKey) {
				e.preventDefault();
				e.stopPropagation();
				openArticle(true);
				return;
			}
			if (key == 'F' && !e.ctrlKey && !e.altKey) {
				e.preventDefault();
				e.stopPropagation();
				//console.log('next');
				goNext();
				return;
			}
			if (key == 'R' && !e.ctrlKey && !e.altKey) {
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
				simulateKey(74, "down", {'shiftKey':true});
				simulateKey(74, "up", {'shiftKey':true});
				return;
			}
			if (key == 'Q') {
				e.preventDefault();
				e.stopPropagation();
				simulateKey(75, "down", {'shiftKey':true});
				simulateKey(75, "up", {'shiftKey':true});
				return;
			}
		};
		window.addEventListener('keyup', onKeyboard, true);
	})();

	function openArticle(backgroundTab) {
		var l = document.querySelector('.article_current .column_view_title a');
		if (l) {
			GM_openInTab(l.href, backgroundTab);
		} else {
			//console.log('***no link found***');
		}
	}

	function goNext() {
		document.querySelector('#sb_rp_next_article').click();
		window.setTimeout(checkAlbum, 150);
	}

	function checkAlbum() {
		var spa = document.querySelector('.article_content #splAlbum');
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
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, true);
		elem.dispatchEvent(evt);
	}

	var listObserver = new MutationObserver(function (mutations) {
			mutations.forEach(function (e) {
				var stories = e.target.querySelectorAll('.article_no_thumbnail');
				//console.log(e);
				stories.forEach(function (s) {
					var f = s.querySelector('.article_feed_title');
					var c = 0;
					if (f) {
						c = getHue(f.innerHTML.trim());
					}
					s.style.background = 'hsl(' + c + ',95%,90%)';
				});
			});
		});

	listObserver.observe(document.getElementById('reader_pane'), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: false
	});

	function getHue(title) {
		var hue = 0;
		var l = 0;
		var cc = 0;
		for (l = 0; cc = title.charCodeAt(l); l++) {
			hue += cc;
		}
		hue %= 360;
		return hue;
	}
/**
 * Simulate a key event.
 * @param {Number} keyCode The keyCode of the key to simulate
 * @param {String} type (optional) The type of event : down, up or press. The default is down
 * @param {Object} modifiers (optional) An object which contains modifiers keys { ctrlKey: true, altKey: false, ...}
 */
function simulateKey (keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;

	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

	// create an observer instance
	var articleObserver = new MutationObserver(function (mutations) {
			mutations.forEach(function (e) {
				var done = false;
// 				document.title = 'Inoreader - ' + document.title;

				var content = e.target.querySelector('.article_content');
				if (content) {
					if (content.classList.contains('splDone')) {
						return;
					}
					var s = content.parentNode.querySelector('.article_title');
					var f = content.parentNode.querySelector('.article_sub_title a[title="Go to feed"]');
					var c = 0;
					if (f) {
						c = getHue(f.innerHTML.trim());
					}
					content.parentNode.querySelector('.article_footer').style.background = 'hsl(' + c + ',95%,90%)';

					// ****************************************
					// ***** Embedded Facebook *****
					// ****************************************
					var m = document.getElementById('fb-root');
					if (m) {
						var js = document.createElement('script');
						js.id = 'facebook-jssdk';
						js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";
						var v = content.querySelector('.fb-video');
						var p = content.querySelector('.fb-post');
						if (v) {
							var vid = content.innerHTML.match(/cite=.*?com(.*?)"/)[1];
							v.outerHTML = v.outerHTML.replace('class="fb-video"', 'class="fb-video" data-allowfullscreen="1" data-href="' + vid + '?type=3"');
							m.parentNode.insertBefore(js, m);
						}
						if (p) {
							var post = content.innerHTML.match(/cite="(.*?)"/)[1];
							p.outerHTML = p.outerHTML.replace('class="fb-post"', 'class="fb-post" data-href="' + post + '" data-width="500"');
							m.parentNode.insertBefore(js, m);
						}
					}

					// ****************************************
					// ***** YouTube Links *****
					// ****************************************
					content.querySelectorAll('embed,iframe').forEach(function (em) {
						if (em.src.match(/youtube/)) {
							var rex = /.*(youtube)(-nocookie)?(\.com)?(\/|%2F)?(embed|v)?(\/|%2F)?(.*video-|.*v=)?([\w\d-]*).*/;
							var rep = 'http://$1.com/watch?v=$8';
							var yt = document.createElement('div');
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
							//var wid = document.getElementById('three_way_contents').clientWidth - 50;
							//mvar hei = document.getElementById('three_way_contents').clientHeight - 100;
							var imgStyle = 'position:relative;z-index:100;width:auto;'; //max-width:'+wid+'px !important;max-height:' + hei + 'px;'
							var img;
							var img2;
							var node = document.createElement('div');

							// Youtube
							if (link.href.match(/youtube\.com/)) {
								img = link.href.replace(/.*?v(=|%3D)(.*)/, '$2');
								if (img.match(/(&|%26)/)) {
									img = img.replace(/(.*?)(&|%26).*/, '$1');
								}
								if (img.match(/(#)/)) {
									img = img.replace(/(.*?)(#).*/, '$1');
								}
								img = 'http://img.youtube.com/vi/' + img + '/0.jpg';
								node.innerHTML += '<img src="' + img + '" class="splRedditImg">';
								//link.parentNode.insertBefore(node,link.parentNode.firstChild);
							}
							// Youtube
							else if (link.href.match(/youtu\.be/)) {
								img = link.href.replace(/.*\/(.*)/, '$1');
								if (img.match(/\?/)) {
									img = img.replace(/(.*?)\?.*/, '$1');
								}
								img = 'http://img.youtube.com/vi/' + img + '/0.jpg';
								node.innerHTML = '<img src="' + img + '" class="splRedditImg">';
								//link.parentNode.insertBefore(node,link.parentNode.firstChild);
							}
							// gifv
							else if ((link.href.match(/\.(jpg|gif|png)/) && !link.href.match(/\.gifv/)) || link.href.match(/reddituploads/)) {
								img = link.href;
								node.innerHTML = '<img src="' + img + '" class="splRedditImg">';
							}
							// gfycat
							else if (!link.href.match(/jpg|gif|png/) && link.href.match(/gfycat/)) {
								img = link.href.match(/.*gfycat\.com\/([^\/"]+)/)[1];
								node.innerHTML = "<div style='position:relative;padding-bottom:calc(100% / 1.78)'><iframe src='https://gfycat.com/ifr/" + img + "' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>";

								//node.innerHTML = '<video autoplay="" loop="" poster="//thumbs.gfycat.com/'+img+'-poster.jpg" style="-webkit-backface-visibility: hidden;-webkit-transform: scale(1);max-width:100%;max-height:calc((100vh - 100px)*.95);"><source id="mp4source" src="//zippy.gfycat.com/'+img+'.mp4" type="video/mp4"><source id="mp4source" src="//giant.gfycat.com/'+img+'.mp4" type="video/mp4"><source id="mp4source" src="//fat.gfycat.com/'+img+'.mp4" type="video/mp4"></video>';
							}
							// Pornbot videos
							else if (!link.href.match(/jpg|gif|png/) && link.href.match(/pornbot/)) {
								img = link.href.replace(/(.*pornbot\.net\/)(.*)/, '$2');
								node.innerHTML = '<video autoplay="" src="http://asstro.pornbot.net/public/pbot/' + img + '/' + img + '_720p.mp4" -webkit-transform: scale(1);max-width:100%;max-height:calc((100vh - 100px)*.95);"><source src="http://asstro.pornbot.net/public/pbot/' + img + '/' + img + '_720p.mp4" type="video/mp4"></video>';
							}
							// Imgur Album
							else if (!link.href.match(/jpg|png/) && link.href.match(/imgur/)) {
								if (link.href.match(/\/a|gallery\//)) {
									link.innerHTML += ' <span id="splAlbum" class="splAlbum">ALBUM<\/span>';
								} else if (link.href.match(/\.gifv|\.mp4/)) {
									img = link.href.replace(/gifv/, 'mp4');
									node.innerHTML = '<video autoplay="" loop="loop" muted="muted" style="-webkit-transform: scale(1);max-width:100%;max-height:calc((100vh - 100px)*.95);"><source src="' + img + '" type="video/mp4"></video>';
									//link.innerHTML += ' <span id="splAlbum" style="font-weight:bold;background-color:#0f0;color:#000;">GIFV<\/span>';
								} else {
									img2 = link.href + '.jpg';
									node.innerHTML = '<img src="' + img2 + '" class="splRedditImg">';
								}
							}

							content.insertBefore(node, content.firstChild);

							var icon = document.createElement('img');
							icon.src = '//www.google.com/s2/favicons?domain=' + link.href.match(/.*:\/\/(.*?)\//)[1];
							icon.classList.add('splFavIcon');
							link.parentNode.insertBefore(icon, link);
							link.innerHTML = link.innerHTML.replace(/\[link\]/, link.href.match(/.*:\/\/(www\.)?(.*?)\//)[2]);

							content.querySelectorAll('img').forEach(function (i) {
// 								if (i.src.match(/.*thumbs\.reddit.*/)) {
								if ('originalSrc' in i.dataset && i.dataset.originalSrc.match(/.*thumbs\.reddit.*/)) {
									if (img || img2) {
										i.style.display = "none";
									} else {
										i.style.width = '350px';
									}
								}
							});
						}
					});

					// ****************************************
					// ***** Instagram Embed *****
					// ****************************************
					content.innerHTML = content.innerHTML.replace(/<blockquote[\w\W]*?(http.*?instagram.*?\/p\/(.*?))[\/"'][\w\W]*?<\/blockquote>/gi, '<iframe class="spl_ig" src="$1/embed/captioned" scrolling="auto"></iframe><br/>$1<br/>');

					//                // ****************************************
					//                // ***** Gawker double image *****
					//                // ****************************************
					//                var dupimg = content.querySelector('img[src*="fl_progressive"]:first-of-type');
					//                if(dupimg && dupimg.nextSibling.tagName=='IMG'){
					//                    dupimg.classList.add('dupimg');
					//                }


					// ****************************************
					// ***** add anchor to links *****
					// ****************************************
					content.innerHTML = content.innerHTML.replace(/([^"'=\?&])(http[^"'<>\s\n]+)/gi, '$1<br/><a href="$2" target="_blank">$2</a><br/>');

					// ****************************************
					// ***** Embedded Tweets *****
					// ****************************************
					if (content.innerHTML.match(/twitter\-tweet/i)) {
						var ch = content.innerHTML;
						ch = ch.replace(/&lt;/g, '<');
						ch = ch.replace(/&gt;/g, '>');
						content.innerHTML = ch;
					}
					//content.innerHTML = content.innerHTML.replace(/([^"'].*?)(http.*?twitter.*?status.*)([^0-9]?)/gi,'$1<blockquote class="twitter-tweet"><a href="$2">$2</a></blockquote>$3');
					var bq = content.querySelectorAll('blockquote');
					if (bq) {
						bq.forEach(function (b) {
							if (b.innerHTML.match(/twitter.*?status.*?>/i)) {
								b.classList.add('twitter-tweet');
							}
						});

						var script = document.createElement('script');
						script.appendChild(document.createTextNode('(function(){twttr.widgets.load(document.querySelector(\'.article_content\'));})();'));
						content.appendChild(script);
					}

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

})();
