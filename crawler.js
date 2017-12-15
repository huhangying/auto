global.Promise = require('bluebird');
global.mongoose = require('mongoose');
global.mongoose.Promise = global.Promise;
global.Promise.promisifyAll(global.mongoose);
//var CronJob = require('cron').CronJob;

const popyardList = require('./popardList');
const popyard = require('./popard.js');

async function prepare() {
    const db = global.mongoose.connect('mongodb://127.0.0.1:27017/test', { useMongoClient: true });
    await db.dropDatabase();
}
prepare().catch(error => console.error(error.stack));


popyardList.fetchList().then(
    () => {
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