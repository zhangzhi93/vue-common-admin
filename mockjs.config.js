const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, '/mock');
const mock = {};

// fs.readdirSync(mockPath).forEach(file => {
//   Object.assign(mock, require('./mock/' + file));
// });

function readDirSync(dirpath, name) {
  const pa = fs.readdirSync(dirpath);
  pa.forEach((file, index) => {
    const info = fs.statSync(`${dirpath}/${file}`);
    let basepath = name;
    if (info.isDirectory()) {
      basepath = `${basepath + file}/`;
      readDirSync(path.join(dirpath, file), basepath);
    } else {
      Object.assign(mock, require(basepath + file));
    }
  });
}

readDirSync(mockPath, './mock/');

module.exports = mock;
