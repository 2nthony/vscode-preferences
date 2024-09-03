import path from 'node:path'

export const localPackageJsonPath = path.resolve(__dirname, '..', 'package.json')

export const fixturesCursorKeybindingsPath = path.resolve(
  __dirname,
  '..',
  'fixtures',
  'cursor-default-keybindings.json',
)
