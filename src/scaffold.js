import deepmerge from 'deepmerge';
import scaffoldIntegrationTesting from './integration-testing';
import scaffoldDocumentation from './documentation';

export default async function ({projectRoot, packageName, tests}) {
  await scaffoldDocumentation({projectRoot});

  return deepmerge(
    {devDependencies: ['mock-fs'], scripts: {}},
    await scaffoldIntegrationTesting({projectRoot, packageName, tests})
  );
}
