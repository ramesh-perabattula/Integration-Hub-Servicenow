import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

// Main application menu
const zoomHubMenu = ApplicationMenu({
    $id: Now.ID['zoom_hub_menu'],
    title: 'Zoom Integration Hub',
    hint: 'Zoom Meeting Integration Hub',
    description: 'Create and manage Zoom meeting integrations with OAuth 2.0',
    active: true,
    order: 100,
})

// Separator
const integrationsSubMenu = Record({
    $id: Now.ID['integrations_separator'],
    table: 'sys_app_module',
    data: {
        title: 'Integrations',
        application: zoomHubMenu,
        link_type: 'SEPARATOR',
        active: true,
        order: 100,
    },
})

// List view module
const zoomIntegrationListModule = Record({
    $id: Now.ID['zoom_integration_list_module'],
    table: 'sys_app_module',
    data: {
        title: 'All Integrations',
        application: zoomHubMenu,
        link_type: 'LIST',
        name: 'x_1842120_hubby_u_zoom_integration',
        hint: 'View and manage Zoom integrations',
        active: true,
        order: 200,
    },
})

// Integration Logs module
const integrationLogsModule = Record({
    $id: Now.ID['integration_logs_module'],
    table: 'sys_app_module',
    data: {
        title: 'Execution Logs',
        application: zoomHubMenu,
        link_type: 'LIST',
        name: 'x_1842120_hubby_u_integration_logs',
        hint: 'View integration execution logs',
        active: true,
        order: 300,
    },
})

export { zoomHubMenu, integrationsSubMenu, zoomIntegrationListModule, integrationLogsModule }