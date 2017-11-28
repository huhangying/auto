global.Promise = require('bluebird');
global.mongoose = require('mongoose');
global.mongoose.connect('mongodb://127.0.0.1:27017/test', { useMongoClient: true });
global.mongoose.Promise = global.Promise;
global.Promise.promisifyAll(global.mongoose);
global.Util = require('./util/util');
//var CronJob = require('cron').CronJob;

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