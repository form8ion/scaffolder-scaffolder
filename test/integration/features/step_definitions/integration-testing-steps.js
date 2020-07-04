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
  assert.isTrue(devDependencies.includes('package-preview'));
});

Then('cucumber will not be enabled', async function () {
  const {scripts, devDependencies} = this.results;

  assert.isUndefined(scripts['pretest:integration']);
  assert.isFalse(devDependencies.includes('package-preview'));
});
