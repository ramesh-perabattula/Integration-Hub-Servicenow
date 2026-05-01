import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

// Create the main "Zoom Hub" application menu
const zoomHubMenu = ApplicationMenu({
    $id: Now.ID['zoom_hub_menu'],
    title: 'Zoom Hub',
    hint: 'Zoom Integration Hub application',
    description: 'Manage Zoom integrations and configurations',
    active: true,
    order: 100,
})

// Create "Integrations" separator/folder
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

// Create module for the Zoom Integration table list view
const zoomIntegrationListModule = Record({
    $id: Now.ID['zoom_integration_list_module'],
    table: 'sys_app_module',
    data: {
        title: 'List view',
        application: zoomHubMenu,
        link_type: 'LIST',
        name: 'x_1842120_hubby_u_zoom_integration',
        hint: 'View and manage Zoom integrations',
        active: true,
        order: 200,
    },
})

export { zoomHubMenu, integrationsSubMenu, zoomIntegrationListModule }