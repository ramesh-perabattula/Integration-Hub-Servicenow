import { gs, GlideRecord } from '@servicenow/glide';

/**
 * Business Rule: Auto-creates Zoom REST Message + HTTP Methods
 * Fires: AFTER INSERT on x_1842120_hubby_u_zoom_integration
 *
 * DESIGN: Completely self-contained — no external script include calls.
 * This avoids scoped app resolution issues with UniversalAuthManager.
 */
export function createZoomREST(current, previous) {
    try {
        var name = current.getValue('u_name');
        if (!name) {
            gs.error('Integration Hub: No name provided');
            return;
        }

        var restMessageName = 'ZOOM_' + name;
        gs.info('Integration Hub: Starting REST Message creation for "' + name + '"');

        // ── Step 1: Check if REST Message already exists ──
        var existingMsg = new GlideRecord('sys_rest_message');
        existingMsg.addQuery('name', restMessageName);
        existingMsg.query();
        if (existingMsg.next()) {
            gs.info('Integration Hub: REST Message "' + restMessageName + '" already exists — skipping');
            return;
        }

        // ── Step 2: Create REST Message ──
        var restMsg = new GlideRecord('sys_rest_message');
        restMsg.initialize();
        restMsg.setValue('name', restMessageName);
        restMsg.setValue('endpoint', 'https://api.zoom.us/v2');
        restMsg.setValue('description', 'Zoom API — auto-created by Integration Hub for "' + name + '"');
        var restMsgId = restMsg.insert();

        if (!restMsgId) {
            gs.error('Integration Hub: Failed to insert REST Message for "' + name + '"');
            return;
        }
        gs.info('Integration Hub: Created REST Message "' + restMessageName + '" (sys_id: ' + restMsgId + ')');

        // Helper function (defined inside to ensure SDK bundles it correctly)
        function _createMethod(funcName, httpMethod, endpoint, bodyTemplate) {
            var method = new GlideRecord('sys_rest_message_fn');
            method.initialize();
            method.setValue('rest_message', restMsgId);
            method.setValue('function_name', funcName);
            method.setValue('http_method', httpMethod);
            method.setValue('rest_endpoint', endpoint);
            if (bodyTemplate) {
                method.setValue('content', bodyTemplate);
            }
            var methodId = method.insert();

            if (methodId) {
                var header = new GlideRecord('sys_rest_message_fn_headers');
                header.initialize();
                header.setValue('rest_message_fn', methodId);
                header.setValue('name', 'Content-Type');
                header.setValue('value', 'application/json');
                header.insert();
                gs.info('Integration Hub: Created method ' + funcName + ' (' + httpMethod + ')');
            }
        }

        // ── Step 3: Create HTTP Methods ──
        var methods = current.getValue('u_methods') || 'POST,GET,PATCH,DELETE';
        var parts = methods.split(',');

        for (var i = 0; i < parts.length; i++) {
            var verb = parts[i].trim().toUpperCase();
            if (!verb) continue;

            switch (verb) {
                case 'POST':
                    _createMethod('create_meeting', 'POST', '/users/me/meetings',
                        '{\n  "topic": "${topic}",\n  "type": 2,\n  "duration": "${duration}"\n}');
                    break;
                case 'GET':
                    _createMethod('get_meeting', 'GET', '/meetings/${meetingId}', '');
                    break;
                case 'PATCH':
                    _createMethod('update_meeting', 'PATCH', '/meetings/${meetingId}',
                        '{\n  "topic": "${topic}",\n  "duration": "${duration}"\n}');
                    break;
                case 'DELETE':
                    _createMethod('delete_meeting', 'DELETE', '/meetings/${meetingId}', '');
                    break;
            }
        }

        gs.info('Integration Hub: Zoom integration "' + name + '" created successfully');

    } catch (err) {
        gs.error('Integration Hub: ' + ((err.getMessage ? err.getMessage() : err.message) || String(err)));
    }
}