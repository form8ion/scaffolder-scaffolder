import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';
import deepmerge from 'deepmerge';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import scaffold from './integration-testing';

suite('integration tests', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(cucumberScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that the cucumber is configured when the project should be integration tested', async () => {
    const projectRoot = any.string();
    const cucumberResults = any.simpleObject();
    cucumberScaffolder.scaffold.withArgs({projectRoot}).resolves(cucumberResults);

    assert.deepEqual(
      await scaffold({projectRoot, testing: {integration: true}}),
      deepmerge({scripts: {'pretest:integration': 'preview'}, devDependencies: ['package-preview']}, cucumberResults)
    );
  });

  test('that the cucumber is not configured when the project should not be integration tested', async () => {
    cucumberScaffolder.scaffold.resolves({});

    assert.deepEqual(await scaffold({testing: {integration: false}}), {});
  });
});
