import {promises as fs} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {scaffold} from '@form8ion/scaffolder-scaffolder';
import {After, Before, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToProjectRoot = [__dirname, '../../../../'];

Before(async function () {
  stubbedFs({
    templates: stubbedFs.load(resolve(...pathToProjectRoot, 'templates')),
    node_modules: stubbedFs.load(resolve(...pathToProjectRoot, 'node_modules')),
    'package.json': JSON.stringify({})
  });
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  this.packageName = `@${any.word()}/${any.word()}-${any.word()}`;

  this.results = await scaffold({
    projectRoot: process.cwd(),
    packageName: this.packageName,
    tests: {integration: this.integrationTesting}
  });
});
