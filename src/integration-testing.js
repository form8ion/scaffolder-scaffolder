import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';

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

export default async function ({projectRoot, projectName, packageName, tests: {integration}, dialect}) {
  if (integration) {
    const [cucumberResults] = await Promise.all([
      scaffoldCucumber({projectRoot}),
      fs.mkdir(`${projectRoot}/test/integration/features`, {recursive: true})
    ]);
    await fs.mkdir(`${projectRoot}/test/integration/features/step_definitions`, {recursive: true});

    await Promise.all([
      fs.writeFile(
        `${projectRoot}/test/integration/features/step_definitions/common-steps.${determineExtensionFor({dialect})}`,
        mustache.render(
          await fs.readFile(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8'),
          {packageName}
        )
      ),
      fs.writeFile(
        `${projectRoot}/test/integration/features/step_definitions/form8ion-steps.${determineExtensionFor({dialect})}`,
        mustache.render(
          await fs.readFile(resolve(__dirname, '..', 'templates', 'form8ion-steps.mustache'), 'utf8'),
          {packageName, projectName}
        )
      ),
      fs.writeFile(
        `${projectRoot}/test/integration/features/form8ion.feature`,
        mustache.render(
          await fs.readFile(resolve(__dirname, '..', 'templates', 'form8ion-feature.mustache'), 'utf8'),
          {projectName}
        )
      ),
      fs.copyFile(
        resolve(__dirname, '..', 'templates', 'scaffold.feature'),
        `${projectRoot}/test/integration/features/scaffold.feature`
      )
    ]);

    return deepmerge(
      {scripts: {'pretest:integration:base': 'run-s build'}, dependencies: {javascript: {development: ['mock-fs']}}},
      cucumberResults
    );
  }

  return {
    scripts: {},
    dependencies: {javascript: {development: ['@form8ion/core']}}
  };
}
