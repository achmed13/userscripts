// ==UserScript==
// @name          slScrapeKellogg
// @version       2025.1.6-1655
// @description   scrape
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @downloadURL   http://seanloos.com/userscripts/slScrapeKellogg
// @updateURL     http://seanloos.com/userscripts/slScrapeKellogg
// @author        Sean Loos
// @icon          http://seanloos.com/icon.png
// @match         https://www.umkelloggeye.org/find-doctors-physicians*
// @grant         GM_setClipboard
// ==/UserScript==

(function () {
	'use strict';
	console.log('start');

	setTimeout(scrape, 2000);

	function scrape(){
		let results = '';
		let selector = document.querySelectorAll('.row.border');

		selector.forEach((row) => {
			let name = row.querySelector('.card-body h3').textContent;
			let title = row.querySelector('.d-md-block').textContent;
			let office = row.querySelector('.css-gem1x').textContent;
			let address = row.querySelector('.css-1fh4660').innerText.replace(/\n/,', ');
			let phone = row.querySelector('.p-0').textContent;
			//let specialties = row.querySelector('#specialties').textContent;
			let img = row.querySelector('.card-title img').src;

			let record =
				'"' +
				name.trim() +
				'"\t"' +
				title.trim() +
				'"\t"' +
				office.trim() +
				'"\t"' +
				address.replace(/\n/, '\t').trim() +
				'"\t"' +
				phone.trim() +
				'"\t"' +
				img.trim() +
				'"';
			results += record + '\n';
		});
		GM_setClipboard(results);
		console.log('copied');
	}
})();
