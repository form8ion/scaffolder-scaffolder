import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';

import {describe, it, expect, vi, afterEach} from 'vitest';
import any from '@travi/any';

import scaffoldDocumentation from './documentation.js';

vi.mock('node:fs');

describe('documentation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should generate the example file', async () => {
    const projectRoot = any.string();

    await scaffoldDocumentation({projectRoot});

    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'example.js'),
      `${projectRoot}/example.js`
    );
  });
});
