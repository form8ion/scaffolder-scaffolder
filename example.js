// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {dialects} from '@form8ion/javascript-core';
import {scaffold} from './lib/index.mjs';

// remark-usage-ignore-next 5
stubbedFs({
  node_modules: stubbedFs.load('node_modules'),
  templates: stubbedFs.load('templates'),
  'package.json': JSON.stringify({})
});

// #### Execute

(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    projectName: 'bar',
    packageName: '@foo/bar',
    tests: {integration: true},
    dialect: dialects.ESM
  });
})();
