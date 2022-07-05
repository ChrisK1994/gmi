const fs = require('fs');

const arr = ['api', 'config'];

for (let i = 0; i < arr.length; i += 1) {
  const srcpath = '../src/' + arr[i];
  const dstpath = arr[i];

  if (!fs.existsSync(dstpath)) {
    try {
      fs.symlinkSync(srcpath, dstpath, 'dir');
    } catch (ex) {
      console.error(`Creating symbolic link failed, consider Administrator mode on Windows: `);
      console.error(ex);
      break;
    }
  }
}
