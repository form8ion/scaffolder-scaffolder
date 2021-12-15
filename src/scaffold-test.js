import {promises as fs} from 'fs';
import {resolve} from 'path';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import deepmerge from 'deepmerge';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as integrationTesting from './integration-testing';
import * as documentation from './documentation';
import scaffold from './scaffold';

suite('scaffold', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(integrationTesting, 'default');
    sandbox.stub(documentation, 'default');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(fs, 'copyFile');
    sandbox.stub(mkdir, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the scaffolder is scaffolded', async () => {
    const integrationTestingResults = any.simpleObject();
    const pathToCreatedSrcDirectory = any.string();
    const tests = {integration: any.boolean()};
    const projectRoot = any.string();
    const packageName = any.word();
    integrationTesting.default.withArgs({projectRoot, packageName, tests}).resolves(integrationTestingResults);
    mkdir.default.withArgs(`${projectRoot}/src`).resolves(pathToCreatedSrcDirectory);

    assert.deepEqual(
      await scaffold({projectRoot, tests, packageName}),
      deepmerge({devDependencies: ['mock-fs'], scripts: {}}, integrationTestingResults)
    );
    assert.calledWith(documentation.default, {projectRoot});
    assert.calledWith(
      fs.writeFile,
      `${pathToCreatedSrcDirectory}/index.js`,
      "export {default as scaffold} from './scaffolder';\n"
    );
    assert.calledWith(
      fs.copyFile,
      resolve(__dirname, '..', 'templates', 'scaffolder.js'),
      `${pathToCreatedSrcDirectory}/scaffolder.js`
    );
  });
});
