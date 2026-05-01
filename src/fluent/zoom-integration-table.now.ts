import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn } from '@servicenow/sdk/core'

// IMPORTANT: The exported constant name MUST match the name property value
export const x_1842120_hubby_u_zoom_integration = Table({
    name: 'x_1842120_hubby_u_zoom_integration',
    label: 'Integration Hub',
    schema: {
        // EXISTING FIELDS (DO NOT MODIFY - ZOOM COMPATIBILITY)
        u_name: StringColumn({ 
            label: 'Name', 
            mandatory: true,
            maxLength: 100
        }),
        u_client_id: StringColumn({ 
            label: 'Client ID',
            maxLength: 100
        }),
        u_client_secret: StringColumn({ 
            label: 'Client Secret',
            maxLength: 255,
            attributes: {
                password2: true
            }
        }),
        u_methods: StringColumn({ 
            label: 'Methods',
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
        
        // NEW FIELDS (ADDED FOR MULTI-INTEGRATION SUPPORT)
        u_integration_type: ChoiceColumn({
            label: 'Integration Type',
            choices: {
                zoom: { label: 'Zoom', sequence: 0 },
                slack: { label: 'Slack', sequence: 1 },
                jira: { label: 'Jira', sequence: 2 },
                twilio: { label: 'Twilio', sequence: 3 },
                postman: { label: 'Postman', sequence: 4 }
            },
            dropdown: 'dropdown_with_none',
            default: 'zoom'
        }),
        u_api_key: StringColumn({ 
            label: 'API Key',
            maxLength: 255,
            attributes: {
                password2: true
            }
        }),
        u_base_url: StringColumn({ 
            label: 'Base URL',
            maxLength: 255
        }),
        u_project_key: StringColumn({ 
            label: 'Project Key',
            maxLength: 100
        }),
        u_default_channel: StringColumn({ 
            label: 'Default Channel',
            maxLength: 100
        }),
        u_account_sid: StringColumn({ 
            label: 'Account SID',
            maxLength: 100
        }),
        u_auth_token: StringColumn({ 
            label: 'Auth Token',
            maxLength: 255,
            attributes: {
                password2: true
            }
        }),
        u_phone_number: StringColumn({ 
            label: 'Phone Number',
            maxLength: 50
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