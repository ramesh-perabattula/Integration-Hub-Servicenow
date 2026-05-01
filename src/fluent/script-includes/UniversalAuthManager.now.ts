import '@servicenow/sdk/global';
import { ScriptInclude } from '@servicenow/sdk/core';

export const UniversalAuthManager = ScriptInclude({
    $id: Now.ID['UniversalAuthManager'],
    name: 'UniversalAuthManager',
    script: Now.include('../../server/script-includes/UniversalAuthManager.js'),
    description: 'Manages authentication headers for different integration types',
    clientCallable: true,
    accessibleFrom: 'public',  // Changed to 'public' for cross-scope access
    callerAccess: 'tracking',   // Enable cross-scope tracking
    active: true,
});