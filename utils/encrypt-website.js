const fs = require('fs');
const gibberishAES = require('gibberish-aes/dist/gibberish-aes-1.0.0.min.js');
const key = process.env.KEY;
const value = process.env.VALUE;
const basepath = `${__dirname}/../_site/jekyll`;

const encryptContent = (content, key, value) => gibberishAES.enc(content, key + value);

const readFile = (file) => {
  console.log(`Opening file ${file}`)
  const html = fs.readFileSync(file, 'utf-8');
  
  if (!html.includes('REPLACEMEENCRYPT(')) {
    console.log(`Did not encrypt ${file}\n`);
    return;
  };
  const splitHtml = html.split(/\'REPLACEMEENCRYPT\(".*"\)\'/g);
  const contentToEncrypt = html.match(/\'REPLACEMEENCRYPT\(".*"\)\'/g)[0]
    .replace(/.$/, '') // Replace last character which is a '
    .replace(/.$/, '') // Replace next last character which is a )
    .replace(/.$/, '') // Replace next last character which is a "
    .replace('REPLACEMEENCRYPT("', '');

  encryptedContent = JSON.stringify(encryptContent(contentToEncrypt, key, value));
  const finalContent = splitHtml.join(encryptedContent);
  fs.writeFileSync(file, finalContent);
  console.log(`Encrypted file ${file}\n`);
}

const lookupDirectory = (path) => {
  var directoryContents = fs.readdirSync(path);
  directoryContents.forEach((filename) => {
    if (filename.includes('.html')) {
      console.log(`Attempting to encrypt file ${filename}`);
      readFile(`${path}/${filename}`);
    } else {
      lookupDirectory(`${path}/${filename}`);
    }
  })
}

lookupDirectory(basepath);