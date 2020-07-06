import deepmerge from 'deepmerge';
import scaffoldIntegrationTesting from './integration-testing';

export default async function ({projectRoot, testing}) {
  return deepmerge({devDependencies: [], scripts: {}}, await scaffoldIntegrationTesting({projectRoot, testing}));
}
