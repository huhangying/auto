var express = require('express');
var router = express.Router();

var News = require('../db/controller/news');

/* GET users listing. */
router.route('/:id')
    .get(News.GetById);

router.route('/all/:number')
    .get(News.GetAll);

router.route('/cat/:cat/:number')
    .get(News.GetAllByCat);

router.route('/sibs/:id')
    .get(News.GetSiblings);

module.exports = router;
