import {promises as fs} from 'node:fs';
import {resolve} from 'path';

import deepmerge from 'deepmerge';
import filedirname from 'filedirname';

import mkdir from '../thirdparty-wrappers/make-dir';
import scaffoldIntegrationTesting from './integration-testing';
import scaffoldDocumentation from './documentation';

const [, __dirname] = filedirname();

export default async function ({projectRoot, packageName, tests}) {
  const createdSrcDirectory = await mkdir(`${projectRoot}/src`);

  await Promise.all([
    scaffoldDocumentation({projectRoot}),
    fs.writeFile(`${createdSrcDirectory}/index.js`, "export {default as scaffold} from './scaffolder';\n"),
    fs.copyFile(resolve(__dirname, '..', 'templates', 'scaffolder.js'), `${createdSrcDirectory}/scaffolder.js`)
  ]);

  return deepmerge(
    {devDependencies: ['mock-fs'], scripts: {}},
    await scaffoldIntegrationTesting({projectRoot, packageName, tests})
  );
}
