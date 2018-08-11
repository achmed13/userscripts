// ==UserScript==
// @name			slTelLinks
// @version			2017.01.01
// @namespace		seanloos.com
// @homepageURL		http://seanloos.com/gm/
// @author			Sean Loos
// @icon			http://seanloos.com/icons/sean.png
// @description
// @include			*
// @exclude			https://secure.usaepay.com/console/print_receipt*
// @run-at			document-end
// ==/UserScript==

// Matches these patterns:
//  800-555-1212
//  (800) 555-1212
//  (800)555-1212
//  8005551212
//    Weak since it does any 10+ digit number
//  800.555.1212

(function () {
	// mynumber should start with a 1
	//const phoneRegex = /\b(1Z ?\w\w\w ?\w\w\w ?\w\w ?\w\w\w\w ?\w\w\w ?\w|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/ig;
	const phoneRegex = /(\d{3}-\d{3}-\d{4}|\(\d{3}\) ?\d{3}-\d{4}|1?\d{10}|\d{3}\.\d{3}\.\d{4})/g;
	function phoneUrl(t) {
		return "tel://" + String(t).replace(/[\(\)\- \.]/g, "");
		//return "https://service.ringcentral.com/mobile/api/proxy.html?cmd=ringme.startRingMe&mailboxId=60464339006&pin=2&controlNumber=0&number=" + String(t).replace(/[\(\)\- \.]/g, "") + "&agentPhone=&referrer=&country=1&captchaCode=";
	}

    // tags we will scan looking for un-hyperlinked urls
    var allowedParents = [
        "abbr", "acronym", "address", "applet", "b", "bdo", "big", "blockquote", "body", 
        "caption", "center", "cite", "code", "dd", "del", "div", "dfn", "dt", "em", 
        "fieldset", "font", "form", "h1", "h2", "h3", "h4", "h5", "h6", "i", "iframe",
        "ins", "kdb", "li", "object", "nobr", "pre", "p", "q", "samp", "small", "span", "strike", 
        "s", "strong", "sub", "sup", "td", "th", "tt", "u", "var"
        ];
    
    var xpath = "//text()[(parent::" + allowedParents.join(" or parent::") + ")" +
				//" and contains(translate(., 'HTTP', 'http'), 'http')" + 
				"]";

    var candidates = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    //var t0 = new Date().getTime();
    for (var cand = null, i = 0; (cand = candidates.snapshotItem(i)); i++) {
        if (phoneRegex.test(cand.nodeValue)) {
            var span = document.createElement("span");
            var source = cand.nodeValue;
            
            cand.parentNode.replaceChild(span, cand);

            phoneRegex.lastIndex = 0;
            for (var match = null, lastLastIndex = 0; (match = phoneRegex.exec(source)); ) {
                span.appendChild(document.createTextNode(source.substring(lastLastIndex, match.index)));
                
                var a = document.createElement("a");
                a.setAttribute("href", phoneUrl(match[0]));
                a.appendChild(document.createTextNode(match[0]));
                span.appendChild(a);

                lastLastIndex = phoneRegex.lastIndex;
            }

            span.appendChild(document.createTextNode(source.substring(lastLastIndex)));
            span.normalize();
        }
    }

})();