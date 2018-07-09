let axios = require('axios');
let http = require('http');
require('axios-debug-log');

const baseUrl = 'http://www.popyard.com/cgi-mod/';
const maxTry = 10;
let currentTry = 0;
let proxy = {};

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

const getAProxy = async () => {
    let aproxy = await axios.get('https://gimmeproxy.com/api/getProxy?get=true&minSpeed=50&maxCheckPeriod=3600');
    aproxy = {
        host: aproxy.data.ip,
        port: aproxy.data.port
    }
    console.log('change to a proxy: ', JSON.stringify(aproxy))
    return aproxy;
};

const initProxy = async() => {
    proxy = undefined;
}

//todo: support retry with different proxy when failed
var fetch = async function (url) {
    //url = getUri(url);

  // prepare proxy if not existed
  if (!proxy) {
    proxy = await getAProxy(); // change to another proxy
  }

    url = getFullUrl(url);
    console.log('Processing', url, 'proxy:', JSON.stringify(proxy));

    let options = {
        // baseURL: baseUrl,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'User-Agent':'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.24) Gecko/20111109 CentOS/3.6.24-3.el6.centos Firefox/3.6.24'
        },
        proxy: proxy,
        timeout: 3000,
        maxRedirects: 0, // 5 by default
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
        .catch(async error => {
            if (currentTry < maxTry) {
                currentTry++;
                console.error(`${url} tried ${currentTry} time. -- proxy: ${JSON.stringify(proxy)}`);
                proxy = await getAProxy(); // change to another proxy
                return fetch(url);
            }
            else {
                console.error(`${url} tried ${currentTry} time. -- proxy: ${JSON.stringify(proxy)} failed.`);
                console.error(error.stack + '|' + error );
                currentTry = 0;
                return `<html>${error.stack}</html>`;
            }
        });
};

module.exports = {
    pause: 500,
    fetch: fetch,
    initProxy: initProxy
}