import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'
import { AiAssistantHelper } from '../../server/script-includes/AiAssistantHelper.js'

export const AiAssistantHelperScriptInclude = ScriptInclude({
    $id: Now.ID['ai_assistant_helper'],
    name: 'AiAssistantHelper',
    script: AiAssistantHelper,
    clientCallable: true,
    description: 'Ajax helper for the Floating AI Assistant to call Gemini REST Message'
})
