global.Promise = require('bluebird');
global.mongoose = require('mongoose');
global.mongoose.Promise = global.Promise;
global.Promise.promisifyAll(global.mongoose);
const CronJob = require('cron').CronJob;

const popyardList = require('./popardList');
const popyard = require('./popard.js');

const prepare = () => {
    try {
        const db = global.mongoose.connect('mongodb://127.0.0.1:27017/test', { useMongoClient: true });
    }
    catch (e) {
      console.error(e.stack);
    }
    //await db.dropDatabase();
}

const doCrawler = async() => {
  await popyardList.fetchList();
  await popyard.crawlUrlListFromDb();
};


var job = new CronJob({
    cronTime: '0 24 */2 * * *', // run every two hours
    onTick: function() {
      /*
       * Runs every two hours
       */
      //console.log(new Date());
      doCrawler();
    },
    start: false
});

try {
  prepare();
  // job.start();
  console.log('====> Start at: ', new Date());
  doCrawler();
}
catch(error) {
  error => console.error(error.stack)
}

