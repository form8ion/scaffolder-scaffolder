import {promises as fs} from 'fs';
import {resolve} from 'path';
import deepmerge from 'deepmerge';
import mkdir from '../thirdparty-wrappers/make-dir';
import scaffoldIntegrationTesting from './integration-testing';
import scaffoldDocumentation from './documentation';

export default async function ({projectRoot, packageName, tests}) {
  const createdSrcDirectory = await mkdir(`${projectRoot}/src`);

  await Promise.all([
    scaffoldDocumentation({projectRoot}),
    fs.writeFile(`${createdSrcDirectory}/index.js`, "export {default as scaffold} from './scaffold';\n"),
    fs.copyFile(resolve(__dirname, '..', 'templates', 'scaffold.js'), `${createdSrcDirectory}/scaffold.js`)
  ]);

  return deepmerge(
    {devDependencies: ['mock-fs'], scripts: {}},
    await scaffoldIntegrationTesting({projectRoot, packageName, tests})
  );
}
