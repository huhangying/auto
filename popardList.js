
let cheerio = require('cheerio');
var url = require('url');

var News = require('./db/controller/news.js');

var urls = [
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=1&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=2&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=3&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=4&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=5&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=6&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=7&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=8&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=9&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=10&p=1&r=0',
    // 'http://www.popyard.com/cgi-mod/threads.cgi?cate=11&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=12&p=1&r=0'
];
var $;
var i = 0;

var processList = function (myUrl) {
    // var cat;
    // var rows = [];
    if (!myUrl) {return;}

    return Util.fetch(myUrl)

        .then((body) => {
            const items = getPageList(myUrl, body);

            return global.Promise.all(
                items.map(function (item) {
                    return News.model.findOneAndUpdate({'id': item.id}, item, {upsert: true});
                    //return db.collection('news').updateAsync({'id': item.id}, {$set: item}, {upsert: true});
                })
            )
        })

        .then(result => {

            console.log('Upserted', result.length, 'records');

            if (++i < urls.length) {
                setTimeout(function () {
                    processList(urls[i]);
                }, Util.pause);
            }
            else {
                console.log('*********** No more list to process, exiting. ****************');
            }
        })
        .catch(error => console.error(error.stack));
};

//
var getPageList = function(myUrl, body) {
    var devs = [], dev, myId, href, title, from, date;
    var titles = [], froms = [];


    $ = cheerio.load(body);
    const cat = url.parse(myUrl, true).query.cate;

    // page list
    //$('.results > .row').eq(0).remove(); // remove header row
    const rows = $('p table tbody tr td font li');

    rows.each(function () {
        href = $(this).find('a').attr('href');
        if (href) {
            myId = url.parse(href, true).query.num;
            titles = $(this).text().trim().split(/-(.+)/);
            title = titles[0].trim();
            if (titles.length > 1) {
                froms = titles[1].split('[');
                from = froms[0].trim();
                if (froms.length > 1) {
                    date = froms[1].replace(']', '');
                }
            }

            dev = {
                id: myId,
                title: title,
                cat: cat,
                from: from,
                date: date,
                href: href // use internally
            };
            console.log(dev);
            devs.push(dev);
        }

    });
    return devs;
};

async function fetchList() {
    // get started from the first url
    await processList(urls[0]);
}


module.exports = {
    fetchList: fetchList
}


