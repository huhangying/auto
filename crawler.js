global.Promise = require('bluebird');
global.mongoose = require('mongoose');
global.mongoose.Promise = global.Promise;
global.Promise.promisifyAll(global.mongoose);
let db;
let isRunning = false;
const CronJob = require('cron').CronJob;

const popyardList = require('./popardList');
const popyard = require('./popard.js');

const connectDb = async() => {
   db = await global.mongoose.connect('mongodb://127.0.0.1:27017/test', { useMongoClient: true });
   //await db.dropDatabase();
}

const doCrawler = async() => {
  await connectDb()
    .then(async() => {
      isRunning = true;
      console.log('====> Start at: ', new Date());

      await popyardList.fetchList();
      console.log('*********** done processing lists, continue. ****************');
      await popyard.crawlUrlListFromDb();

      endCrawler();
    })
    .catch(e => {
      console.error('====> Error: ', e.stack);
      endCrawler();
    });

};

const endCrawler = () => {
  // end
  isRunning = false;
  if (db) {
    console.log('====> End at: ', new Date());
    db.close();
  }
}


var job = new CronJob({
    cronTime: '0 24 */2 * * *', // run every two hours
    onTick: function() {
      /*
       * Runs every two hours
       */
      if (!isRunning) {
        doCrawler();
      }
    },
    start: false
});


doCrawler();
job.start();
