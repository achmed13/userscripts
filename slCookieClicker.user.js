// ==UserScript==
// @name          slCookieClicker
// @version       2023.10.31-1517
// @description   Automation for Cookie Clicker
// @namespace     seanloos.com
// @homepageURL   https://seanloos.com/userscripts/
// @downloadURL     https://seanloos.com/userscripts/slCookieClicker.user.js
// @updateURL     https://seanloos.com/userscripts/slCookieClicker.user.js
// @author        Sean Loos
// @icon          https://seanloos.com/icons/sean.png
// @match         https://orteil.dashnet.org/cookieclicker/*
// @grant         GM_addStyle
// @run-at        document-end
// ==/UserScript==

var autoClick;
var autoGoldenClick;
var autoUpgrades = false;
var autoCPS = 0;
var interval = 50;
var autoBuy = false;
//var doNotBuy = [11,64,69,73,74,84,85,181,182,183,184,185,209,333,331,361];
var doNotBuy = [
	69, 74, 84, 85, 181, 182, 183, 184, 185, 209, 333, 331, 361, 414, 452, 563,
	806,
];
var price;
var cnt = 0;

var splStyle = `
#splButtons{
	position: absolute;
	top: 32px;
	z-index: 999;
}
#splButtons button{
	padding: .3em;
	border: 1px solid #666;
}`;
GM_addStyle(splStyle);

var buttonClick = document.createElement('button');
buttonClick.textContent = 'AutoClick';
buttonClick.addEventListener('click', acToggle);

var buttonGolden = document.createElement('button');
buttonGolden.textContent = 'GoldenCookie';
buttonGolden.addEventListener('click', gccToggle);

var buttonBuy = document.createElement('button');
buttonBuy.textContent='AutoBuy';
buttonBuy.addEventListener('click', autoBuyToggle);

var buttonUpgrades = document.createElement('button');
buttonUpgrades.textContent = 'AutoUpgrade';
buttonUpgrades.addEventListener('click', autoUpgradeToggle);

var buttons = document.createElement('div');
buttons.id = 'splButtons';
buttons.appendChild(buttonClick);
buttons.appendChild(buttonGolden);
buttons.appendChild(buttonBuy);
buttons.appendChild(buttonUpgrades);
document.getElementById('topBar').parentNode.appendChild(buttons);

document.addEventListener('keydown', function (e) {
	var key = e.key;
	if (key == 'a') {
		acToggle();
		gccToggle();
		autoBuyToggle();
		autoUpgradeToggle();
	}
	if (key == 'b') {
		autoBuyToggle();
	}
	if (key == 'c') {
		acToggle();
	}
	if (key == 'g') {
		gccToggle();
	}
	if (key == 'u') {
		autoUpgradeToggle();
	}
});

var restartInterval = setInterval(function () {
	if (autoBuy) {
		autoBuy = false;
		setTimeout(function () {
			autoBuy = true;
			OptimalItem();
		}, 3000);
	}
}, 90000);

// autoBuy On
function autoBuyToggle() {
	if (autoBuy) {
		autoBuy = false;
		buttonBuy.style.backgroundColor = 'red';
	} else {
		autoBuy = true;
		OptimalItem();
		buttonBuy.style.backgroundColor = 'green';
	}
}

// autoClick On
function acToggle() {
	if (autoClick > 0) {
		clearInterval(autoClick);
		autoClick = 0;
		autoCPS = 0;
		buttonClick.style.backgroundColor = 'red';
	} else {
		var ms = 250;
		var cl = 100000; //window.prompt('How Many CPS?', 100000);
		cl = cl / (1000 / ms);
		autoCPS = cl * (1000 / ms);
		autoClick = autoClicker(cl, ms);
		buttonClick.style.backgroundColor = 'green';
	}
}

// gcc On
function gccToggle() {
	if (autoGoldenClick > 0) {
		clearInterval(autoGoldenClick);
		autoGoldenClick = 0;
		buttonGolden.style.backgroundColor = 'red';
	} else {
		autoGoldenClick = setInterval(function () {
			if (Game.shimmers[0]) {
				Game.shimmers[0].wrath = 0;
				Game.shimmers[0].l.click();
			}
		}, 1500);
		buttonGolden.style.backgroundColor = 'green';
	}
}

// autoUpgrade On
function autoUpgradeToggle() {
	if (autoUpgrades) {
		autoUpgrades = false;
		buttonUpgrades.style.backgroundColor = 'red';
	} else {
		autoUpgrades = true;
		buttonUpgrades.style.backgroundColor = 'green';
	}
}

function autoClicker(clicksAtOnce, repeatInterval) {
	var cheated = false;
	var intoTheAbyss = function () {
		if (!cheated) {
			cheated = true;
			for (var i = 0; i < clicksAtOnce; i++) {
				Game.ClickCookie();
				Game.lastClick = 0;
			}
			cheated = false;
		}
	};
	return setInterval(intoTheAbyss, repeatInterval);
}

var currentCps = Game.cookiesPs;
function OptimalItem() {
	var cpc = Number.MAX_VALUE;
	var me;
	var tmpCPS = 0;
	var upgradeName = '';
	var selectedItem;
	var upgradeItems = Game.UpgradesInStore.length - 1;
	upgradeItems = upgradeItems > 20 ? 20 : upgradeItems;
	//if(abI && (selected==0 || cnt % 150 == 0)){
	if (autoUpgrades) {
		cnt = 0;
		for (var i = upgradeItems; i >= 0; i--) {
			tmpCPS = 0;
			me = Game.UpgradesInStore[i];
			if (!doNotBuy.some((arrVal) => me.id == arrVal)) {
				// console.log('upgrade',me);
				upgradeName = me.name;
				price = Math.round(me.getPrice());
				// selectedItem = me;
				if (autoBuy && Game.cookies >= price) {
					me.buy();
				}
			}
		}
	}

	for (i = Game.ObjectsById.length - 1; i >= 0; i--) {
		tmpCPS = 0;
		me = Game.ObjectsById[i];
		// console.log('building',me);
		me.amount++;
		Game.CalculateGains();
		for (var j = Game.ObjectsById.length - 1; j >= 0; j--) {
			tmpCPS +=
				Game.ObjectsById[j].cps(Game.ObjectsById[j]) *
				Game.ObjectsById[j].amount;
		}
		// var newCPS = tmpCPS * Game.globalCpsMult;
		var newCPS = Game.cookiesPs;
		// console.log(Game.cookiesPs);
		me.amount--;
		Game.CalculateGains();
		var myCps = newCPS - currentCps;
		var cpsBuilding = (me.price * newCPS) / myCps;
		if (cpsBuilding < cpc && myCps >= 0.1) {
			cpc = cpsBuilding;
			selectedItem = me;
			upgradeName = me.name;
			price = Math.round(me.price);
		}
	}
	currentCps = Game.cookiesPs;
	if (selectedItem && autoBuy && Game.cookies >= price) {
		selectedItem.buy();
	}
	if (cnt % (1000 / interval / 2) == 0) {
		Display(upgradeName);
	}
	cnt++;
	if (autoBuy) {
		setTimeout(OptimalItem, interval);
	}
}

function Display(upgradeName) {
	var mouseCPS = Game.computedMouseCps * autoCPS;
	var totalCPS = Game.cookiesPs + mouseCPS;
	var time = (price - Game.cookies) / totalCPS;
	var txt =
		'' +
		upgradeName +
		'<br>' +
		Beautify(price) +
		'<br>' +
		getHHMMSS(time) +
		'<br>' +
		Beautify(autoCPS) +
		' : ' +
		Beautify(mouseCPS) +
		' /s';
	if (Game.version >= 1.05) {
		Game.tickerL.innerHTML = txt;
	} else {
		Game.Ticker = txt;
	}
	Game.TickerAge = interval;
}

function getHHMMSS(seconds) {
	seconds = parseInt(seconds, 10);
	seconds = seconds > 0 ? seconds : 0;
	var hours = 0;
	var minutes = 0;
	if (seconds > 60) {
		hours = Math.floor(seconds / 3600);
		minutes = Math.floor((seconds - hours * 3600) / 60);
		seconds = seconds - hours * 3600 - minutes * 60;
		if (seconds < 10 && seconds >= 0) {
			seconds = '0' + seconds;
		}
	}
	var time = seconds;
	if (minutes > 0) {
		time = minutes + ':' + seconds;
	}
	if (hours > 0) {
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		time = hours + ':' + minutes + ':' + seconds;
	}
	return time;
}
