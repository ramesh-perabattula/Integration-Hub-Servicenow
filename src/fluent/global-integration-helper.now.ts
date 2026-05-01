import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Global Script Include wrapper — allows cross-scope usage of IntegrationHelper
export const GlobalIntegrationHelper = Record({
    $id: Now.ID['global_integration_helper'],
    table: 'sys_script_include',
    data: {
        name: 'GlobalIntegrationHelper',
        description: 'Global wrapper for scoped IntegrationHelper — enables cross-scope Zoom integration execution',
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