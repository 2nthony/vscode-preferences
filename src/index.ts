import { defineConfigs, defineExtension } from 'reactive-vscode'
import type { ScopedConfigKeyTypeMap } from './generated/meta'
import { scopedConfigs } from './generated/meta'

export const config = defineConfigs<ScopedConfigKeyTypeMap>(
  scopedConfigs.scope,
  scopedConfigs.defaults,
)

const { activate, deactivate } = defineExtension(() => {

})

export { activate, deactivate }
