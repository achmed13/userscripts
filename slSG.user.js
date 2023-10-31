// ==UserScript==
// @name          slSG
// @version       2020.2.18-1350
// @namespace     seanloos.com
// @homepageURL   https://seanloos.com/userscripts/
// @updateURL     https://seanloos.com/userscripts/slSG.user.js
// @author        Sean Loos
// @icon          https://seanloos.com/icon.png
// @match		  *suicidegirls.com/*
// @run-at        document_idle
// @grant         GM_log
// @grant         GM_openInTab
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_setClipboard
// @grant         GM_download
// ==/UserScript==

var photos = new Array();
var firstRun = true;
// GM_setValue('lastSet','https://www.suicidegirls.com/members/ellared/album/4240702/notorious/');
var lastSet = GM_getValue('lastSet', 'none');
console.log('last: ' + lastSet);
var lastIndex = GM_getValue('lastIndex', 'none');
var indexURL = document.location.href;
if(indexURL.match('spl')){
	document.location.href = lastIndex ;
}
var path = '';
var bFound = false;

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
			path = m + '\\';
			var dl = t + '.jpg';
			// dl = dl.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			l.title = t;
			l.download = dl;
			var p = {
				url: l.href,
				name: dl
			};
			photos.push(p);
			// GM_download(l.href,dl);
			i++;
		}
	}
	//    doDownloadSet(photos);
};

function doDownloadSet(photos) {
	let cmd = 'cd c:\\temp\\sean\\sg';
	cmd += '\n';
	cmd += 'curl --create-dirs --parallel --parallel-max '+(photos.length+1);
	for(var p of photos){
		cmd += ' --url "'+p.url+'"';
		cmd += ' --output "'+path+p.name+'"';
		// 		cmd += ' --time-cond "'+path+p.name+'"';
	}
	cmd += '\n';
	cmd += 'start c:\\temp\\sean\\sg\\'+path;
	cmd += '\n';
	cmd += 'choice /N /T 10 /D Y >nul  2>&1';
	GM_setClipboard(cmd);
	GM_log(cmd);
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
		// console.log('loop');
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
		// doDownload();
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

