// ==UserScript==
// @name			slCookieClicker
// @version			2017.01.01
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icons/sean.png
// @description
// @include			http://orteil.dashnet.org/cookieclicker/*
// @grant			none
// @run-at			document-end
// ==/UserScript==

// var ac = document.createElement('script');
// ac.src = "http://seanloos.com/cc/cc.js";
// document.head.appendChild(ac);

var n = document.createElement('div');
n.innerHTML = '<input type="button" id="ac" value="AutoClick"> <input type="button" id="gcc" value="GoldenCookie"> <input type="button" id="ab" value="AutoBuy"> <input type="button" id="au" value="AutoUpgrade">';
n.style.cssFloat = 'left';
document.getElementById('links').parentNode.appendChild(n);


var ac; 
var gcc; 
var abI = false;
var acPs=0;
var interval = 50;
var autoBuy = false;
//var doNotBuy = [11,64,69,73,74,84,85,181,182,183,184,185,209,333,331,361];
var doNotBuy = [69,74,84,85,181,182,183,184,185,209,333,331,361];


if(autoBuy){
	setTimeout(OptimalItem,5000);
	gccOn();
	abOn();
	acOn();
}

document.addEventListener('keydown', function(e) {
	var key = String.fromCharCode(e.keyCode);
    if(key == 'A') {
		acToggle();
		gccToggle();
        autoBuyToggle();
		autoUpgradeToggle();
    }
    if(key == 'B') {
        autoBuyToggle();
    }
    if(key == 'C') {
		acToggle();
    }
    if(key == 'G') {
		gccToggle();
    }
    if(key == 'U') {
		autoUpgradeToggle();
    }
});

var ab = setInterval(function(){
	if(autoBuy){
		autoBuy = false;
		setTimeout(function(){
			autoBuy = true;
			OptimalItem();
		},3000);
	}
},90000);

// autoBuy On
document.getElementById('ab').addEventListener('click', autoBuyToggle);
function autoBuyToggle(){
    if(autoBuy){
		autoBuy = false;
		document.getElementById('ab').style.backgroundColor='red';
	}else{
		autoBuy = true;
		OptimalItem();
		document.getElementById('ab').style.backgroundColor='green';
	}
}

// autoClick On
document.getElementById('ac').addEventListener('click', acToggle);
function acToggle(){ 
	if(ac>0){
		clearInterval(ac); 
		ac=0;
		acPs = 0;
		document.getElementById('ac').style.backgroundColor='red';
	}else{
		var ms = 250;
		var cl = 100000; //window.prompt('How Many CPS?', 100000);
		cl = cl  / (1000/ms);
		acPs = cl*(1000/ms);
		ac = autoClicker(cl, ms);
		document.getElementById('ac').style.backgroundColor='green';
	}
}; 

// gcc On
document.getElementById('gcc').addEventListener('click', gccToggle);
function gccToggle(){ 
	if(gcc>0){
		clearInterval(gcc); 
		gcc=0;
		document.getElementById('gcc').style.backgroundColor='red';
	}else{
		gcc = setInterval(function() { if (Game.shimmers[0]) { Game.shimmers[0].wrath=0; Game.shimmers[0].l.click(); } }, 1500);
		document.getElementById('gcc').style.backgroundColor='green';
	}		
}

// autoUpgrade On
document.getElementById('au').addEventListener('click', autoUpgradeToggle);
function autoUpgradeToggle(){ 
	if(abI){
		abI = false; 
		document.getElementById('au').style.backgroundColor='red';
	}else{
		abI = true;
		selected=0;
		document.getElementById('au').style.backgroundColor='green';
	}
}


function autoClicker(clicksAtOnce, repeatInterval) { 
	var cheated = false; 
	var intoTheAbyss = function() { 
		if(!cheated) { 
			cheated = true; 
			for(var i = 0; i < clicksAtOnce; i++) { 
				Game.ClickCookie(); 
				Game.lastClick = 0;
			} 
			cheated = false; 
		} 
	} 
	return setInterval(intoTheAbyss, repeatInterval); 
};


var name;
var price;
var cpsItem;
var selected=0;
var currentCps=Game.cookiesPs;
var selectedItem;
var cnt = 0;
 
function OptimalItem() {
	var cpc = Number.MAX_VALUE;
	var upgradeName='';
	var sel;
	var st = Game.UpgradesInStore.length-1;
	st = st > 10 ? 10 : st;
	//if(abI && (selected==0 || cnt % 150 == 0)){
	if(abI){
		cnt=0;
		for(i = st; i >= 0; i--) {
			var cps1 = 0;
			var me = Game.UpgradesInStore[i];
			var x = me.id;
			if (!doNotBuy.some(arrVal => x == arrVal)) {
					sel = me;
					selectedItem=sel;
					upgradeName = me.name;
					price = Math.round(me.basePrice);
					selected=1;
					if(selectedItem){
						if(autoBuy && Game.cookies >= price && selected==1){selectedItem.buy();selected=0;}
					}
					sel = null;
			}
		}
	}
 
	for(i = Game.ObjectsById.length-1; i >= 0; i--){
		var cps1=0;
		var me = Game.ObjectsById[i];
		me.amount++;
		Game.CalculateGains();
		for(j = Game.ObjectsById.length-1; j >= 0; j--){ cps1 += Game.ObjectsById[j].cps(Game.ObjectsById[j])*Game.ObjectsById[j].amount;}
		var cps2 = cps1 * Game.globalCpsMult;
		me.amount--;
		Game.CalculateGains();
		var myCps = cps2 - currentCps;
		var cpsBuilding = me.price *(Game.cookiesPs + myCps) / myCps;
		if (cpsBuilding < cpc && myCps >= 0.1)
		{	
			cpc = cpsBuilding;
			sel = me;
			cpsItem = myCps;
			upgradeName = me.name;
			price = Math.round(me.price);
		}
	}
	currentCps = Game.cookiesPs;
	selected=1;
	selectedItem=sel;
	if(selectedItem){
		if(autoBuy && Game.cookies >= price && selected==1){selectedItem.buy();selected=0;}
	}
	if(cnt % (1000/interval/2) == 0){Display(upgradeName);}
	cnt++;
	if(autoBuy){setTimeout(OptimalItem,interval);}
}

function Display(upgradeName) {
	var mCPS = Game.computedMouseCps*acPs;
	var tCPS = Game.cookiesPs + mCPS;
	var time = (price - Game.cookies) / tCPS;
	var txt = "" + upgradeName + "<br>" + Beautify(price) + "<br>" + getHHMMSS(time) + "<br>" + Beautify(acPs) + " : " + Beautify(mCPS) + " /s";
	if(Game.version >= 1.05){
		Game.tickerL.innerHTML = txt;
	} else {
		Game.Ticker = txt;
 	}
	Game.TickerAge = interval;
}
 
function getHHMMSS(seconds){
	seconds = parseInt(seconds,10);
	seconds = seconds > 0 ? seconds : 0;
	var hours=0;
	var minutes=0;
	if(seconds>60){
		hours   = Math.floor(seconds / 3600);
		minutes = Math.floor((seconds - (hours * 3600)) / 60);
		var seconds = seconds - (hours * 3600) - (minutes * 60);
		if (seconds < 10 && seconds >= 0) {seconds = "0"+seconds;}
	}
	var time = seconds;
	if(minutes > 0){
		time = minutes+':'+seconds;
	}
	if(hours > 0){
		if (minutes < 10) {minutes = "0"+minutes;}
		time = hours+':'+minutes+':'+seconds;
	}
    return time;
}

