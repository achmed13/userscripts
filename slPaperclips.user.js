// ==UserScript==
// @name			slPaperclips
// @version			2018.02.10.1247
// @namespace		seanloos.com
// @icon			http://seanloos.com/icon.png
// @homepageURL		http://seanloos.com/gm/
// @author			Sean Loos
// @description
// @match			http://www.decisionproblem.com/paperclips/index2.html
// @grant			none
// ==/UserScript==

document.title='UniversalPaperclips';

setInterval(blurAll,2000);
var bQuant = false;
var bTourn=false;
// --------------------------------------
// Keyboard Listener
// --------------------------------------
document.addEventListener('keydown',function(e){
	// check to see if we are in a text box
	// if (e.shiftKey || e.ctrlKey || e.altKey){
	// 	return;
	// }
	var key = String.fromCharCode(e.keyCode);

	blurAll();

	var clicks = 10;
	if(e.shiftKey){clicks=100;}
	var i = 0;
	var val = 0;
	// projects
	if(key == 'X'){
		e.preventDefault();
		buyItem();
		return;
	}
	// Run Tournament
	if(key == 'R'){
		e.preventDefault();
		bTourn = !bTourn;
		runTournament();
		return;
	}
	// Compute
	if(key == 'C'){
		e.preventDefault();
		bQuant = !bQuant;
		clickQuantum();
		return;
	}
	// Launch Probe
	if(key == 'H'){
		e.preventDefault();
		var ele = document.getElementById('btnMakeProbe');
		for( i=0;i<50000;i++){
			ele.click();
		}
	}
	// lower
	if(key == 'S'){
		e.preventDefault();
		doClicks('btnLowerPrice',clicks);
		return;
	}
	// raise
	if(key == 'D'){
		e.preventDefault();
		doClicks('btnRaisePrice',clicks);
		return;
	}
	// marketing
	if(key == 'E'){
		e.preventDefault();
		doClicks('btnExpandMarketing',1);
		return;
	}
	// paperclips
	if(key == 'Q'){
		e.preventDefault();
		clipClick(100000);
		return;
	}
	// wire
	if(key == 'W'){
		e.preventDefault();
		doClicks('btnBuyWire',100);
		return;
	}
	// processors
	if(key == 'T'){
		e.preventDefault();
		doClicks('btnAddProc',clicks);
		return;
	}
	// memory
	if(key == 'G'){
		e.preventDefault();
		doClicks('btnAddMem',clicks);
		return;
	}
	// harvester
	if(key == 'F'){
		e.preventDefault();
		doClicks('btnHarvesterx1000',clicks);
		return;
	}
	// wire
	if(key == 'V'){
		e.preventDefault();
		doClicks('btnWireDronex1000',clicks);
		return;
	}
	// mega clipper
	if(key == 'Z'){
		e.preventDefault();
		doClicks('btnMakeMegaClipper',10);
		return;
	}
	// autoclipper
	if(key == 'A'){
		e.preventDefault();
		doClicks('btnMakeClipper',10);
		return;
	}
	// Increase Probe Trust
	if(key == 'N'){
		e.preventDefault();
		doClicks('btnIncreaseProbeTrust',10);
		return;
	}
	// Increase Max Trust
	if(key == 'M'){
		e.preventDefault();
		doClicks('btnIncreaseMaxTrust',1);
		return;
	}

	if(key == 'B'){
		e.preventDefault();
		goCrazy();
		return;
	}

	// All
	if(key == 'I'){
		e.preventDefault();
		var ms = 2000;
		getProbes('Fac',ms);
		setTimeout(getProbes,ms*1.05,'Harv',ms*5);
		setTimeout(getProbes,ms*6.05,'Wire',ms*5.1);
	}
	// Replication -
	if(key == 'O'){
		e.preventDefault();
		doClicks('btnLowerProbeRep',1);
		return;
	}
	// Replication +
	if(key == 'P'){
		e.preventDefault();
		doClicks('btnRaiseProbeRep',1);
		return;
	}
	// Slider Zero
	if(key == '1'){
		e.preventDefault();
		document.getElementById('slider').value=0;
		return;
	}
	// Slider Full
	if(key == '4'){
		e.preventDefault();
		document.getElementById('slider').value=200;
		return;
	}

	val = parseInt(document.getElementById('slider').value);
	// Slider Down
	// if(e.keyCode == 219){
	if(key == '2'){
		e.preventDefault();
		val -= 1;
		document.getElementById('slider').value=val;
		return;
	}
	// Slider Up
	// if(e.keyCode == 221){
	if(key == '3'){
		e.preventDefault();
		val += 1;
		document.getElementById('slider').value=val;
		return;
	}

},false);

var blacklist = [
	'projectButton35',  // Release the HypnoDrones
	'projectButton46',  // Space Exploration
	// 'projectButton102', // Self-correcting Supply Chain
	'projectButton134', // Glory
	// 'projectButton147', // Accept
	'projectButton148', // Reject
	'projectButton200', // The Universe Next Door
	'projectButton201', // The Universe Within
	'projectButton217', // Quantum Temporal Reversion
	'projectButton218', // Limerick (cont.)
	'projectButton219' // Xavier Re-initialization
];

function buyItem(){
	var list = document.querySelectorAll('.projectButton');
	for (var pl of list){
		if(!document.getElementById(pl.id).disabled && !blacklist.includes(pl.id)){
			pl.click();
			return;
		}
	}
}

function doClicks(sID,nTimes){
	var ele = document.getElementById(sID);
	if(ele.disabled | nTimes==0){
		return;
	}
	ele.click();
	nTimes--;
	setTimeout(doClicks,10,sID,nTimes);
}

function getProbes(sProbe,nTime){
	document.getElementById('btnLowerProbeRep').click();
	setTimeout(doClicks,10,'btnRaiseProbe'+sProbe,1);
	setTimeout(doClicks,nTime,'btnLowerProbe'+sProbe,1);
	setTimeout(doClicks,nTime+100,'btnRaiseProbeRep',1);
}

function goCrazy(){
	var ms = 1500;
	doClicks('btnIncreaseMaxTrust',1);
	setTimeout(doClicks,20,'btnIncreaseProbeTrust',10);
	setTimeout(doClicks,40,'btnRaiseProbeRep',10);
	setTimeout(getProbes,100,'Fac',ms);
	setTimeout(getProbes,ms*1.05,'Harv',ms*5);
	setTimeout(getProbes,ms*6.05,'Wire',ms*5.2);
}

function clickQuantum(){
	if(!bQuant){
		document.getElementById('btnQcompute').style.borderColor='inherit';
		return;
	} else {
		document.getElementById('btnQcompute').style.borderColor='#ff0000';
	}
	var quant = 0.0;
	var qChips = document.querySelectorAll('.qChip');
	for (var q of qChips){
		quant += parseFloat(q.style.opacity);
	}
	if(quant > 0){
		for(i=0;i<100;i++){
			document.getElementById('btnQcompute').click();
		}
		setTimeout(clickQuantum,100);
	} else {
		setTimeout(clickQuantum,1000);
	}
}

function runTournament(){
	if(bTourn){
		document.getElementById('stratPicker').selectedIndex = document.getElementById('stratPicker').length -1;
		document.getElementById('btnNewTournament').click();
		document.getElementById('btnRunTournament').click();
		document.getElementById('btnRunTournament').style.borderColor='#ff0000';
		setTimeout(runTournament,2000);
	} else {
		document.getElementById('btnRunTournament').style.borderColor='inherit';
	}
	return;
}

function blurAll(){
	document.activeElement.blur();
}