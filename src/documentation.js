import {promises as fs} from 'fs';
import {resolve} from 'path';

import filedirname from 'filedirname';

const [, __dirname] = filedirname();

export default async function ({projectRoot}) {
  await fs.copyFile(
    resolve(__dirname, '..', 'templates', 'example.js'),
    `${projectRoot}/example.js`
  );

  return {devDependencies: ['mock-fs']};
}
