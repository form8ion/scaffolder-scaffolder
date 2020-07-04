import scaffold from './scaffold';

suite('scaffold', () => {
  test('that the scaffolder is scaffolded', async () => {
    await scaffold();
  });
});
