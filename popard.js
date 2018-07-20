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

var processDetails = async (myUrl, isSibling, firstSibling) => {
  if (!myUrl) {return;}

  let body = await myUtil.fetch(myUrl);

  await parseContentPage(myUrl, body, isSibling, firstSibling);


  // sibling pages
  // 如果本身不是sibling页面，而且有siblings; 或者本身是sibling页面，但是没有到最后一个,接着分析下一个sibling页面
  if ((!isSibling && siblingUrls.length > 0) || (isSibling && siblingIndex < siblingUrls.length)) {
    await processDetails(siblingUrls[siblingIndex], true, firstSibling);
  }
  // 如果本身不是sibling页面，而且没有siblings; 或者，本身是sibling而且是最后一页；接着分析下个页面
  else if ((!isSibling && siblingUrls.length === 0) || (isSibling && siblingIndex === siblingUrls.length)) {
    if (index < pages.length) {
      await processDetails(pages[index].href, false, pages[index]);
    }
    else {
      console.log('******************* No more pages to process, exiting. *****************');
    }
  }
  else {
    console.log(`index: ${index}; isSibling: ${isSibling}; siblingIndex: ${siblingIndex}; siblingUrls.length: ${siblingUrls.length} `);
  }

};

const parseContentPage = async (myUrl, body, isSibling, firstSibling) => {
  let myId, p;
  let siblings = [];
  let _href;

  $ = cheerio.load(body);
  // detailed page
  myId = url.parse(myUrl, true).query.num;
  let rows = $('p table tbody tr td.line_space table tbody tr td.line_space p,center');
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
      console.info('sibling urls: ' + JSON.stringify(siblingUrls));
    }
  }

  let item, content = '', imgs = '';
  rows.each(function (index, row) {
    if (row.name === 'p' && index > 0) { // text. first p is for ad. remove it.
      p = $(this).text();
    }
    else if (row.name === 'center') { // image
      p = $(this).find('table a img').attr('src');
      if (p) {
        if (config.downloadImage) {
          imgDownloader.downloadImage(p); // run it in the back
          //todo: make thumb version of the image
        }
        p = p.replace(/^.*[\\\/]/, ''); // save fileName only to db
        imgs += p + '|';
      }
    }
    if (p) {
      content += p + '|';
    }
  });

  content = content.slice(0, -1); // remove last character
  if (imgs) {
    imgs = imgs.slice(0, -1); // remove last character
  }
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
    // first page or only page
    item.imgs = imgs;
  }
  console.log(item);
  await News.model.findOneAndUpdate({'id': item.id}, item, {upsert: true});
};

const crawlUrlListFromDb = async () => {

  // reset environment
  pages = [];
  index = 0;
  //await myUtil.initProxy();

  var results =  await News.GetTodoList();

  results.map(result => {
    if (result.href) {
      pages.push(result);
    }
  });

  console.info(`>>> ${pages.length} pages are going to fulfill.`);
  // start processing!
  if (pages.length > 0) {
    await processDetails(pages[index].href, false, pages[index]);
  }

};

module.exports = {
    crawlUrlListFromDb: crawlUrlListFromDb
};
