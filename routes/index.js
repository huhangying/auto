var express = require('express');
var router = express.Router();

var News = require('../db/controller/news');

/* GET home page. */
router.get('/', function(req, res, next) {
  News.getAllLoaded().then(
      function(list) {
          res.render('main', { title: 'Express', list: list });
      }
  );

});

/* Category page. */
router.get('/cat/:id', function(req, res, next) {
    if (req.params && req.params.id) {
        News.getListByCat(req.params.id).then(
            function(list) {
                res.render('cat', { title: 'Express', list: list });
            }
        );
    }


});

// Page details
router.get('/page/:id', function(req, res, next) {
    if (req.params && req.params.id) {
        News.get(req.params.id).then(
            function (page) {
              var contentList = News.buildContent(page._doc.content);
                //res.header("Cache-Control", "max-age=0");
                // res.header("Cache-Control", "no-cache, no-store, must-revalidate");
               //  res.header("Pragma", "no-cache");
               // res.header("Expires", 0);
               //  res.header("Host", "www.moremorewin.net")
               //  res.header("Referer", "http://www.popyard.com/cgi-mod/newspage.cgi?num=4499170&r=0&v=0&k=0")
               //  res.header('Last-Modified', (new Date()).toUTCString());
               //  res.header('Cache-Control', 'public, must-revalidate, max-age=0');
               //  res.header('ETag', 'de0b1a-3e422-55e671d70b939');
               //  //  res.header("Host", "www.moremorewin.net")
               //  res.header("Referer", "http://www.popyard.com/cgi-mod/newspage.cgi?num=4499170&r=0&v=0&k=0");
                res.render('page', {title: page.title, page: page, contentList: contentList});
            }
        );
    }

});

module.exports = router;
