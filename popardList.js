let cheerio = require('cheerio');
var url = require('url');

var News = require('./db/controller/news.js');
var myUtil = require('./util/util');


var urls = [
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=1&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=2&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=3&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=4&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=5&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=6&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=7&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=8&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=9&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=10&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=11&p=1&r=0',
    'http://www.popyard.com/cgi-mod/threads.cgi?cate=12&p=1&r=0'
];
var $;

var processList = async(myUrl) => {
  if (!myUrl) {return;}

  let results = [];
  let body = await myUtil.fetch(myUrl);
  const items = await getPageList(myUrl, body);

  return await Promise.all(
    items.map(News.updateItem))
    .then((results) => {
      results = results.filter(result => {
        return result && result.id;
      });
      console.log('Upserted', results.length, 'records');
    });
};

//
var getPageList = function(myUrl, body) {
    let devs = [], dev, myId, href, title, from, date;
    let titles = [], froms = [];

    $ = cheerio.load(body);
    let cat = url.parse(myUrl, true).query.cate;

    // page list
    //$('.results > .row').eq(0).remove(); // remove header row
    let rows = $('p table tbody tr td font li');

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
            devs.push(dev);
        }

    });
    return devs;
};

async function fetchList() {
  //await myUtil.initProxy();

  // let promises = [];
  // urls.map((u) => {
  //   promises.push(processList(u))
  // });
  // return await Promise.all(promises);

  for (let i=0; i<urls.length; i++) {
    await processList(urls[i]);
  }

}


module.exports = {
    fetchList: fetchList
}


