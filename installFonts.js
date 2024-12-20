#!/usr/bin/env node

const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const decompress = require('decompress');

const file = fs.createWriteStream('bakoma.zip');
https.get('https://us.mirrors.cicku.me/ctan/fonts/cm/ps-type1/bakoma.zip', (response) => {
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        decompress('bakoma.zip', 'dist', { filter: (file) => path.extname(file.path) === '.ttf' }).then(() =>
            fs.unlink('bakoma.zip', (err) => {
                if (err) console.log(`Error deleting file: ${err}`);
            })
        );
    });
});
