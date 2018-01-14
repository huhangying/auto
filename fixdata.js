
global.Promise = require('bluebird');
global.mongoose = require('mongoose');
global.mongoose.Promise = global.Promise;
global.Promise.promisifyAll(global.mongoose);

var cheerio = require('cheerio');
var url = require('url');

var News = require('./db/controller/news.js');
var myUtil = require('./util/util');
var imgDownloader = require('./image-downloader');
var config = require('./util/config');

var $;
var pages = [];
var index = 0;


async function prepare() {
    const db = global.mongoose.connect('mongodb://127.0.0.1:27017/test', { useMongoClient: true });
    //await db.dropDatabase();
}
prepare().catch(error => console.error(error.stack));

var processDetails = function (pageId, myUrl) {
    var p;
    var rows = [];
    if (!myUrl) {
        myUrl = `./newspage.cgi?num=${pageId}&r=0&v=0`; //hardcode !!!
    }

    myUtil.fetch(myUrl)
        .then( (body) => {
            $ = cheerio.load(body);
            // detailed page
            rows = $('p table tbody tr td.line_space table tbody tr td.line_space p,center');


            let content = '';
            rows.each(function (index, row) {
                if (row.name === 'p' && index > 0) { // text. first p is for ad. remove it.
                    p = $(this).text();
                }
                else if (row.name === 'center') { // image
                    p = $(this).find('table a img').attr('src');
                    if (p && config.downloadImage) {
                        //imgDownloader.downloadImage(p); // run it in the back // no need to download image when fixing data
                        p = p.replace(/^.*[\\\/]/, ''); // save fileName only to db
                    }
                }
                if (p) {
                    content += p + '|';
                }
            });

            content = content.slice(0, -1); // remove last character

            index++; // 指向下一个处理的页面

            return News.model.update({'id': pageId}, {content: content});
        })

        .then(function (result) {

            if (index < pages.length) {
                setTimeout(function () {
                    processDetails(pages[index].id, pages[index].href);
                }, myUtil.pause);
            }
            else {
                console.log('******************* No more pages to process, exiting. *****************');
            }

        })
        .catch(function (err) {
            throw err;

        });
};



//
// execute
//
setTimeout(function () {
    News.GetFixDataList()
        .then(function (results) {

            // reset environment
            pages = [];
            index = 0;

            results.map(function (result) {
                //if (result.href) {
                    pages.push(result);
                //}
            });

            console.info(`>>> ${pages.length} page content are going to fix.`);
            // start processing!
            if (pages.length > 0) {
                processDetails(pages[index].id, pages[index].href);
            }

        });
}, myUtil.pause);


