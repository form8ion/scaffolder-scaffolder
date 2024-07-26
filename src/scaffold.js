import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';

import mkdir from 'make-dir';
import deepmerge from 'deepmerge';
import filedirname from 'filedirname';

import scaffoldIntegrationTesting from './integration-testing.js';
import scaffoldDocumentation from './documentation.js';

const [, __dirname] = filedirname();

export default async function ({projectRoot, packageName, tests, dialect}) {
  const createdSrcDirectory = await mkdir(`${projectRoot}/src`);

  const [documentationResults, integrationTestingResults] = await Promise.all([
    scaffoldDocumentation({projectRoot}),
    scaffoldIntegrationTesting({projectRoot, packageName, tests, dialect}),
    fs.writeFile(`${createdSrcDirectory}/index.js`, "export {default as scaffold} from './scaffolder.js';\n"),
    fs.copyFile(resolve(__dirname, '..', 'templates', 'scaffolder.js'), `${createdSrcDirectory}/scaffolder.js`)
  ]);

  return deepmerge(documentationResults, integrationTestingResults);
}
