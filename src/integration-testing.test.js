import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as mkdir from '../thirdparty-wrappers/make-dir';
import scaffold from './integration-testing';

vi.mock('node:fs');
vi.mock('mustache');
vi.mock('@form8ion/cucumber-scaffolder');
vi.mock('../thirdparty-wrappers/make-dir');

describe('integration tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should configure cucumber when the project should be integration tested', async () => {
    const projectRoot = any.string();
    const packageName = any.word();
    const cucumberResults = any.simpleObject();
    const pathToCreatedFeaturesDirectory = any.string();
    const pathToCreatedStepsDirectory = any.string();
    const templateContent = any.string();
    const commonStepsContent = any.string();
    when(cucumberScaffolder.scaffold).calledWith({projectRoot}).mockResolvedValue(cucumberResults);
    when(mkdir.default)
      .calledWith(`${projectRoot}/test/integration/features`)
      .mockResolvedValue(pathToCreatedFeaturesDirectory);
    when(mkdir.default)
      .calledWith(`${pathToCreatedFeaturesDirectory}/step_definitions`)
      .mockResolvedValue(pathToCreatedStepsDirectory);
    when(fs.readFile)
      .calledWith(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8')
      .mockResolvedValue(templateContent);
    when(mustache.render).calledWith(templateContent, {packageName}).mockReturnValue(commonStepsContent);

    expect(await scaffold({projectRoot, packageName, tests: {integration: true}})).toEqual(deepmerge(
      {scripts: {'pretest:integration:base': 'run-s build'}, devDependencies: ['mock-fs']},
      cucumberResults
    ));
    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedStepsDirectory}/common-steps.mjs`, commonStepsContent);
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'scaffolder.feature'),
      `${pathToCreatedFeaturesDirectory}/scaffolder.feature`
    );
  });

  it('should not configure cucumber when the project should not be integration tested', async () => {
    expect(await scaffold({tests: {integration: false}})).toEqual({});
  });
});
