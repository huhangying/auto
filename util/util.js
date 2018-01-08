var rp = require('request-promise').defaults({ simple: false });
let axios = require('axios');
let http = require('http');
require('axios-debug-log');

const baseUrl = 'http://www.popyard.com/cgi-mod/';

var getFullUrl = function(str) {
    if (str.indexOf(baseUrl) < 0) {
        return baseUrl + str.substring(1) + '&v=0&k=0';
    }
    return str;
};

var getUri = function(str) {
    if (str.indexOf(baseUrl) >= 0) {
        return str.substring(baseUrl.length-1) + '&v=0&k=0';
    }
    return str;
};

var fetch = async function (url) {
    //url = getUri(url);
    url = getFullUrl(url);
    console.log('Processing', url);

    let options = {
        // baseURL: baseUrl,
        // url: url,
        headers: {
            'Host': 'www.popyard.com',
            //'Accept': '*/*',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            //'Accept-Encoding': 'gzip, deflate',
            //'Accept-Language': 'en-US,en;q=0.9',
            //'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
            'User-Agent':'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.24) Gecko/20111109 CentOS/3.6.24-3.el6.centos Firefox/3.6.24'
        },
        proxy: {
            host: '54.197.236.138',
            port: 8080
        },
        // transformResponse: [function (data) {
        //     // Do whatever you want to transform the data
        //
        //     return data;
        // }],
        timeout: 20000,
        // validateStatus: function (status) {
        //     //return status >= 200 && status < 300; // default
        //     return true;
        // },
        responseType: 'text',
        httpAgent: new http.Agent({ keepAlive: false })
        //httpsAgent: new https.Agent({ keepAlive: true }),
        // maxAttempts : 15,
        // retryDelay : 2000,
        // followRedirect : false,
        // followAllRedirects : false
    };

    return await axios.get(url, options)
    //return await rp.get(url, options)
        .then(response => {
            //console.log(`-----> get page length: ${htmlString.data}`);
            if (response.status === 200) {
                return response.data;
            }
            else {
                return `<html></html>`;
            }

        })
        .catch(error => {
            console.error(error.stack + '|' + error );
            return `<html>${error.stack}</html>`;
        });
};

module.exports = {
    pause: 1 * 1000,
    fetch: fetch
}