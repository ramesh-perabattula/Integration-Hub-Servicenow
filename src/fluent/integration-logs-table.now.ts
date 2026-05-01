import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, IntegerColumn } from '@servicenow/sdk/core'

export const x_1842120_hubby_u_integration_logs = Table({
    name: 'x_1842120_hubby_u_integration_logs',
    label: 'Integration Logs',
    schema: {
        u_integration_name: StringColumn({ 
            label: 'Integration Name', 
            maxLength: 100
        }),
        u_integration_type: StringColumn({ 
            label: 'Integration Type',
            maxLength: 50
        }),
        u_action: StringColumn({ 
            label: 'Action',
            maxLength: 100
        }),
        u_request: StringColumn({ 
            label: 'Request',
            maxLength: 4000
        }),
        u_response: StringColumn({ 
            label: 'Response',
            maxLength: 4000
        }),
        u_status: ChoiceColumn({
            label: 'Status',
            choices: {
                success: { label: 'Success', sequence: 0 },
                failure: { label: 'Failure', sequence: 1 }
            },
            dropdown: 'dropdown_with_none'
        }),
        u_error_message: StringColumn({ 
            label: 'Error Message',
            maxLength: 1000
        }),
        u_execution_time: IntegerColumn({ 
            label: 'Execution Time (ms)'
        }),
    },
    auto_number: {
        prefix: 'LOG',
        number: 1000,
        number_of_digits: 7,
    },
    display: 'u_integration_name',
    extensible: true,
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    accessible_from: 'public',
    caller_access: 'tracking',
})