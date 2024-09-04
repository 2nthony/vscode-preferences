import fs from 'node:fs/promises'
import { localPackageJsonPath } from '../utils'
import { resolveCursorKeybindings } from '../../../src/utils/cursor/keybindings'

export async function localUpdateCursorKeybindings() {
  const resolvedKeybindings = await resolveCursorKeybindings({
    changeInlineEditToCmdI: true,
    changeChatToCtrlCmdI: false,
  })

  const localPackageJson = JSON.parse(await fs.readFile(localPackageJsonPath, 'utf8'))
  localPackageJson.contributes.keybindings = resolvedKeybindings
  await fs.writeFile(localPackageJsonPath, JSON.stringify(localPackageJson, null, 2), 'utf8')
}
