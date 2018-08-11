// ==UserScript==
// @name			slSG
// @namespace		seanloos.com
// @icon			http://seanloos.com/icons/sean.png
// @include			*suicidegirls.com/*
// @version			2018.08.11
// @grant			GM_openInTab
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_download

// ==/UserScript==

var doDownload = function(){
	var m = document.title.replace(/ Photo Album.*/, '');
	var s = document.title.replace(/.*: (.*) \|.*/, '$1');
	var links = document.querySelectorAll('.photo-container a');
	var i = 1;

	for (var l of links) {
		if (l.href) {
			var t = s + '_';
			if (i < 10) {
				t = t + '0';
			}
			t = t + i;
			var dl = 'sg\\'+m+'\\'+t+'.jpg';
			GM_download(l.href,dl);
			i++;
		}
	}
};

function getPhotos(){
	document.getElementById('content-container').querySelector('a[href*="photos"]').click();
}

var firstRun = true;
// GM_setValue('lastSet','https://www.suicidegirls.com/members/dacay/album/3517230/brown-sofa/');
var lastSet = GM_getValue('lastSet','none');
console.log('last: '+lastSet);

var sets = document.querySelectorAll('article section a');
for(var i=0;i<sets.length;i++){
	var s= sets[i];
	if(s.href == lastSet) {
		s.parentNode.parentNode.classList.add('splFound');
	}
}

var listObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(e) {
		var stories = e.target.querySelectorAll('article section a');

		stories.forEach(function(s){
			// console.log('added: '+s.href);
			if(s.href == lastSet) {
				s.parentNode.parentNode.classList.add('splFound');
			}
		});
	});
});

listObserver.observe(document.getElementById('content-container'), {attributes: false, childList: true, characterData: false , subtree: true});


function openSets(){
	var sets = new Array(0);
	var links = document.querySelectorAll('article section a');
   for(i=0;i<links.length;i++){
      var link = links[i];
      if(firstRun && document.location.href.match(/com\/photos/)){
         GM_setValue('lastSet',link.href);
         firstRun = false;
      }
      if(link.href == lastSet) {
		  console.log('found last set');
		  i=links.length+1;
      } else {
		  sets.push(link.href);
//       setTimeout(GM_openInTab(link.href,true),500*i);
	  }
	}
	doOpenSet(sets);
}

function doOpenSet(sets){
	var url = sets.pop();
// 	console.log(url);
	if(!url){return;}
	GM_openInTab(url,true);
	if(sets.length > 0){
		setTimeout(doOpenSet,2000,sets);
// 		console.log('loop');
	}
}

document.addEventListener('keydown',function(e){
	// check to see if we are in a text box
	if (e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA' || e.target.contentEditable == true){
		return;
	}
	var key = String.fromCharCode(e.keyCode);
	if(key == 'D' && !e.ctrlKey){
		e.preventDefault();
		e.stopPropagation();
		// getDTA();
		doDownload();
	}
	if(key == 'A' && !e.ctrlKey){
		e.preventDefault();
		e.stopPropagation();
		getPhotos();
	}
	if(key == 'G' && !e.ctrlKey){
		e.preventDefault();
		e.stopPropagation();
		openSets();
	}
},false);

// example:
// selectNodes(document,'//div[contains(@class,"NB-menu-manage-story-share-save")]');
function selectNodes(context, xpath){
   var nodes = document.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   var result = new Array( nodes.snapshotLength );
   for (var x=0; x<result.length; x++){
	  result[x] = nodes.snapshotItem(x);
   }
   return result;
}

