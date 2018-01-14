let axios = require('axios');
let http = require('http');
require('axios-debug-log');

const baseUrl = 'http://www.popyard.com/cgi-mod/';

var getFullUrl = function(str) {
    if (str.indexOf(baseUrl) < 0) {
        if (str[0] === '.') {
            str = str.substring(1);
        }
        if (str[0] === '/') {
            str = str.substring(1);
        }
        return baseUrl + str + '&v=0&k=0';
    }
    return str;
};

var getUri = function(str) {
    if (str.indexOf(baseUrl) >= 0) {
        return str.substring(baseUrl.length-1) + '&v=0&k=0';
    }
    return str;
};

//todo: support retry when failed
var fetch = async function (url) {
    //url = getUri(url);
    url = getFullUrl(url);
    console.log('Processing', url);

    let options = {
        // baseURL: baseUrl,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'User-Agent':'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.24) Gecko/20111109 CentOS/3.6.24-3.el6.centos Firefox/3.6.24'
        },
        proxy: {
            host: '66.82.144.29',
            port: 8080
        },
        timeout: 3000,
        maxRedirects: 5, // default
        responseType: 'text',
        httpAgent: new http.Agent({ keepAlive: true })
    };

    return await axios.get(url, options)
        .then(response => {
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
    pause: 500,
    fetch: fetch
}