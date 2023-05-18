import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';

import mkdir from 'make-dir';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import filedirname from 'filedirname';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

const [, __dirname] = filedirname();

export default async function ({projectRoot, packageName, tests: {integration}}) {
  if (integration) {
    const [cucumberResults, createdFeaturesDirectory] = await Promise.all([
      scaffoldCucumber({projectRoot}),
      mkdir(`${projectRoot}/test/integration/features`)
    ]);
    const createdStepsDirectory = await mkdir(`${createdFeaturesDirectory}/step_definitions`);

    await Promise.all([
      fs.writeFile(
        `${createdStepsDirectory}/common-steps.mjs`,
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
      {scripts: {'pretest:integration:base': 'run-s build'}, devDependencies: ['mock-fs']},
      cucumberResults
    );
  }

  return {};
}
