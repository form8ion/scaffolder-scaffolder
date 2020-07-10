// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {scaffold} from '@form8ion/scaffolder-scaffolder';
import {promises as fs} from 'fs';
import {resolve} from 'path';
import {After, Before, When} from 'cucumber';
import stubbedFs from 'mock-fs';

const packagePreviewDirectory = '../__package_previews__/scaffolder-scaffolder/@form8ion/scaffolder-scaffolder';

Before(async function () {
  stubbedFs({
    [packagePreviewDirectory]: {
      templates: {
        'example.js': await fs.readFile(resolve(__dirname, '../../../../', 'templates/example.js'))
      },
      node_modules: {
        '.pnpm': {
          '@form8ion': {
            'cucumber-scaffolder@1.1.0': {
              node_modules: {
                '@form8ion': {
                  'cucumber-scaffolder': {
                    templates: {
                      'cucumber.txt': await fs.readFile(resolve(
                        __dirname,
                        '../../../../',
                        'node_modules/@form8ion/cucumber-scaffolder/templates/cucumber.txt'
                      ))
                    }
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
  this.results = await scaffold({
    projectRoot: process.cwd(),
    tests: {integration: this.integrationTesting}
  });
});
