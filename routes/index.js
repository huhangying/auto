var express = require('express');
var router = express.Router();

var News = require('../db/controller/news');
var config = require('../util/config');

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
        let cat = parseInt(req.params.id)
        News.getListByCat(req.params.id).then(
            function(list) {
                res.render('cat', { title: config.cats[cat].title, list: list });
            }
        );
    }


});

// Page details
router.get('/page/:id', function(req, res, next) {
    if (req.params && req.params.id) {
        News.get(req.params.id).then(
            async function (page) {
              var contentList = News.buildContent(page._doc.content);
              if (page.siblingNum > 0) {
                  await News.getSiblings(page.siblingId).then((siblings) => {
                      page.siblings = siblings;
                  });
              }

              res.render('page', {catTitle: config.cats[page.cat].title, title: page.title, page: page, contentList: contentList});
            }
        );
    }

});

module.exports = router;
