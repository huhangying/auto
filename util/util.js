var request = require('request');

var baseUrl = 'http://www.popyard.com/cgi-mod';

var getFullUrl = function(str) {
    if (str.indexOf(baseUrl) < 0) {
        return baseUrl + str.substring(1) + '&v=0&k=0';
    }
    return str;
};

var fetch = function (url) {
    if (!url) {
        return new global.Promise.reject();
    }
    url = getFullUrl(url);
    console.log('Processing', url);

    return new global.Promise(function (resolve, reject) {
        request(
            {
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    //'accept-encoding': 'gzip, deflate',
                    'accept-language': 'en-US,en;q=0.8',
                    //'cache-control':'max-age=0',
                    //'connection':'keep-alive',
                    //'cookie':'ushudie=CA; __gads=ID=4b545c990bd67bf3:T=1468951586:S=ALNI_MaJu88dfKO5daAOAtdleI-vvpj9ig; __qca=P0-2044153097-1502891285865; banner_728_90_hmh_9_5_17_silencer_728x90_banner_unique_user_tracking=1; blogads_book_excerpt_client_side=100473135%7C1; banner_160_600_scholastic_10_1_17_about_mia_160x600_banner_unique_user_tracking=1; _ga=GA1.2.871092476.1468951542; __sonar=6456986047480514964; _bs5a46dcd961caa48998d460c1d64df5c0=1; __utmt=1; __utma=30831166.871092476.1468951542.1510762734.1510770524.351; __utmb=30831166.3.10.1510770524; __utmc=30831166; __utmz=30831166.1510720697.349.343.utmcsr=popyard.org|utmccn=(referral)|utmcmd=referral|utmcct=/',
                    //'host':'www.popyard.com',
                    //'upgrade-insecure-requests':'1',
                    'user-agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
                },
                uri: url,
                method: 'GET'
            },
            function (error, response, html) {
                if(!error) {
                    //var $ = cheerio.load(html);
                    resolve(html);
                }
                else {
                    reject(error);
                }
            });
    });
};

module.exports = {
    pause: 1 * 1000,
    fetch: fetch
}