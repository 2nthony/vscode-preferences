// TODO: composer
// TODO: sidebar chat panel
// FIXME: define keybinding
// {
//   "key": "cmd+k cmd+k",
//   "command": "editor.action.defineKeybinding",
//   "when": "resource == 'vscode-userdata:/Users/2nthony/Library/Application%20Support/Cursor/User/keybindings.json'"
// },

import cursorDefaultKeybindings from '../../fixtures/cursor-default-keybindings.json'
import type { ScopedConfigKeyTypeMap } from '../../generated/meta'

type CursorKeybindings = typeof cursorDefaultKeybindings

export async function resolveCursorKeybindings({
  changeInlineEditToCmdI,
}: Pick<ScopedConfigKeyTypeMap, 'changeChatToCtrlCmdI' | 'changeInlineEditToCmdI'>) {
  const allCmdRComboKeybindings = cursorDefaultKeybindings.filter((keybinding) => {
    return keybinding.key.startsWith('cmd+r ')
  })
  const allCmdKAiKeybindings = cursorDefaultKeybindings.filter((keybinding) => {
    return (keybinding.key === 'cmd+k'
      || keybinding.key.endsWith('+cmd+k'))
      && (keybinding.command.startsWith('aipopup')
      || keybinding.command.startsWith('composer')
      || keybinding.command.startsWith('cursorai'))
      && !keybinding.command.includes('keychord.leader')
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

  let inlineChatKeybindings: CursorKeybindings = []
  if (changeInlineEditToCmdI) {
    inlineChatKeybindings = allCmdKAiKeybindings.map((keybinding) => {
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
  }

  const resolvedKeybindings = [
    ...keyChordLeaderKeybindings,
    ...cmdKComboKeybindings,
    ...inlineChatKeybindings,
  ]

  return resolvedKeybindings
}
