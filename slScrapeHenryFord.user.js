// ==UserScript==
// @name          slScrapeHenryFord
// @version       2025.1.6-1506
// @description   scrape doctors
// @namespace     seanloos.com
// @homepageURL   http://seanloos.com/userscripts/
// @updateURL     http://seanloos.com/userscripts/slScrapeHenryFord
// @downloadURL   http://seanloos.com/userscripts/slScrapeHenryFord
// @author        Sean Loos
// @icon          http://seanloos.com/icon.png
// @match         https://www.henryford.com/physician-directory/search-results
// @run-at        document-idle
// @grant         GM_setClipboard
// ==/UserScript==

(function () {
	'use strict';
	console.log('start');

	setTimeout(scrape, 2000);

	function scrape(){
		let results = '';
		let selector = document.querySelectorAll('.search-result-list .physician-profile-wrapper');
		console.log(selector);
		selector.forEach((row) => {
			let name = row.querySelector('.physician-info a').textContent;
			let office = row.querySelector('.office-header').textContent;
			let address = row.querySelector('.office-adress-wrapper').textContent;
			let phone = row.querySelector('.phone a').textContent;
			let mobile = row.querySelector('.phone-mobile a').textContent;
			let specialties = row.querySelector('#specialties').textContent;
			let services = row.querySelector('#services') ? row.querySelector('#services').textContent : '';
			let img = row.querySelector('img').src;
			let hfhs = row.querySelector('.medical-group-wrapper img');

			let record =
				name.trim() +
				'\t' +
				office.trim() +
				'\t"' +
				address.replace(/\n/, '\t').trim() +
				'"\t"' +
				phone.trim() +
				'"\t"' +
				mobile.trim() +
				'"\t"' +
				specialties.trim() +
				'"\t"' +
				services.trim() +
				'"\t"' +
				img.trim() +
				'"\t' +
				(hfhs == null ? '' : 'HFMG');
			results += record + '\n';
		});
		GM_setClipboard(results);
		console.log('copied');
	}
})();
