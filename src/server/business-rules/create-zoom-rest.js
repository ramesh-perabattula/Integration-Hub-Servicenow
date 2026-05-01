import { gs, GlideRecord } from '@servicenow/glide';

export function createZoomREST(current, previous) {
    try {
        var name = current.getValue('u_name');

        if (!name) {
            gs.error('Integration Hub: No name provided for Zoom integration');
            return;
        }

        var restMessageName = 'ZOOM_' + name;

        // Check if REST Message already exists
        var existingRestMsg = new GlideRecord('sys_rest_message');
        existingRestMsg.addQuery('name', restMessageName);
        existingRestMsg.query();

        if (existingRestMsg.next()) {
            gs.info('REST Message ' + restMessageName + ' already exists — skipping creation');
            // Still update the record with the REST message name if missing
            if (!current.getValue('u_rest_message_name')) {
                current.setWorkflow(false);
                current.setValue('u_rest_message_name', restMessageName);
                current.update();
            }
            return;
        }

        // Create OAuth profile for Zoom
        var authManager = new UniversalAuthManager();
        var oauthProfileSysId = authManager.createOAuthProfile(current);

        // Create the REST Message with OAuth2 auth
        var restMessage = new GlideRecord('sys_rest_message');
        restMessage.initialize();
        restMessage.setValue('name', restMessageName);
        restMessage.setValue('endpoint', 'https://api.zoom.us/v2');
        restMessage.setValue('authentication_type', 'oauth2');
        restMessage.setValue('description', 'Zoom API integration for ' + name + ' — auto-created by Integration Hub');

        // Link OAuth profile if created
        if (oauthProfileSysId) {
            restMessage.setValue('oauth2_profile', oauthProfileSysId);
        }

        var restMessageSysId = restMessage.insert();

        if (!restMessageSysId) {
            gs.error('Integration Hub: Failed to create REST Message for ' + name);
            return;
        }

        gs.info('Created REST Message: ' + restMessageName);

        // Parse methods from the record
        var methods = current.getValue('u_methods');
        var methodList = [];

        if (methods) {
            var parts = methods.split(',');
            for (var i = 0; i < parts.length; i++) {
                var trimmed = parts[i].trim().toUpperCase();
                if (trimmed) {
                    methodList.push(trimmed);
                }
            }
        }

        // If no methods specified, create all 4 by default
        if (methodList.length === 0) {
            methodList = ['POST', 'GET', 'PATCH', 'DELETE'];
        }

        // Create HTTP Methods based on selected methods
        for (var m = 0; m < methodList.length; m++) {
            var httpVerb = methodList[m];

            switch (httpVerb) {
                case 'POST':
                    createHttpMethod(
                        restMessageSysId,
                        'create_meeting',
                        'POST',
                        '/users/me/meetings',
                        '{\n  "topic": "${topic}",\n  "type": 2,\n  "duration": "${duration}"\n}',
                        'application/json'
                    );
                    break;

                case 'GET':
                    createHttpMethod(
                        restMessageSysId,
                        'get_meeting',
                        'GET',
                        '/meetings/${meetingId}',
                        '',
                        'application/json'
                    );
                    break;

                case 'PATCH':
                    createHttpMethod(
                        restMessageSysId,
                        'update_meeting',
                        'PATCH',
                        '/meetings/${meetingId}',
                        '{\n  "topic": "${topic}",\n  "duration": "${duration}"\n}',
                        'application/json'
                    );
                    break;

                case 'DELETE':
                    createHttpMethod(
                        restMessageSysId,
                        'delete_meeting',
                        'DELETE',
                        '/meetings/${meetingId}',
                        '',
                        'application/json'
                    );
                    break;

                default:
                    gs.warn('Integration Hub: Unknown HTTP method: ' + httpVerb);
            }
        }

        // CRITICAL FIX: Persist the REST message name back to the record
        // setWorkflow(false) prevents this update from re-triggering business rules
        current.setWorkflow(false);
        current.setValue('u_rest_message_name', restMessageName);
        current.update();

        gs.info('Integration Hub: Successfully created Zoom integration "' + name + '" with REST Message "' + restMessageName + '"');

    } catch (error) {
        gs.error('Integration Hub: Error creating Zoom integration — ' + ((error.getMessage ? error.getMessage() : error.message) || String(error)));
    }
}

/**
 * Creates an HTTP Method record (sys_rest_message_fn) with body template and headers.
 */
function createHttpMethod(restMessageSysId, methodName, httpMethod, endpoint, bodyTemplate, contentType) {
    var httpMethodRecord = new GlideRecord('sys_rest_message_fn');
    httpMethodRecord.initialize();
    httpMethodRecord.setValue('rest_message', restMessageSysId);
    httpMethodRecord.setValue('function_name', methodName);
    httpMethodRecord.setValue('http_method', httpMethod);
    httpMethodRecord.setValue('rest_endpoint', endpoint);

    // Set body template to resolve ${variable} placeholders
    if (bodyTemplate) {
        httpMethodRecord.setValue('content', bodyTemplate);
    }

    var httpMethodSysId = httpMethodRecord.insert();

    if (!httpMethodSysId) {
        gs.error('Integration Hub: Failed to create HTTP Method: ' + methodName);
        return;
    }

    // Create Content-Type header
    if (contentType) {
        createHttpHeader(httpMethodSysId, 'Content-Type', contentType);
    }

    gs.info('Created HTTP Method: ' + methodName + ' (' + httpMethod + ')');
}

/**
 * Creates an HTTP header record for an HTTP method.
 */
function createHttpHeader(httpMethodSysId, headerName, headerValue) {
    var header = new GlideRecord('sys_rest_message_fn_headers');
    header.initialize();
    header.setValue('rest_message_fn', httpMethodSysId);
    header.setValue('name', headerName);
    header.setValue('value', headerValue);
    header.insert();
}