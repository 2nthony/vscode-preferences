// TODO: composer
// TODO: sidebar chat panel

import fs from 'node:fs/promises'
import { parse } from 'jsonc-parser'
import { fixturesCursorKeybindingsPath, localPackageJsonPath } from '../../../shared/local'

interface Keybindings {
  key: string
  command: string
  when?: string
  args?: Record<string, any>
}

export async function localUpdateCursorKeybindings() {
  const cursorDefaultKeybindings = parse(
    await fs.readFile(fixturesCursorKeybindingsPath, 'utf8'),
  ) as Keybindings[]

  const allCmdRComboKeybindings = cursorDefaultKeybindings.filter((keybinding) => {
    return keybinding.key.startsWith('cmd+r ')
  })
  const allCmdKKeybindings = cursorDefaultKeybindings.filter((keybinding) => {
    return keybinding.key === 'cmd+k' || keybinding.key.endsWith('+cmd+k')
  })

  const keyChordLeaderKeybindings = [
    {
      key: 'cmd+r',
      command: '-workbench.action.keychord.leader',
      when: 'false',
    },
    {
      key: 'cmd+k',
      command: 'workbench.action.keychord.leader',
      when: 'false',
    },
  ]

  const cmdKComboKeybindings = allCmdRComboKeybindings.map((keybinding) => {
    return [
      {
        ...keybinding,
        command: `-${keybinding.command}`,
      },
      {
        ...keybinding,
        key: keybinding.key.replace('cmd+r', 'cmd+k'),
      },
    ]
  }).flat()

  const inlineChatKeybindings = allCmdKKeybindings.map((keybinding) => {
    return [
      {
        ...keybinding,
        command: `-${keybinding.command}`,
      },
      {
        ...keybinding,
        key: keybinding.key.replace('cmd+k', 'cmd+i'),
      },
    ]
  }).flat()

  const resolvedKeybindings = [
    ...keyChordLeaderKeybindings,
    ...cmdKComboKeybindings,
    ...inlineChatKeybindings,
  ]

  const localPackageJson = JSON.parse(await fs.readFile(localPackageJsonPath, 'utf8'))
  localPackageJson.contributes.keybindings = resolvedKeybindings
  await fs.writeFile(localPackageJsonPath, JSON.stringify(localPackageJson, null, 2), 'utf8')
}
