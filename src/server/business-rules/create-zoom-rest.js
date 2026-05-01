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

// EXISTING ZOOM LOGIC (UNCHANGED FOR COMPATIBILITY)
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

    // Create REST Message
    const restMessage = new GlideRecord('sys_rest_message');
    restMessage.initialize();
    restMessage.setValue('name', restMessageName);
    restMessage.setValue('endpoint', 'https://api.zoom.us/v2/');
    restMessage.setValue('authentication_type', 'no_authentication');
    restMessage.setValue('description', 'Zoom API integration for ' + name);
    const restMessageSysId = restMessage.insert();
    
    gs.info('Created REST Message: ' + restMessageName);

    // Parse methods and create HTTP methods
    if (methods) {
        const methodList = methods.split(',');
        
        methodList.forEach(function(method) {
            const trimmedMethod = method.trim().toUpperCase();
            
            switch (trimmedMethod) {
                case 'POST':
                    createHttpMethod(restMessageSysId, 'create_meeting', 'POST', '/users/me/meetings');
                    break;
                case 'GET':
                    createHttpMethod(restMessageSysId, 'get_meeting', 'GET', '/meetings/${meetingId}');
                    break;
                case 'PATCH':
                    createHttpMethod(restMessageSysId, 'update_meeting', 'PATCH', '/meetings/${meetingId}');
                    break;
                case 'DELETE':
                    createHttpMethod(restMessageSysId, 'delete_meeting', 'DELETE', '/meetings/${meetingId}');
                    break;
            }
        });
    }

    // Update the integration record with REST message name
    current.setValue('u_rest_message_name', restMessageName);
}

// NEW INTEGRATION TYPES
function createSlackIntegration(current, name) {
    const restMessageName = 'SLACK_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    const restMessageSysId = createRestMessage(restMessageName, 'https://slack.com/api/', 'Slack API integration for ' + name);
    createHttpMethod(restMessageSysId, 'send_message', 'POST', '/chat.postMessage');
    current.setValue('u_rest_message_name', restMessageName);
}

function createJiraIntegration(current, name) {
    const baseUrl = current.getValue('u_base_url');
    const restMessageName = 'JIRA_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    const endpoint = baseUrl || 'https://your-domain.atlassian.net';
    const restMessageSysId = createRestMessage(restMessageName, endpoint, 'Jira API integration for ' + name);
    
    createHttpMethod(restMessageSysId, 'create_issue', 'POST', '/rest/api/3/issue');
    createHttpMethod(restMessageSysId, 'get_issue', 'GET', '/rest/api/3/issue/${issueId}');
    
    current.setValue('u_rest_message_name', restMessageName);
}

function createTwilioIntegration(current, name) {
    const restMessageName = 'TWILIO_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    const restMessageSysId = createRestMessage(restMessageName, 'https://api.twilio.com/2010-04-01/', 'Twilio API integration for ' + name);
    createHttpMethod(restMessageSysId, 'send_sms', 'POST', '/Accounts/${AccountSid}/Messages.json');
    current.setValue('u_rest_message_name', restMessageName);
}

function createPostmanIntegration(current, name) {
    const restMessageName = 'POSTMAN_' + name;
    
    if (checkExistingRestMessage(restMessageName)) {
        return;
    }

    const restMessageSysId = createRestMessage(restMessageName, 'https://api.getpostman.com/', 'Postman API integration for ' + name);
    createHttpMethod(restMessageSysId, 'list_collections', 'GET', '/collections');
    current.setValue('u_rest_message_name', restMessageName);
}

// HELPER FUNCTIONS
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

function createRestMessage(name, endpoint, description) {
    const restMessage = new GlideRecord('sys_rest_message');
    restMessage.initialize();
    restMessage.setValue('name', name);
    restMessage.setValue('endpoint', endpoint);
    restMessage.setValue('authentication_type', 'no_authentication');
    restMessage.setValue('description', description);
    const restMessageSysId = restMessage.insert();
    
    gs.info('Created REST Message: ' + name);
    return restMessageSysId;
}

function createHttpMethod(restMessageSysId, methodName, httpMethod, endpoint) {
    const httpMethodRecord = new GlideRecord('sys_rest_message_fn');
    httpMethodRecord.initialize();
    httpMethodRecord.setValue('rest_message', restMessageSysId);
    httpMethodRecord.setValue('function_name', methodName);
    httpMethodRecord.setValue('http_method', httpMethod);
    httpMethodRecord.setValue('rest_endpoint', endpoint);
    httpMethodRecord.setValue('content', '');
    httpMethodRecord.insert();
    
    gs.info('Created HTTP Method: ' + methodName + ' (' + httpMethod + ')');
}