import {promises as fs} from 'node:fs';

import {Given} from '@cucumber/cucumber';
import {dialects} from '@form8ion/javascript-core';

Given('the project dialect is {string}', async function (dialect) {
  this.dialect = dialect;

  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({type: dialects.ESM === dialect ? 'module' : 'commonjs'})
  );
});
