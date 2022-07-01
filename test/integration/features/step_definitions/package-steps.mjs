import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promises as fs} from 'node:fs';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

const __dirname = dirname(fileURLToPath(import.meta.url));

Then('the manifest file is generated', async function () {
  assert.equal(
    await fs.readFile(`${process.cwd()}/src/index.js`, 'utf-8'),
    "export {default as scaffold} from './scaffolder';\n"
  );
  assert.equal(
    await fs.readFile(`${process.cwd()}/src/scaffolder.js`, 'utf-8'),
    await fs.readFile(resolve(__dirname, '..', '..', '..', '..', 'templates', 'scaffolder.js'), 'utf-8')
  );
});
