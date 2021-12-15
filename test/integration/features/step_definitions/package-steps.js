import {promises as fs} from 'fs';
import {resolve} from 'path';
import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

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
