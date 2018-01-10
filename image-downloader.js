const download = require('image-downloader')



let list = [
    'http://www.moremorewin.net/imgserver/imgs/2017/11/21/35f36d3c90228a27036fcf64ef9faf1c.jpg',
    'http://www.moremorewin.net/imgserver/imgs/2017/11/21/bb5c57d86ff9180f3072fb594ae91981.jpg'
];

// return filename if successful
// return none if failed
const downloadImage = async (url) => {
// const downloadImage = async (url) => {
    download.image({
        headers: {
            'Accept': 'image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8',
            //'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
            'User-Agent':'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.24) Gecko/20111109 CentOS/3.6.24-3.el6.centos Firefox/3.6.24'
        },
        url: url,
        dest: './images/popyard'// image保存的目录
    })
        .then(({filename}) => {
            console.log(`File saved to ${filename} @ ${(new Date()).toISOString()}`);
            return filename;
        })
        .catch(err => {
            console.log(err.stack);
            return '';
        });
};

// list.map(
//     (url) => downloadImage(url)
// );


module.exports = {
    downloadImage: downloadImage
}




