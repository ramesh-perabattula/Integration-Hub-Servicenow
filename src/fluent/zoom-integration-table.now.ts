import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn } from '@servicenow/sdk/core'

export const x_1842120_hubby_u_zoom_integration = Table({
    name: 'x_1842120_hubby_u_zoom_integration',
    label: 'Zoom Integration Hub',
    schema: {
        u_name: StringColumn({ 
            label: 'Integration Name', 
            mandatory: true,
            maxLength: 100
        }),
        u_client_id: StringColumn({ 
            label: 'Zoom Client ID',
            maxLength: 100
        }),
        u_client_secret: StringColumn({ 
            label: 'Zoom Client Secret',
            maxLength: 255,
            attributes: {
                password2: true
            }
        }),
        u_methods: StringColumn({ 
            label: 'HTTP Methods',
            maxLength: 255
        }),
        u_rest_message_name: StringColumn({ 
            label: 'REST Message Name',
            maxLength: 100
        }),
        u_status: ChoiceColumn({
            label: 'Status',
            choices: {
                active: { label: 'Active', sequence: 0 },
                inactive: { label: 'Inactive', sequence: 1 }
            },
            dropdown: 'dropdown_with_none',
            default: 'active'
        }),
    },
    auto_number: {
        prefix: 'ZI',
        number: 1000,
        number_of_digits: 7,
    },
    display: 'u_name',
    extensible: true,
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    accessible_from: 'public',
    caller_access: 'tracking',
})