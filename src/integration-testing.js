import {promises as fs} from 'fs';
import {resolve} from 'path';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, packageName, tests: {integration}}) {
  if (integration) {
    const [cucumberResults, createdFeaturesDirectory] = await Promise.all([
      scaffoldCucumber({projectRoot}),
      mkdir(`${projectRoot}/test/integration/features`)
    ]);
    const createdStepsDirectory = await mkdir(`${createdFeaturesDirectory}/step_definitions`);

    await Promise.all([
      fs.writeFile(
        `${createdStepsDirectory}/common-steps.js`,
        mustache.render(
          await fs.readFile(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8'),
          {packageName}
        )
      ),
      fs.copyFile(
        resolve(__dirname, '..', 'templates', 'scaffolder.feature'),
        `${createdFeaturesDirectory}/scaffolder.feature`
      )
    ]);

    return deepmerge(
      {scripts: {'pretest:integration:base': 'preview'}, devDependencies: ['package-preview', 'mock-fs']},
      cucumberResults
    );
  }

  return {};
}
