import deepmerge from 'deepmerge';
import scaffoldIntegrationTesting from './integration-testing';

export default async function ({projectRoot, testing}) {
  return deepmerge(
    {devDependencies: ['mock-fs'], scripts: {}},
    await scaffoldIntegrationTesting({projectRoot, testing})
  );
}
