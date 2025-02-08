import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import deepmerge from 'deepmerge';
import * as mkdir from 'make-dir';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffoldIntegrationTesting from './integration-testing.js';
import scaffoldDocumentation from './documentation.js';
import scaffold from './scaffold.js';

vi.mock('node:fs');
vi.mock('make-dir');
vi.mock('./integration-testing.js');
vi.mock('./documentation.js');

describe('scaffold', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the form8ion plugin', async () => {
    const integrationTestingResults = any.simpleObject();
    const documentationResults = any.simpleObject();
    const pathToCreatedSrcDirectory = any.string();
    const tests = {integration: any.boolean()};
    const projectRoot = any.string();
    const packageName = any.word();
    const projectName = any.word();
    const dialect = any.word();
    when(scaffoldIntegrationTesting)
      .calledWith({projectRoot, projectName, packageName, tests, dialect})
      .mockResolvedValue(integrationTestingResults);
    when(scaffoldDocumentation).calledWith({projectRoot}).mockResolvedValue(documentationResults);
    when(mkdir.default).calledWith(`${projectRoot}/src`).mockResolvedValue(pathToCreatedSrcDirectory);

    expect(await scaffold({projectRoot, tests, projectName, packageName, dialect}))
      .toEqual(deepmerge(integrationTestingResults, documentationResults));
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${pathToCreatedSrcDirectory}/index.js`,
      "export {default as scaffold} from './scaffolder.js';\n"
    );
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve('templates/scaffolder.js'),
      `${pathToCreatedSrcDirectory}/scaffolder.js`
    );
  });
});
