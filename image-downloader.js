const download = require('image-downloader')


async function downloadIMG(url) {
    try {
        const { filename, image } = await download.image({url: url, dest: '.'})
        console.log('File saved to', filename);
    } catch (e) {
        throw e
    }
}

let list = [
    'http://www.moremorewin.net/imgserver/imgs/2017/11/21/35f36d3c90228a27036fcf64ef9faf1c.jpg',
    'http://www.moremorewin.net/imgserver/imgs/2017/11/21/bb5c57d86ff9180f3072fb594ae91981.jpg'
];

console.log(new Date())
list.map(function(_url) {
    downloadIMG(_url)
        .then(() => {
            console.log(new Date())
        })
        .catch(err => console.log(err.stack));
})


