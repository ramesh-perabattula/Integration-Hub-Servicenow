import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Create Global Script Include that wraps our scoped IntegrationHelper
export const GlobalIntegrationHelper = Record({
    $id: Now.ID['global_integration_helper'],
    table: 'sys_script_include',
    data: {
        name: 'GlobalIntegrationHelper',
        description: 'Global wrapper for scoped IntegrationHelper - allows cross-scope usage',
        script: `var GlobalIntegrationHelper = Class.create();
GlobalIntegrationHelper.prototype = {
    initialize: function(name) {
        this.helper = new x_1842120_hubby.IntegrationHelper(name);
    },

    execute: function(action, payload) {
        return this.helper.execute(action, payload);
    },

    type: 'GlobalIntegrationHelper'
};`,
        client_callable: false,
        access: 'public',
        active: true,
        api_name: 'GlobalIntegrationHelper'
    }
});