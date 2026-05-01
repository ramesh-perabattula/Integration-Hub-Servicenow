import '@servicenow/sdk/global';
import { ScriptInclude } from '@servicenow/sdk/core';

export const IntegrationHelper = ScriptInclude({
    $id: Now.ID['IntegrationHelper'],
    name: 'IntegrationHelper',
    script: Now.include('../../server/script-includes/ZoomIntegrationHelper.js'),
    description: 'Universal helper class for executing integration REST API calls across multiple platforms',
    clientCallable: true,
    accessibleFrom: 'public',  // Changed to 'public' for cross-scope access
    callerAccess: 'tracking',   // Enable cross-scope tracking
    active: true,
});