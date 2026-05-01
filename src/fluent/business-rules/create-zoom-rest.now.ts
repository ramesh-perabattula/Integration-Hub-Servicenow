import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { createZoomREST } from '../../server/business-rules/create-zoom-rest.js'

export const createZoomRESTBusinessRule = BusinessRule({
    $id: Now.ID['create_zoom_rest_br'],
    name: 'Create Zoom REST',
    table: 'x_1842120_hubby_u_zoom_integration',
    when: 'after',
    action: ['insert'],
    script: createZoomREST,
    order: 100,
    active: true,
    description: 'Automatically creates REST Message and HTTP Methods when a new Zoom integration is created'
});