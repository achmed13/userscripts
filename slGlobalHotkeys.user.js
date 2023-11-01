// ==UserScript==
// @name          slGlobalHotkeys
// @icon          https://seanloos.com/icons/sean.png
// @namespace     seanloos.com
// @version       2019.9.19-1021
// @homepageURL   https://seanloos.com/userscripts/
// @updateURL     https://seanloos.com/userscripts/slGlobalHotkeys.user.js
// @author        Sean Loos
// @description   Sean's Global Hotkeys
// @include       *
// @exclude       *newsblur.com/*
// @exclude       *inoreader.com/*
// @exclude       *plus.google.com/*
// @exclude       *force.com/*
// @exclude       *mail.google.com/*
// @exclude       *groups.google.com/*
// @exclude       *calendar.google.com/*
// @exclude       *console.developers.google.com/*
// @exclude       *docs.google.com/*
// @exclude       *drive.google.com/*
// @exclude       *sites.google.com/*
// @exclude       *earth.google.com/*
// @exclude       *client*.google.com/*
// @exclude       *vimeo.com/*
// @exclude       *wildapricot.com/*
// @exclude       *mailchimp.com/*
// @exclude       *github.com/*
// @exclude       *eventbrite.com/*
// @exclude       *zapreader.com/*
// @exclude       *oudolfgardendetroit.squarespace.com/*
// @exclude       *twitter.com/*
// @exclude       *wildapricot.org/*
// @exclude       *trello.com/*
// @exclude       *yapp.us/editor*
// @exclude       *slack.com/*
// @exclude       *pb.sharedvue.net/*
// @exclude       */wp-admin/*
// @exclude       *mappingsolutions.com/sql/*
// @exclude       */wp-admin/*
// @run-at        window-load
// @grant         GM_log
// ==/UserScript==


var added = false;
var sInterval = 0;
var scrolls = 0;
var scrollheight = 75;
var scrollsteps = 3;
var scrolltime = 60;
var hideInterval = 0;
var hideDelay = 900;
var pixels = window.innerHeight * (scrollheight / scrollsteps / 100);
var line;

// --------------------------------------
// Keyboard Listener
// --------------------------------------
document.addEventListener('keydown', function (e) {
	// check to see if we are in a text box
	var ed = isEditable(e.target);
	if (e.altKey || e.ctrlKey || /INPUT|SELECT|TEXTAREA|CANVAS/i.test(e.target.tagName)) {
		return;
	}
	if (document.location.href.match(/facebook/) && isEditable(e.target)) {
		return;
	}
	var key = String.fromCharCode(e.keyCode);

	// scroll
	if (key == ' ' && !e.shiftKey && !document.location.href.match(/youtube/)) {
		if (!added) {
			addLine();
		}
		//line.style.height = window.pageYOffset + window.innerHeight - 20 + 'px';
		//line.style.display = 'block';
		//hideInterval=setTimeout(hideLine,hideDelay);
		scrollStart();
		e.preventDefault();
		return;
	}

	if (key == 'B') {
		window.history.back();
		e.preventDefault();
		return;
	}

	// if (document.location.href.match(/imgur/) && document.getElementById('next')){
	// if(key == 'F'){
	// document.getElementById('next').click();
	// e.preventDefault();
	// return;
	// }
	// if(key == 'R'){
	// document.getElementById('prev').click();
	// e.preventDefault();
	// return;
	// }
	// }
}, false);

// --------------------------------------
// Sroll part way down the page, marking your spot
// --------------------------------------
function addLine() {
	line = document.createElement('div');
	line.id = 'scroll-line';
	line.style.display = 'none';
	line.style.width = window.innerWidth - 20 + 'px';
	line.style.top = '0px';
	line.style.left = '0px';
	line.style.opacity = '.15';
	line.style.position = 'absolute';
	line.style.backgroundColor = '#000';
	line.style.zIndex = '9999';
	line = document.body.insertBefore(line, document.body.firstChild);
	added = true;
}

function scrollStart() {
	pixels = window.innerHeight * (scrollheight / scrollsteps / 100);
	scrolls = 0;
	clearInterval(sInterval);
	clearTimeout(hideInterval);
	line.style.height = window.pageYOffset + (window.innerHeight / 2) + 'px';
	line.style.display = 'block';
	if (scrollsteps > 1) {
		sInterval = setInterval(scrollPage, scrolltime / scrollsteps);
	} else {
		scrollPage();
	}
}

function scrollPage() {
	if (scrolls == 0) {
		line.style.height = window.pageYOffset + window.innerHeight - 20 + 'px';
	}
	window.scrollBy(0, pixels);
	scrolls += 1;
	if (scrolls == scrollsteps) {
		hideInterval = setTimeout(hideLine, hideDelay);
		clearInterval(sInterval);
	}
}

function hideLine() {
	line.style.display = 'none';
}

// returns true if the element or one of its parents has the class classname
function isEditable(e) {
	if (e.contentEditable == true || e.contentEditable == 'true' || e.contenteditable == true || e.contenteditable == 'true') {
		return true
	};
	return e.parentNode && isEditable(e.parentNode);
}
