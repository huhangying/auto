//var rp = require('request-promise').defaults({ simple: false });
let axios = require('axios');

const baseUrl = 'http://www.popyard.com/cgi-mod';

var getFullUrl = function(str) {
    if (str.indexOf(baseUrl) < 0) {
        return baseUrl + str.substring(1) + '&v=0&k=0';
    }
    return str;
};

var fetch = async function (url) {
    url = getFullUrl(url);
    console.log('Processing', url);

    let options = {
        uri: url,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            //'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            //'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
            'User-Agent':'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.24) Gecko/20111109 CentOS/3.6.24-3.el6.centos Firefox/3.6.24'
        },
        maxAttempts : 15,
        retryDelay : 2000,
        followRedirect : false,
        followAllRedirects : false
    };

    return await axios.get(url)
    //return await rp(options)
        .then(htmlString => {
            //console.log(`-----> get page length: ${htmlString.data}`);
            return htmlString.data;
        })
        .catch(error => console.error(error.stack));
};

module.exports = {
    pause: 1 * 1000,
    fetch: fetch
}