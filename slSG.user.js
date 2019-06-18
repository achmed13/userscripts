// ==UserScript==
// @name          slSG
// @version       2019.6.18-1235
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @updateURL     http://seanloos.com/userscripts/slSG.user.js
// @author        Sean Loos
// @icon          http://seanloos.com/icon.png
// @include       *suicidegirls.com/*
// @run-at        document_idle
// @grant         GM_log
// @grant         GM_openInTab
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_download

// ==/UserScript==
var photos = new Array();
var firstRun = true;
// GM_setValue('lastSet','https://www.suicidegirls.com/members/dacay/album/3517230/brown-sofa/');
var lastSet = GM_getValue('lastSet', 'none');
console.log('last: ' + lastSet);
var lastIndex = GM_getValue('lastIndex', 'none');
var indexURL = document.location.href;
if(indexURL.match('spl')){
	document.location.href = lastIndex;
}

function doDownload() {
	var m = document.title.replace(/ Photo Album.*/, '');
	var s = document.title.replace(/.*: (.*) \|.*/, '$1');
	var links = document.querySelectorAll('.photo-container a');
	var i = 1;

	for (var l of links) {
		if (l.href) {
			var t = s.replace(/\s/g, '_') + '_';
			if (i < 10) {
				t += '0';
			}
			t += i;
			var dl = 'sg\\\\' + m + '\\\\' + t + '.jpg';
			//            dl = dl.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			l.title = t;
			l.download = dl;
			var p = {
				url: l.href,
				name: dl
			};
			photos.push(p);
			//            GM_download(l.href,dl);
			i++;
		}
	}
	//    doDownloadSet(photos);
};

function doDownloadSet(photos) {
	var p = photos.pop();
	//    console.log(url);
	if (!p) {
		return;
	}
	GM_download(p.url,p.name);
	if (photos.length > 0) {
		setTimeout(doDownloadSet, 70, photos);
		GM_log(p);
	}
}

function getPhotos() {
	document.getElementById('content-container').querySelector('a[href*="photos"]').click();
}

var sets = document.querySelectorAll('article section a');
for (var i = 0; i < sets.length; i++) {
	var s = sets[i];
	if (s.href == lastSet) {
		s.parentNode.parentNode.classList.add('splFound');
	}
}

var listObserver = new MutationObserver(function (mutations) {
		mutations.forEach(function (e) {
			var stories = e.target.querySelectorAll('article section a');

			stories.forEach(function (s) {
				// console.log('added: '+s.href);
				if (s.href == lastSet) {
					s.parentNode.parentNode.classList.add('splFound');
				}
			});
		});
	});

listObserver.observe(document.getElementById('content-container'), {
	attributes: false,
	childList: true,
	characterData: false,
	subtree: true
});

doDownload();

function openSets() {
	var sets = new Array(0);
	var links = document.querySelectorAll('article section a');
	for (i = 0; i < links.length; i++) {
		var link = links[i];
		if (firstRun && /com\/photos/.test(document.location.href)) {
			GM_setValue('lastSet', link.href);
			firstRun = false;
		}
		if (link.href == lastSet && /com\/photos/.test(document.location.href)) {
			console.log('found last set');
			i = links.length + 1;
		} else {
			sets.push(link.href);
			//       setTimeout(GM_openInTab(link.href,true),500*i);
		}
	}
	doOpenSet(sets);
}

function doOpenSet(sets) {
	var url = sets.shift();
	//    console.log(url);
	if (!url) {
		return;
	}
	GM_openInTab(url, true);
	if (sets.length > 0) {
		setTimeout(doOpenSet, 600, sets);
		//        console.log('loop');
	}
}

function savePosition(){
	if(/offset/.test(document.location.href)){
		GM_setValue('lastIndex',document.location.href);
	}
}

document.addEventListener('keydown', function (e) {
	// check to see if we are in a text box
	if (e.ctrlKey || e.altKey || e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.contentEditable == true) {
		return;
	}
	var key = String.fromCharCode(e.keyCode);
	if (key == 'D') {
		e.preventDefault();
		e.stopPropagation();
		// getDTA();
		//        doDownload();
		doDownloadSet(photos);
	}
	if (key == 'A') {
		e.preventDefault();
		e.stopPropagation();
		getPhotos();
	}
	if (key == 'G') {
		e.preventDefault();
		e.stopPropagation();
		savePosition();
		openSets();
	}
}, false);

// example:
// selectNodes(document,'//div[contains(@class,"NB-menu-manage-story-share-save")]');
function selectNodes(context, xpath) {
	var nodes = document.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var result = new Array(nodes.snapshotLength);
	for (var x = 0; x < result.length; x++) {
		result[x] = nodes.snapshotItem(x);
	}
	return result;
}
