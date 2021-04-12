// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {scaffold} from '@form8ion/scaffolder-scaffolder';
import {promises as fs} from 'fs';
import {resolve} from 'path';
import {After, Before, When} from 'cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';

const packagePreviewDirectory = '../__package_previews__/scaffolder-scaffolder/@form8ion/scaffolder-scaffolder';
const pathToNodeModules = [__dirname, '../../../../', 'node_modules'];
const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

Before(async function () {
  const templates = {
    'example.js': await fs.readFile(resolve(__dirname, '../../../../', 'templates/example.js')),
    'scaffold.js': await fs.readFile(resolve(__dirname, '../../../../', 'templates/scaffold.js')),
    'common-steps.mustache': await fs.readFile(resolve(
      __dirname,
      '../../../../',
      'templates/common-steps.mustache'
    )),
    'scaffolder.feature': await fs.readFile(resolve(__dirname, '../../../../', 'templates/scaffolder.feature'))
  };

  stubbedFs({
    templates,
    node_modules: stubbedNodeModules,
    [packagePreviewDirectory]: {
      templates,
      node_modules: {
        '.pnpm': {
          '@form8ion+cucumber-scaffolder@1.4.0': {
            node_modules: {
              '@form8ion': {
                'cucumber-scaffolder': {
                  templates: {
                    'cucumber.txt': await fs.readFile(resolve(
                      ...pathToNodeModules,
                      '@form8ion/cucumber-scaffolder/templates/cucumber.txt'
                    ))
                  }
                }
              }
            }
          }
        }
      }
    }
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
