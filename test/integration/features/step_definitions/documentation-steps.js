import {fileExists} from '@form8ion/core';
import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the example file is generated', async function () {
  const {dependencies} = this.results;

  assert.isTrue(await fileExists('./example.js'));
  assert.isTrue(dependencies.javascript.development.includes('mock-fs'));
});
