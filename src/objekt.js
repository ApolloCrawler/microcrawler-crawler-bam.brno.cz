// Copyright, 2013-2016, by Tomas Korcak. <korczis@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var querystring = require('querystring');
var url = require('url');

var exports = module.exports = function ($, item) {
    var tmp = $('div > p.noIndent.noBorder');

    var stezka = tmp.first().text().replace(/\s\s+/g, ' ').trim();

    var adresa = $('div > p.noIndent.noBorder').slice(1).first().text().replace(/\s\s+/g, ' ').trim();
    if (adresa === '') {
        adresa = null;
    }

    var typ = $('div.typeParent > h2').first().text().replace(/\s\s+/g, ' ').trim();

    var gps = null;
    $('div > p.noIndent.noBorder').each(function () {
        var doc = $(this);
        var text = doc.text();
        if (text.startsWith('GPS')) {
            gps = text.replace('GPS: ', '');
            var parts = gps.split(/[°'\", ]+/);

            var lat = parseInt(parts[0], 10) + (parseInt(parts[1], 10) / 60) + (parseInt(parts[2], 10) / 3600);
            if (parts[3] == 'S') {
                lat *= -1;
            }

            var lng = parseInt(parts[4], 10) + (parseInt(parts[5], 10) / 60) + (parseInt(parts[6], 10) / 3600);
            if (parts[7] === 'W') {
                lng *= -1;
            }

            gps = [
                lng,
                lat
            ];
        }
    });

    var architekti = [];
    $('div.block.grey:not(.typeParent) > h2 > a').each(function () {
        var doc = $(this);
        architekti.push(doc.text());
    });

    var popis = $('div.rightPart > div.block > p').text().replace(/\s\s+/g, ' ').trim();

    return [{
        type: 'data',
        data: {
            url: item.url,
            jmeno: $('h1.smallIndent').first().text().replace(/\s\s+/g, ' ').trim(),
            address: {
                city: 'brno',
                street: adresa,
                location: gps
            },
            stezka: stezka,
            typ: typ,
            architekti: architekti,
            popis: popis
        }
    }];
};
