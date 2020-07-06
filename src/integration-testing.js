import deepmerge from 'deepmerge';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

export default async function ({projectRoot, tests: {integration}}) {
  if (integration) {
    return deepmerge(
      {scripts: {'pretest:integration': 'preview'}, devDependencies: ['package-preview']},
      await scaffoldCucumber({projectRoot})
    );
  }

  return {};
}
