import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';

import deepmerge from 'deepmerge';
import filedirname from 'filedirname';

import scaffoldIntegrationTesting from './integration-testing.js';
import scaffoldDocumentation from './documentation.js';

const [, __dirname] = filedirname();

export default async function ({projectRoot, projectName, packageName, tests, dialect}) {
  await fs.mkdir(`${projectRoot}/src`, {recursive: true});

  const [documentationResults, integrationTestingResults] = await Promise.all([
    scaffoldDocumentation({projectRoot}),
    scaffoldIntegrationTesting({projectRoot, projectName, packageName, tests, dialect}),
    fs.writeFile(`${projectRoot}/src/index.js`, "export {default as scaffold} from './scaffolder.js';\n"),
    fs.copyFile(resolve(__dirname, '..', 'templates', 'scaffolder.js'), `${projectRoot}/src/scaffolder.js`)
  ]);

  return deepmerge(documentationResults, integrationTestingResults);
}
