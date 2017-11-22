global.Promise = require('bluebird');
global.Promise.promisifyAll(require("mongodb"));
global.mongoose = require('mongoose');
global.mongoose.Promise = global.Promise;
global.mongoose.connect('mongodb://localhost:27017/test', { useMongoClient: true });
global.Util = require('./util/util');
var CronJob = require('cron').CronJob;

var popyardList = require('./popardList');
var popyard = require('./popard.js');


popyardList.fetchList().then(
    function() {
        popyard.crawlUrlListFromDb();
    }
);


// var job = new CronJob({
//     cronTime: '* 22 * * * *',
//     onTick: function() {
//         /*
//          * Runs every weekday (Monday through Friday)
//          * at 11:30:00 AM. It does not run on Saturday
//          * or Sunday.
//          */
//         console.log(new Date());
//     },
//     start: false
// });
// job.start();