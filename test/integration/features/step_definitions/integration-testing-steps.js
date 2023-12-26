import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promises as fs} from 'node:fs';

import {fileExists} from '@form8ion/core';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

const __dirname = dirname(fileURLToPath(import.meta.url));      // eslint-disable-line no-underscore-dangle
const pathToTemplates = [__dirname, '..', '..', '..', '..', 'templates'];

Given('the scaffolded project will be integration tested', async function () {
  this.integrationTesting = true;
});

Given('the scaffolded project will not be integration tested', async function () {
  this.integrationTesting = false;
});

Then('cucumber will be enabled', async function () {
  const {scripts, devDependencies} = this.results;

  assert.deepEqual(scripts['pretest:integration:base'], 'run-s build');
  assert.isTrue(devDependencies.includes('@cucumber/cucumber'));
  assert.isTrue(devDependencies.includes('mock-fs'));
  assert.equal(
    await fs.readFile(`${process.cwd()}/test/integration/features/scaffolder.feature`, 'utf-8'),
    await fs.readFile(resolve(...pathToTemplates, 'scaffolder.feature'), 'utf8')
  );
});

Then('the step definitions use a {string} extension', async function (extension) {
  assert.equal(
    await fs.readFile(`${process.cwd()}/test/integration/features/step_definitions/common-steps.${extension}`, 'utf-8'),
    (await fs.readFile(resolve(...pathToTemplates, 'common-steps.mustache'), 'utf8'))
      .replace('{{{ packageName }}}', this.packageName)
  );
});

Then('cucumber will not be enabled', async function () {
  const {scripts, devDependencies} = this.results;

  assert.isUndefined(scripts['pretest:integration']);
  assert.isFalse(devDependencies.includes('cucumber'));
  assert.isFalse(devDependencies.includes('package-preview'));
  assert.isFalse(await fileExists(`${process.cwd()}/test/integration/features/scaffolder.feature`));
  assert.isFalse(await fileExists(`${process.cwd()}/test/integration/features/step_definitions/common-steps.js`));
});
