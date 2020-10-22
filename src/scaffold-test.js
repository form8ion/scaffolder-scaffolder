import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import deepmerge from 'deepmerge';
import * as integrationTesting from './integration-testing';
import * as documentation from './documentation';
import scaffold from './scaffold';

suite('scaffold', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(integrationTesting, 'default');
    sandbox.stub(documentation, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the scaffolder is scaffolded', async () => {
    const integrationTestingResults = any.simpleObject();
    const tests = {integration: any.boolean()};
    const projectRoot = any.string();
    const packageName = any.word();
    integrationTesting.default.withArgs({projectRoot, packageName, tests}).resolves(integrationTestingResults);

    assert.deepEqual(
      await scaffold({projectRoot, tests, packageName}),
      deepmerge({devDependencies: ['mock-fs'], scripts: {}}, integrationTestingResults)
    );
    assert.calledWith(documentation.default, {projectRoot});
  });
});
