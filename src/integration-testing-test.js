import {assert} from 'chai';
import scaffold from './integration-testing';

suite('integration tests', () => {
  test('that the cucumber is configured when the project should be integration tested', async () => {
    assert.deepEqual(
      await scaffold({testing: {integration: true}}),
      {scripts: {'pretest:integration': 'preview'}, devDependencies: ['package-preview']}
    );
  });

  test('that the cucumber is not configured when the project should not be integration tested', async () => {
    assert.deepEqual(await scaffold({testing: {integration: false}}), {});
  });
});
