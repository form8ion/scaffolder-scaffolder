export default function ({testing: {integration}}) {
  return {...integration && {scripts: {'pretest:integration': 'preview'}, devDependencies: ['package-preview']}};
}
