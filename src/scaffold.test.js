import deepmerge from 'deepmerge';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as integrationTesting from './integration-testing';
import scaffold from './scaffold';

vi.mock('node:fs');
vi.mock('../thirdparty-wrappers/make-dir');
vi.mock('./integration-testing');

describe('scaffold', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the form8ion plugin', async () => {
    const integrationTestingResults = any.simpleObject();
    const pathToCreatedSrcDirectory = any.string();
    const tests = {integration: any.boolean()};
    const projectRoot = any.string();
    const packageName = any.word();
    when(integrationTesting.default)
      .calledWith({projectRoot, packageName, tests})
      .mockResolvedValue(integrationTestingResults);
    when(mkdir.default).calledWith(`${projectRoot}/src`).mockResolvedValue(pathToCreatedSrcDirectory);

    expect(await scaffold({projectRoot, tests, packageName}))
      .toEqual(deepmerge({devDependencies: ['mock-fs'], scripts: {}}, integrationTestingResults));
  });
});
