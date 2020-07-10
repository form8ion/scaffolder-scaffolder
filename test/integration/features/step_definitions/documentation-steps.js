import {fileExists} from '@form8ion/core';
import {Then} from 'cucumber';
import {assert} from 'chai';

Then('the example file is generated', async function () {
  assert.isTrue(await fileExists('./example.js'));
});
