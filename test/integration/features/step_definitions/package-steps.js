import {promises as fs} from 'fs';
import {Then} from 'cucumber';
import {assert} from 'chai';

Then('the manifest file is generated', async function () {
  assert.equal(
    await fs.readFile(`${process.cwd()}/src/index.js`, 'utf-8'),
    "export {default as scaffold} from './scaffold';\n"
  );
});
