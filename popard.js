var cheerio = require('cheerio');
var url = require('url');

var News = require('./db/controller/news.js');
var myUtil = require('./util/util');
var imgDownloader = require('./image-downloader');
var config = require('./util/config');

var $;
var pages = [];
var siblingUrls = [];
var index = 0;
var siblingIndex = 0;
var siblingId;

var processDetails = function (myUrl, isSibling, firstSibling) {
    var myId, p;
    var rows = [];
    var siblings = [];
    var _href;
    if (!myUrl) {return;}

    myUtil.fetch(myUrl)
        .then( (body) => {
            $ = cheerio.load(body);
            // detailed page
            myId = url.parse(myUrl, true).query.num;
            rows = $('p table tbody tr td.line_space table tbody tr td.line_space p,center');
            if (!isSibling) {
                siblingUrls = [];
                siblingIndex = 0;
                siblingId = myId;

                siblings = $('table table tbody tr td p font a');
                if (siblings.length > 0) {
                    siblings.each(function (i, sib) {
                        _href = $(sib).attr('href');
                        if (_href && _href.indexOf('num=') > 0) {
                            siblingUrls.push(_href);
                        }
                    });
                    console.warn('sibling urls: ' + JSON.stringify(siblingUrls));
                }
            }

            let item, content = '';
            rows.each(function (index, row) {
                if (row.name === 'p' && index > 0) { // text. first p is for ad. remove it.
                    p = $(this).text();
                }
                else if (row.name === 'center') { // image
                    p = $(this).find('table a img').attr('src');
                    if (p && config.downloadImage) {
                        imgDownloader.downloadImage(p); // run it in the back
                        p = p.replace(/^.*[\\\/]/, ''); // save fileName only to db
                    }
                }
                if (p) {
                    content += p + '|';
                }
            });

            content = content.slice(0, -1); // remove last character
            item = {
                id: myId,
                content: content,
                loaded: true
            };
            if (isSibling) {
                siblingIndex++;  // 指向下一个 sibling 页面
                item.title = firstSibling.title;
                item.cat = firstSibling.cat;
                item.from = firstSibling.from;
                item.date = firstSibling.date;
                item.siblingNum = siblingIndex + 1; // UI 上显示的 page number
                item.siblingId = siblingId;
            }
            else {
                index++; // 指向下一个处理的页面
                item.hasSiblings = (siblingUrls.length > 0);
                if (item.hasSiblings) {
                    item.siblingId = item.id;
                    item.siblingNum = 1;
                }
            }
            console.log(item);
            return News.model.findOneAndUpdate({'id': item.id}, item, {upsert: true});
        })

        .then(function (result) {
            // sibling pages
            // 如果本身不是sibling页面，而且有siblings; 或者本身是sibling页面，但是没有到最后一个,接着分析下一个sibling页面
            if ((!isSibling && siblingUrls.length > 0) || (isSibling && siblingIndex < siblingUrls.length)) {
                setTimeout(function () {
                    processDetails(siblingUrls[siblingIndex], true, firstSibling);
                }, myUtil.pause);
            }
            // 如果本身不是sibling页面，而且没有siblings; 或者，本身是sibling而且是最后一页；接着分析下个页面
            else if ((!isSibling && siblingUrls.length === 0) || (isSibling && siblingIndex === siblingUrls.length)) {
                if (index < pages.length - 1) {
                    setTimeout(function () {
                        processDetails(pages[index].href, false, pages[index]);
                    }, myUtil.pause);
                }
                else {
                    console.log('******************* No more pages to process, exiting. *****************');
                }
            }
            else {
                console.log(`index: ${index}; isSibling: ${isSibling}; siblingIndex: ${siblingIndex}; siblingUrls.length: ${siblingUrls.length} `);
            }
            //db.close();
        })
        .catch(function (err) {
            throw err;

        });
};
var crawlUrlListFromDb = function() {
    //db = global.mongoose.connection;
    News.GetTodoList()
        .then(function(results) {

            // reset environment
            pages = [];
            index = 0;

            results.map(function(result) {
                if (result.href) {
                    pages.push(result);
                }
            });

            // start processing!
            if (pages.length > 0) {
                console.info(`>>> ${pages.length} pages are going to fulfill.`)
                processDetails(pages[index].href, false, pages[index]);
            }

        });
};

module.exports = {
    crawlUrlListFromDb: crawlUrlListFromDb
};
