// ==UserScript==
// @name			slPBSImportLink
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icon.png
// @version			2018.08.16
// @include			https://pitneybowes.force.com/*
// ==/UserScript==

var link = selectNodes(document, "//a[contains(@title,'Printable			View')]")[0];
if (link){
	link.innerHTML = 'Import Lead';
	link.style.fontSize = '14px';
}

var rejected = selectNodes(document, "//th[contains(@class,'dataCell')]");			for (i=0; i<rejected.length; i++) {
	var th=rejected[i];
	if (th.innerHTML.match(/rejected|turnback/gi)) {
		th.parentNode.style.display = 'none';
	}
}

function selectNodes(context,xpath){
   var nodes = document.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   var result = new Array( nodes.snapshotLength );
   for (var x=0; x<result.length; x++)   {
	  result[x] = nodes.snapshotItem(x);
   }
   return result;
}

