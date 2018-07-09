global.Promise = require('bluebird');
global.mongoose = require('mongoose');
global.mongoose.Promise = global.Promise;
global.Promise.promisifyAll(global.mongoose);
var CronJob = require('cron').CronJob;

const popyardList = require('./popardList');
const popyard = require('./popard.js');

async function prepare() {
    const db = global.mongoose.connect('mongodb://127.0.0.1:27017/test', { useMongoClient: true });
    //await db.dropDatabase();
}
prepare().catch(error => console.error(error.stack));


setTimeout( () => {
    popyardList.fetchList().then(
        () => {
            popyard.crawlUrlListFromDb();
        }
    );
}, 600);



var job = new CronJob({
    cronTime: '0 24 05 * * *', //
    onTick: function() {
        /*
         * Runs every two hours
         */
        //console.log(new Date());
        setTimeout( () => {
            popyardList.fetchList().then(
                () => {
                    popyard.crawlUrlListFromDb();
                }
            );
        }, 600);
    },
    start: false
});
job.start();