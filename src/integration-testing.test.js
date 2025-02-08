import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import * as mkdir from 'make-dir';
import {dialects} from '@form8ion/javascript-core';
import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';

import {describe, it, expect, vi, afterEach, beforeEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffold from './integration-testing.js';

vi.mock('node:fs');
vi.mock('mustache');
vi.mock('@form8ion/cucumber-scaffolder');
vi.mock('make-dir');

describe('integration tests', () => {
  const projectRoot = any.string();
  const packageName = any.word();
  const projectName = any.word();
  const pathToCreatedFeaturesDirectory = any.string();
  const pathToCreatedStepsDirectory = any.string();
  const commonStepsTemplateContent = any.string();
  const commonStepsContent = any.string();
  const form8ionStepsTemplateContent = any.string();
  const form8ionStepsContent = any.string();
  const form8ionFeatureTemplateContent = any.string();
  const form8ionFeatureContent = any.string();

  beforeEach(() => {
    when(mkdir.default)
      .calledWith(`${projectRoot}/test/integration/features`)
      .mockResolvedValue(pathToCreatedFeaturesDirectory);
    when(mkdir.default)
      .calledWith(`${pathToCreatedFeaturesDirectory}/step_definitions`)
      .mockResolvedValue(pathToCreatedStepsDirectory);
    when(fs.readFile)
      .calledWith(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8')
      .mockResolvedValue(commonStepsTemplateContent);
    when(mustache.render).calledWith(commonStepsTemplateContent, {packageName}).mockReturnValue(commonStepsContent);
    when(fs.readFile)
      .calledWith(resolve(__dirname, '..', 'templates', 'form8ion-steps.mustache'), 'utf8')
      .mockResolvedValue(form8ionStepsTemplateContent);
    when(mustache.render)
      .calledWith(form8ionStepsTemplateContent, {packageName, projectName})
      .mockReturnValue(form8ionStepsContent);
    when(fs.readFile)
      .calledWith(resolve(__dirname, '..', 'templates', 'form8ion-feature.mustache'), 'utf8')
      .mockResolvedValue(form8ionFeatureTemplateContent);
    when(mustache.render)
      .calledWith(form8ionFeatureTemplateContent, {projectName})
      .mockReturnValue(form8ionFeatureContent);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should configure cucumber when the project should be integration tested', async () => {
    const cucumberResults = any.simpleObject();
    when(cucumberScaffolder.scaffold).calledWith({projectRoot}).mockResolvedValue(cucumberResults);

    expect(await scaffold({projectRoot, projectName, packageName, tests: {integration: true}, dialect: dialects.BABEL}))
      .toEqual(deepmerge(
        {scripts: {'pretest:integration:base': 'run-s build'}, dependencies: {javascript: {development: ['mock-fs']}}},
        cucumberResults
      ));
    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedStepsDirectory}/common-steps.mjs`, commonStepsContent);
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${pathToCreatedStepsDirectory}/form8ion-steps.mjs`,
      form8ionStepsContent
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${pathToCreatedFeaturesDirectory}/form8ion.feature`,
      form8ionFeatureContent
    );
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'scaffold.feature'),
      `${pathToCreatedFeaturesDirectory}/scaffold.feature`
    );
  });

  it('should use a `.js` extension for step definitions when the dialect is `esm`', async () => {
    await scaffold({projectRoot, projectName, packageName, tests: {integration: true}, dialect: dialects.ESM});

    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedStepsDirectory}/common-steps.js`, commonStepsContent);
    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedStepsDirectory}/form8ion-steps.js`, form8ionStepsContent);
  });

  it('should not configure cucumber when the project should not be integration tested', async () => {
    expect(await scaffold({tests: {integration: false}})).toEqual({scripts: {}});
  });
});
