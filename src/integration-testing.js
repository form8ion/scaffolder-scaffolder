import {promises as fs} from 'fs';
import deepmerge from 'deepmerge';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, tests: {integration}}) {
  if (integration) {
    const createdFeaturesDirectory = await mkdir(`${projectRoot}/test/integration/features`);
    const createdStepsDirectory = await mkdir(`${createdFeaturesDirectory}/step_definitions`);

    await fs.writeFile(`${createdStepsDirectory}/common-steps.js`, '');

    return deepmerge(
      {scripts: {'pretest:integration': 'preview'}, devDependencies: ['package-preview']},
      await scaffoldCucumber({projectRoot})
    );
  }

  return {};
}
