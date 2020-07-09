import {promises as fs} from 'fs';
import {resolve} from 'path';
import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import scaffoldDocumentation from './documentation';

suite('documentation', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'copyFile');
  });

  teardown(() => sandbox.restore());

  test('that the example file is generated', async () => {
    const projectRoot = any.string();

    await scaffoldDocumentation({projectRoot});

    assert.calledWith(fs.copyFile, resolve(__dirname, '..', 'templates', 'example.js'), `${projectRoot}/example.js`);
  });
});
