import {promises as fsPromises, promises as fs} from 'fs';
import {resolve} from 'path';
import mustache from 'mustache';
import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';
import deepmerge from 'deepmerge';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import scaffold from './integration-testing';

suite('integration tests', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(cucumberScaffolder, 'scaffold');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(fs, 'copyFile');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(mkdir, 'default');
    sandbox.stub(mustache, 'render');
  });

  teardown(() => sandbox.restore());

  test('that cucumber is configured when the project should be integration tested', async () => {
    const projectRoot = any.string();
    const packageName = any.word();
    const cucumberResults = any.simpleObject();
    const pathToCreatedFeaturesDirectory = any.string();
    const pathToCreatedStepsDirectory = any.string();
    const templateContent = any.string();
    const commonStepsContent = any.string();
    cucumberScaffolder.scaffold.withArgs({projectRoot}).resolves(cucumberResults);
    mkdir.default.withArgs(`${projectRoot}/test/integration/features`).resolves(pathToCreatedFeaturesDirectory);
    mkdir.default.withArgs(`${pathToCreatedFeaturesDirectory}/step_definitions`).resolves(pathToCreatedStepsDirectory);
    fsPromises.readFile
      .withArgs(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8')
      .resolves(templateContent);
    mustache.render.withArgs(templateContent, {packageName}).returns(commonStepsContent);

    assert.deepEqual(
      await scaffold({projectRoot, packageName, tests: {integration: true}}),
      deepmerge(
        {scripts: {'pretest:integration:base': 'run-s build'}, devDependencies: ['mock-fs']},
        cucumberResults
      )
    );
    assert.calledWith(fs.writeFile, `${pathToCreatedStepsDirectory}/common-steps.mjs`, commonStepsContent);
    assert.calledWith(
      fs.copyFile,
      resolve(__dirname, '..', 'templates', 'scaffolder.feature'),
      `${pathToCreatedFeaturesDirectory}/scaffolder.feature`
    );
  });

  test('that the cucumber is not configured when the project should not be integration tested', async () => {
    cucumberScaffolder.scaffold.resolves({});

    assert.deepEqual(await scaffold({tests: {integration: false}}), {});
  });
});
