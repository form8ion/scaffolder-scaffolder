import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promises as fs} from 'node:fs';

import {fileExists} from '@form8ion/core';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

const __dirname = dirname(fileURLToPath(import.meta.url));      // eslint-disable-line no-underscore-dangle
const pathToTemplates = [__dirname, '..', '..', '..', '..', 'templates'];

Given('the scaffolded project will be integration tested', async function () {
  this.integrationTesting = true;
});

Given('the scaffolded project will not be integration tested', async function () {
  this.integrationTesting = false;
});

Then('cucumber will be enabled', async function () {
  const {scripts, dependencies} = this.results;

  assert.deepEqual(scripts['pretest:integration:base'], 'run-s build');
  assert.isTrue(dependencies.javascript.development.includes('@cucumber/cucumber'));
  assert.isTrue(dependencies.javascript.development.includes('mock-fs'));
  assert.isTrue(dependencies.javascript.development.includes('@form8ion/core'));
  assert.equal(
    await fs.readFile(`${this.projectRoot}/test/integration/features/scaffold.feature`, 'utf-8'),
    await fs.readFile(resolve(...pathToTemplates, 'scaffold.feature'), 'utf8')
  );
  assert.equal(
    await fs.readFile(`${this.projectRoot}/test/integration/features/form8ion.feature`, 'utf-8'),
    (await fs.readFile(resolve(...pathToTemplates, 'form8ion-feature.mustache'), 'utf8'))
      .replace(/{{{ projectName }}}/g, this.projectName)
  );
});

Then('the step definitions use a {string} extension', async function (extension) {
  assert.equal(
    await fs.readFile(
      `${this.projectRoot}/test/integration/features/step_definitions/common-steps.${extension}`,
      'utf-8'
    ),
    (await fs.readFile(resolve(...pathToTemplates, 'common-steps.mustache'), 'utf8'))
      .replace('{{{ packageName }}}', this.packageName)
  );
  assert.equal(
    await fs.readFile(
      `${this.projectRoot}/test/integration/features/step_definitions/form8ion-steps.${extension}`,
      'utf-8'
    ),
    (await fs.readFile(resolve(...pathToTemplates, 'form8ion-steps.mustache'), 'utf8'))
      .replace('{{{ projectName }}}', this.projectName)
      .replace('{{{ packageName }}}', this.packageName)
  );
  assert.isTrue(await fileExists(`${this.projectRoot}/cucumber.${extension}`));
});

Then('cucumber will not be enabled', async function () {
  const {scripts, dependencies} = this.results;

  assert.isUndefined(scripts['pretest:integration']);
  assert.isFalse(dependencies.javascript.development.includes('@cucumber/cucumber'));
  assert.isFalse(dependencies.javascript.development.includes('@form8ion/core'));
  assert.isFalse(await fileExists(`${this.projectRoot}/test/integration/features/scaffolder.feature`));
  assert.isFalse(await fileExists(`${this.projectRoot}/test/integration/features/step_definitions/common-steps.js`));
});
