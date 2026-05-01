import { gs, GlideRecord } from '@servicenow/glide';

export function createZoomREST(current, previous) {
    try {
        const name = current.getValue('u_name');
        const integrationType = current.getValue('u_integration_type') || 'zoom'; // Default to zoom for backwards compatibility
        
        if (!name) {
            gs.error('No name provided for integration');
            return;
        }

        // Handle different integration types
        switch (integrationType) {
            case 'zoom':
                createZoomIntegration(current, name);
                break;
            case 'slack':
                createSlackIntegration(current, name);
                break;
            case 'jira':
                createJiraIntegration(current, name);
                break;
            case 'twilio':
                createTwilioIntegration(current, name);
                break;
            case 'postman':
                createPostmanIntegration(current, name);
                break;
            default:
                gs.error('Unsupported integration type: ' + integrationType);
                return;
        }
        
    } catch (error) {
        gs.error('Error creating integration: ' + error.getMessage());
    }
}

// ============================================================
// ZOOM INTEGRATION (EXTENDED — backward compatible)
// ============================================================
function createZoomIntegration(current, name) {
    const methods = current.getValue('u_methods');
    const restMessageName = 'ZOOM_' + name;
    
    // Check if REST Message already exists
    const existingRestMsg = new GlideRecord('sys_rest_message');
    existingRestMsg.addQuery('name', restMessageName);
    existingRestMsg.query();
    
    if (existingRestMsg.next()) {
        gs.info('REST Message ' + restMessageName + ' already exists - skipping creation');
        return;
    }

    // Create OAuth profile for Zoom
    var authManager = new UniversalAuthManager();
    var oauthProfileSysId = authManager.createOAuthProfile(current);

    // Create REST Message with OAuth2 authentication
    const restMessage = new GlideRecord('sys_rest_message');
    restMessage.initialize();
    restMessage.setValue('name', restMessageName);
    restMessage.setValue('endpoint', 'https://api.zoom.us/v2');
    restMessage.setValue('authentication_type', 'oauth2');
    restMessage.setValue('description', 'Zoom API integration for ' + name);
    
    // Link OAuth profile if created successfully
    if (oauthProfileSysId) {
        restMessage.setValue('oauth2_profile', oauthProfileSysId);
    }
    
    const restMessageSysId = restMessage.insert();
    gs.info('Created REST Message: ' + restMessageName);

    // Parse methods and create HTTP methods with FULL configuration
    if (methods) {
        const methodList = methods.split(',');
        
        methodList.forEach(function(method) {
            const trimmedMethod = method.trim().toUpperCase();
            
            switch (trimmedMethod) {
                case 'POST':
                    createHttpMethod(
                        restMessageSysId,
                        'create_meeting',
                        'POST',
                        '/users/me/meetings',
                        {},  // No extra headers — OAuth handles auth
                        JSON.stringify({
                            "topic": "${topic}",
                            "type": 2,
                            "duration": "${duration}"
                        }, null, 2),
                        'application/json'
                    );
                    break;
                case 'GET':
                    createHttpMethod(
                        restMessageSysId,
                        'get_meeting',
                        'GET',
                        '/meetings/${meetingId}',
                        {},
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
                        {},
                        JSON.stringify({
                            "topic": "${topic}",
                            "duration": "${duration}"
                        }, null, 2),
                        'application/json'
                    );
                    break;
                case 'DELETE':
                    createHttpMethod(
                        restMessageSysId,
                        'delete_meeting',
                        'DELETE',
                        '/meetings/${meetingId}',
                        {},
                        '',
                        'application/json'
                    );
                    break;
            }
        });
    } else {
        // If no methods specified, create default POST (create_meeting)
        createHttpMethod(
            restMessageSysId,
            'create_meeting',
            'POST',
            '/users/me/meetings',
            {},
            JSON.stringify({
                "topic": "${topic}",
                "type": 2,
                "duration": "${duration}"
            }, null, 2),
            'application/json'
        );
    }

    // Update the integration record with REST message name
    current.setValue('u_rest_message_name', restMessageName);
}

// ============================================================
// SLACK INTEGRATION
// ============================================================
function createSlackIntegration(current, name) {
    const restMessageName = 'SLACK_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    const restMessageSysId = createRestMessage(
        restMessageName,
        'https://slack.com/api',
        'Slack API integration for ' + name,
        'no_authentication'
    );

    // send_message with Authorization header and JSON body template
    createHttpMethod(
        restMessageSysId,
        'send_message',
        'POST',
        '/chat.postMessage',
        { 'Authorization': 'Bearer ${token}' },
        JSON.stringify({
            "channel": "${channel}",
            "text": "${text}"
        }, null, 2),
        'application/json'
    );

    current.setValue('u_rest_message_name', restMessageName);
    gs.info('Created Slack integration: ' + restMessageName);
}

// ============================================================
// JIRA INTEGRATION
// ============================================================
function createJiraIntegration(current, name) {
    const baseUrl = current.getValue('u_base_url');
    const restMessageName = 'JIRA_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    // Construct endpoint: use u_base_url if provided, otherwise placeholder
    var endpoint;
    if (baseUrl) {
        // Strip trailing slash and ensure /rest/api/3 is appended
        var cleanBase = baseUrl.replace(/\/+$/, '');
        if (cleanBase.indexOf('/rest/api/3') === -1) {
            endpoint = cleanBase + '/rest/api/3';
        } else {
            endpoint = cleanBase;
        }
    } else {
        endpoint = 'https://your-domain.atlassian.net/rest/api/3';
    }

    const restMessageSysId = createRestMessage(
        restMessageName,
        endpoint,
        'Jira API integration for ' + name,
        'no_authentication'
    );
    
    // create_issue with full Jira issue body template
    createHttpMethod(
        restMessageSysId,
        'create_issue',
        'POST',
        '/issue',
        {},
        JSON.stringify({
            "fields": {
                "project": {
                    "key": "${project}"
                },
                "summary": "${summary}",
                "description": "${description}",
                "issuetype": {
                    "name": "Task"
                }
            }
        }, null, 2),
        'application/json'
    );

    // get_issue
    createHttpMethod(
        restMessageSysId,
        'get_issue',
        'GET',
        '/issue/${issueId}',
        {},
        '',
        'application/json'
    );
    
    current.setValue('u_rest_message_name', restMessageName);
    gs.info('Created Jira integration: ' + restMessageName);
}

// ============================================================
// TWILIO INTEGRATION
// ============================================================
function createTwilioIntegration(current, name) {
    const restMessageName = 'TWILIO_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    const restMessageSysId = createRestMessage(
        restMessageName,
        'https://api.twilio.com/2010-04-01',
        'Twilio API integration for ' + name,
        'no_authentication'
    );

    // send_sms with form-urlencoded body
    createHttpMethod(
        restMessageSysId,
        'send_sms',
        'POST',
        '/Accounts/${AccountSID}/Messages.json',
        {},
        'From=${from}&To=${to}&Body=${message}',
        'application/x-www-form-urlencoded'
    );

    current.setValue('u_rest_message_name', restMessageName);
    gs.info('Created Twilio integration: ' + restMessageName);
}

// ============================================================
// POSTMAN INTEGRATION
// ============================================================
function createPostmanIntegration(current, name) {
    const restMessageName = 'POSTMAN_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    const restMessageSysId = createRestMessage(
        restMessageName,
        'https://api.getpostman.com',
        'Postman API integration for ' + name,
        'no_authentication'
    );

    // list_collections — GET, no body needed
    createHttpMethod(
        restMessageSysId,
        'list_collections',
        'GET',
        '/collections',
        { 'X-Api-Key': '${apiKey}' },
        '',
        'application/json'
    );

    current.setValue('u_rest_message_name', restMessageName);
    gs.info('Created Postman integration: ' + restMessageName);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Checks if a REST Message with the given name already exists.
 * @returns {boolean} true if exists, false otherwise
 */
function checkExistingRestMessage(restMessageName) {
    const existingRestMsg = new GlideRecord('sys_rest_message');
    existingRestMsg.addQuery('name', restMessageName);
    existingRestMsg.query();
    
    if (existingRestMsg.next()) {
        gs.info('REST Message ' + restMessageName + ' already exists - skipping creation');
        return true;
    }
    return false;
}

/**
 * Creates a REST Message record with the specified authentication type.
 * @param {string} name - REST message name
 * @param {string} endpoint - Base URL endpoint
 * @param {string} description - Description text
 * @param {string} authType - authentication_type: 'oauth2', 'basic', or 'no_authentication'
 * @returns {string} sys_id of the created REST message
 */
function createRestMessage(name, endpoint, description, authType) {
    const restMessage = new GlideRecord('sys_rest_message');
    restMessage.initialize();
    restMessage.setValue('name', name);
    restMessage.setValue('endpoint', endpoint);
    restMessage.setValue('authentication_type', authType || 'no_authentication');
    restMessage.setValue('description', description);
    const restMessageSysId = restMessage.insert();
    
    gs.info('Created REST Message: ' + name + ' (auth: ' + (authType || 'no_authentication') + ')');
    return restMessageSysId;
}

/**
 * Creates an HTTP Method (sys_rest_message_fn) with full configuration:
 * headers, body template, and content type.
 *
 * @param {string} restMessageSysId - Parent REST message sys_id
 * @param {string} methodName - Function name (e.g., 'create_meeting')
 * @param {string} httpMethod - HTTP verb (GET, POST, PATCH, DELETE)
 * @param {string} endpoint - Relative endpoint path
 * @param {object} headers - Key-value pairs of additional headers
 * @param {string} bodyTemplate - Request body template string
 * @param {string} contentType - Content-Type header value
 */
function createHttpMethod(restMessageSysId, methodName, httpMethod, endpoint, headers, bodyTemplate, contentType) {
    const httpMethodRecord = new GlideRecord('sys_rest_message_fn');
    httpMethodRecord.initialize();
    httpMethodRecord.setValue('rest_message', restMessageSysId);
    httpMethodRecord.setValue('function_name', methodName);
    httpMethodRecord.setValue('http_method', httpMethod);
    httpMethodRecord.setValue('rest_endpoint', endpoint);
    
    // Set body template (eliminates "unpopulated mandatory fields" warning)
    if (bodyTemplate) {
        httpMethodRecord.setValue('content', bodyTemplate);
    }
    
    const httpMethodSysId = httpMethodRecord.insert();
    
    // Create Content-Type header
    if (contentType) {
        createHttpHeader(httpMethodSysId, 'Content-Type', contentType);
    }
    
    // Create additional headers
    if (headers) {
        for (var headerName in headers) {
            if (headers.hasOwnProperty(headerName)) {
                createHttpHeader(httpMethodSysId, headerName, headers[headerName]);
            }
        }
    }
    
    gs.info('Created HTTP Method: ' + methodName + ' (' + httpMethod + ') with headers and body template');
}

/**
 * Creates an HTTP header record (sys_rest_message_fn_headers) for an HTTP method.
 *
 * @param {string} httpMethodSysId - Parent HTTP method sys_id
 * @param {string} headerName - Header name (e.g., 'Content-Type')
 * @param {string} headerValue - Header value (e.g., 'application/json')
 */
function createHttpHeader(httpMethodSysId, headerName, headerValue) {
    var header = new GlideRecord('sys_rest_message_fn_headers');
    header.initialize();
    header.setValue('rest_message_fn', httpMethodSysId);
    header.setValue('name', headerName);
    header.setValue('value', headerValue);
    header.insert();
    
    gs.info('Created HTTP Header: ' + headerName + ' = ' + headerValue);
}