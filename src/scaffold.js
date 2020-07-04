import deepmerge from 'deepmerge';
import scaffoldIntegrationTesting from './integration-testing';

export default async function ({testing}) {
  return deepmerge({devDependencies: [], scripts: {}}, await scaffoldIntegrationTesting({testing}));
}
