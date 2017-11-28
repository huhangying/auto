var rp = require('request-promise');

var baseUrl = 'http://www.popyard.com/cgi-mod';

var getFullUrl = function(str) {
    if (str.indexOf(baseUrl) < 0) {
        return baseUrl + str.substring(1) + '&v=0&k=0';
    }
    return str;
};

var fetch = async function (url) {
    if (!url) {
        return new global.Promise.reject();
    }
    url = getFullUrl(url);
    console.log('Processing', url);

    let options = {
        uri: url,
        headers: {
            'accept-language': 'en-US,en;q=0.8',
            'user-agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        }
    };

    return await rp(options);
};

module.exports = {
    pause: 1 * 1000,
    fetch: fetch
}