// #### Import
// remark-usage-ignore-next 2
import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import {scaffold} from './lib/index.js';

// remark-usage-ignore-next 5
stubbedFs({
  node_modules: stubbedFs.load(resolve(...[__dirname, 'node_modules'])),
  templates: stubbedFs.load(resolve(...[__dirname, 'templates'])),
  'package.json': JSON.stringify({})
});

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd(), packageName: 'foo', tests: {integration: true}});
})();
