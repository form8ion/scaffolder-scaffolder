import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import {Given, Then} from 'cucumber';
import {assert} from 'chai';

Given('the scaffolded project will be integration tested', async function () {
  this.integrationTesting = true;
});

Given('the scaffolded project will not be integration tested', async function () {
  this.integrationTesting = false;
});

Then('cucumber will be enabled', async function () {
  const {scripts, devDependencies} = this.results;

  assert.deepEqual(scripts['pretest:integration'], 'preview');
  assert.isTrue(devDependencies.includes('cucumber'));
  assert.isTrue(devDependencies.includes('package-preview'));
  assert.isTrue(devDependencies.includes('mock-fs'));
  assert.equal(
    await fs.readFile(`${process.cwd()}/test/integration/features/step_definitions/common-steps.js`),
    ''
  );
});

Then('cucumber will not be enabled', async function () {
  const {scripts, devDependencies} = this.results;

  assert.isUndefined(scripts['pretest:integration']);
  assert.isFalse(devDependencies.includes('cucumber'));
  assert.isFalse(devDependencies.includes('package-preview'));
  assert.isFalse(await fileExists(`${process.cwd()}/test/integration/features/step_definitions/common-steps.js`));
});
