const download = require('image-downloader')



let list = [
    'http://www.moremorewin.net/imgserver/imgs/2017/11/21/35f36d3c90228a27036fcf64ef9faf1c.jpg',
    'http://www.moremorewin.net/imgserver/imgs/2017/11/21/bb5c57d86ff9180f3072fb594ae91981.jpg'
];

console.log(new Date());

list.map(
    async (url) => {
        await download.image({
            headers: {
                //'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
                'User-Agent':'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.24) Gecko/20111109 CentOS/3.6.24-3.el6.centos Firefox/3.6.24'
            },
            url: url,
            dest: '.'// image保存的目录
        })
            .then(({filename}) => {
                console.log(`File saved to ${filename} @ ${(new Date()).toISOString()}`);
            })
            .catch(err => console.log(err.stack));
    }
);


