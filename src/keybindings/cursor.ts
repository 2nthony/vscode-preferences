import fs from 'node:fs/promises'
import path from 'node:path'
import { executeCommand, extensionContext, watch } from 'reactive-vscode'
import { window } from 'vscode'
import { config } from '..'
import { resolveCursorKeybindings } from '../utils/cursor/keybindings'

export function useCursorKeybindings() {
  const extensionPackageJsonPath = path.join(
    extensionContext.value!.extensionPath,
    'package.json',
  )

  watch(
    () => ({
      changeChatToCtrlCmdI: config.changeChatToCtrlCmdI.value,
      changeInlineEditToCmdI: config.changeInlineEditToCmdI.value,
    }),
    async (value) => {
      const resolvedKeybindings = await resolveCursorKeybindings(value)

      const extensionPackageJson = JSON.parse(await fs.readFile(extensionPackageJsonPath, 'utf8'))
      extensionPackageJson.contributes.keybindings = resolvedKeybindings
      await fs.writeFile(extensionPackageJsonPath, JSON.stringify(extensionPackageJson, null, 2), 'utf8')

      window.showInformationMessage(
        'Cursor keybindings updated. Please reload the window.',
        'Reload',
      ).then((selection) => {
        if (selection === 'Reload') {
          executeCommand('workbench.action.reloadWindow')
        }
      })
    },
  )
}
