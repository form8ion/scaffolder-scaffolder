import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import deepmerge from 'deepmerge';
import * as integrationTesting from './integration-testing';
import scaffold from './scaffold';

suite('scaffold', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(integrationTesting, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the scaffolder is scaffolded', async () => {
    const integrationTestingResults = any.simpleObject();
    const testing = {integration: any.boolean()};
    integrationTesting.default.withArgs({testing}).resolves(integrationTestingResults);

    assert.deepEqual(
      await scaffold({testing}),
      deepmerge({devDependencies: [], scripts: {}}, integrationTestingResults)
    );
  });
});
