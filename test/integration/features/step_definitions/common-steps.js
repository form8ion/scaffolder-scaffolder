// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {scaffold} from '@form8ion/scaffolder-scaffolder';
import {When} from 'cucumber';

When('the project is scaffolded', async function () {
  await scaffold();
});
