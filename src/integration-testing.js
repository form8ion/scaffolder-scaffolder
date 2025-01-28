import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';

import mkdir from 'make-dir';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import filedirname from 'filedirname';
import {dialects} from '@form8ion/javascript-core';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

const [, __dirname] = filedirname();

function determineExtensionFor({dialect}) {
  if (dialects.ESM === dialect) return 'js';

  return 'mjs';
}

export default async function ({projectRoot, packageName, tests: {integration}, dialect}) {
  if (integration) {
    const [cucumberResults, createdFeaturesDirectory] = await Promise.all([
      scaffoldCucumber({projectRoot}),
      mkdir(`${projectRoot}/test/integration/features`)
    ]);
    const createdStepsDirectory = await mkdir(`${createdFeaturesDirectory}/step_definitions`);

    await Promise.all([
      fs.writeFile(
        `${createdStepsDirectory}/common-steps.${determineExtensionFor({dialect})}`,
        mustache.render(
          await fs.readFile(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8'),
          {packageName}
        )
      ),
      fs.copyFile(
        resolve(__dirname, '..', 'templates', 'scaffold.feature'),
        `${createdFeaturesDirectory}/scaffold.feature`
      )
    ]);

    return deepmerge(
      {scripts: {'pretest:integration:base': 'run-s build'}, dependencies: {javascript: {development: ['mock-fs']}}},
      cucumberResults
    );
  }

  return {scripts: {}};
}
