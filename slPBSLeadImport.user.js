// ==UserScript==
// @name			slPBSLeadImport
// @namespace		seanloos.com
// @homepageURL		https://github.com/achmed13/userscripts/
// @author			Sean Loos
// @icon			http://seanloos.com/icon.png
// @version			2018.08.16
// @include			https://pitneybowes.force.com/*/p?*
// ==/UserScript==

var out = '';
var td = $$('td');
var fields = [];
for (i=0; i<td.length; i++)
{
	if (td[i].className.match(/labelCol/i))
	{
		row = td[i].innerHTML!='&nbsp;' ? td[i].innerHTML + '|' : '';
	}
	if (td[i].className.match(/data.?Col/i))
	{
		row = row.length>0 ? td[i].innerHTML : '';
		row = row.replace(/<br>/gi,'\n');
		row = row.replace(/&nbsp;/gi,'');
		row = row.replace(/<script.*?\/script>/gi,'');
		row = row.replace(/<.*?>/gi,'');

		fields.push(row);
		//out += row;
		row = '';
	}
}

var hist = '';
hist += 'Partner Portal URL: ' + document.location.href.replace(/(.*)\/p\?.*/i,'$1') + '\n\n';
hist += 'Lead Type: ' + fields[65] + '\n\n';
hist += 'Contact Role: ' + fields[8] + '\n\n';
hist += 'Vertical: ' + fields[18] + '\n\n';
hist += 'Comments: ' + fields[52] + '\n\n';
hist += 'Campaign Name: ' + fields[56] + '\n\n';
hist += 'Source: ' + fields[59] + '\n\n';
hist += 'Created By: ' + fields[68] + '\n\n';
hist += 'Accepted Date: ' + fields[69] + '\n\n';

hist += $('div.noStandardTab').innerHTML;
hist = hist.replace(/<\/div>/gi,'</div>\n');
hist = hist.replace(/<\/th>/gi,'</th>: ');
hist = hist.replace(/<br>/gi,'\n');
hist = hist.replace(/&nbsp;/gi,'');
hist = hist.replace(/<script.*?\/script>/gi,'');
hist = hist.replace(/<.*?>/gi,'');
hist = hist.replace(/\n\n\n\n/gi,'\n');

out = '<META HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8">\n<style>.row{margin-bottom:5px;} .row label{float:left;width:80px;text-align:right;margin-right:10px;}</style>\n<h1>Import Lead into SalesForce</h1><p /><a href="https://mappingsolutions.my.salesforce.com/search/SearchResults?searchType=1&sen=0&setLast=1&sbstr=' + encodeURI(fields[0]) + '&search=+Go!+" style="color:red;">CLICK HERE FIRST TO SEARCH</a> - if lead is not found, click back and then import.<p /><form action="https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST">\n\n<input type=hidden name="oid" value="00D400000008pOD">\n<input type=hidden name="retURL" value="https://mappingsolutions.my.salesforce.com/search/SearchResults?searchType=1&sen=00Q&setLast=1&sbstr=' + encodeURI(fields[0]) + '&search=+Go!+">\n\n<!--<input type="hidden" name="debug" value=1>-->\n\n<div class="row"><label for="first_name">First Name</label><input  id="first_name" maxlength="40" name="first_name" size="60" type="text" value="' + fields[0].replace(/(.*?) (.*)/i,'$1') + '" /></div>\n\n<div class="row"><label for="last_name">Last Name</label><input  id="last_name" maxlength="80" name="last_name" size="60" type="text" value="' + fields[0].replace(/(.*?) (.*)/i,'$2') + '" /></div>\n\n<div class="row"><label for="title">Title</label><input  id="title" maxlength="40" name="title" size="60" type="text" value="' + fields[6] + '" /></div>\n\n<div class="row"><label for="company">Company</label><input  id="company" maxlength="40" name="company" size="60" type="text" value="' + fields[12] + '" /></div>\n\n<div class="row"><label for="email">Email</label><input  id="email" maxlength="80" name="email" size="60" type="text" value="' + fields[21] + '" /></div>\n\n<div class="row"><label for="phone">Phone</label><input  id="phone" maxlength="40" name="phone" size="60" type="text" value="' + fields[13] + '" /></div>\n\n<div class="row"><label for="mobile">Mobile</label><input  id="mobile" maxlength="40" name="mobile" size="60" type="text" value="' + fields[17] + '" /></div>\n\n<div class="row"><label for="fax">Fax</label><input  id="fax" maxlength="40" name="fax" size="60" type="text" value="' + fields[19] + '" /></div>\n\n<div class="row"><label for="URL">Website</label><input id="URL" maxlength="80" name="URL" size="60" type="text" value="' + fields[53] + '" /></div>\n\n<div class="row"><label for="street">Address</label><textarea name="street" rows="3" cols="60">' + fields[28] + '</textarea></div>\n\n<div class="row"><label for="industry">Industry</label><input id="industry" name="industry" size="60" type="text" value="' + fields[16] + '" /></div>\n\n<div class="row"><label for="description">Description</label><textarea name="description" rows="15" cols="100">' + hist + '</textarea></div>\n\n<div class="row"><label for="lead_source">Lead Source</label><input id="lead_source" name="lead_source" size="60" type="text" value="MapInfo Referral" /></div>\n\n<input type="submit" name="submit" value="Import Lead">\n\n</form>';
//out = '';
//for (i = 0; i<fields.length ; i++)
//{
//	out += i + ': ' + fields[i] + '<br />';
//}
//out += hist + '<hr />';
//
document.body.innerHTML = out + '<hr />' + document.body.innerHTML;

function $ (selector, el) {
     if (!el) {el = document;}
     return el.querySelector(selector);
}
function $$ (selector, el) {
     if (!el) {el = document;}
     return el.querySelectorAll(selector);
}
