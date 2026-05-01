var IntegrationHelper = Class.create();
IntegrationHelper.prototype = {
    initialize: function(name) {
        this.integrationRecord = null;
        this.restMessageName = null;
        this.integrationName = name;

        if (name) {
            var gr = new GlideRecord('x_1842120_hubby_u_zoom_integration');
            gr.addQuery('u_name', name);
            gr.query();

            if (gr.next()) {
                this.integrationRecord = gr;
                this.restMessageName = gr.getValue('u_rest_message_name');
            } else {
                throw new Error('Integration "' + name + '" not found in table');
            }
        }
    },

    /**
     * Execute a Zoom API action.
     * @param {string} action - create_meeting | get_meeting | update_meeting | delete_meeting
     * @param {object} payload - { topic, duration, meetingId }
     */
    execute: function(action, payload) {
        var startTime = new Date().getTime();
        var responseBody = null;
        var errorMessage = null;
        var status = 'success';
        var requestData = null;

        try {
            if (!this.restMessageName) {
                throw new Error('REST Message name is empty. Please check the integration record field u_rest_message_name.');
            }

            // Validate
            if (!payload) payload = {};
            if (action === 'create_meeting' && !payload.topic) {
                throw new Error('Missing required field: topic');
            }
            if ((action === 'get_meeting' || action === 'delete_meeting') && !payload.meetingId) {
                throw new Error('Missing required field: meetingId');
            }

            // Map action
            var methodName = action; // method names match action names
            var validActions = ['create_meeting', 'get_meeting', 'update_meeting', 'delete_meeting'];
            var isValid = false;
            for (var i = 0; i < validActions.length; i++) {
                if (validActions[i] === action) { isValid = true; break; }
            }
            if (!isValid) {
                throw new Error('Invalid action: "' + action + '". Use: create_meeting, get_meeting, update_meeting, delete_meeting');
            }

            // Build REST call
            var restMessage = new sn_ws.RESTMessageV2(this.restMessageName, methodName);
            restMessage.setHttpTimeout(30000);
            restMessage.setRequestHeader('Content-Type', 'application/json');

            // Set template variables
            if (payload.topic) restMessage.setStringParameterNoEscape('topic', payload.topic);
            if (payload.duration) restMessage.setStringParameterNoEscape('duration', String(payload.duration));
            if (payload.meetingId) restMessage.setStringParameterNoEscape('meetingId', String(payload.meetingId));

            // Set body for POST/PATCH
            if (action === 'create_meeting') {
                restMessage.setRequestBody(JSON.stringify({
                    topic: payload.topic,
                    type: 2,
                    duration: payload.duration || 60
                }));
            } else if (action === 'update_meeting') {
                restMessage.setRequestBody(JSON.stringify({
                    topic: payload.topic || '',
                    duration: payload.duration || 60
                }));
            }

            // Execute
            var response = restMessage.execute();
            responseBody = response.getBody();
            var statusCode = response.getStatusCode();

            if (statusCode < 200 || statusCode >= 300) {
                throw new Error('HTTP ' + statusCode + ': ' + responseBody);
            }

            gs.info('IntegrationHelper: ' + action + ' succeeded (HTTP ' + statusCode + ')');

        } catch (error) {
            status = 'failure';
            errorMessage = (error.getMessage ? error.getMessage() : error.message) || String(error);
            responseBody = 'Error: ' + errorMessage;
        }

        // Log
        this._logExecution(action, status, errorMessage, new Date().getTime() - startTime);

        return responseBody;
    },

    _logExecution: function(action, status, errorMessage, executionTime) {
        try {
            var log = new GlideRecord('x_1842120_hubby_u_integration_logs');
            log.initialize();
            log.setValue('u_integration_name', this.integrationName || '');
            log.setValue('u_integration_type', 'zoom');
            log.setValue('u_action', action || '');
            log.setValue('u_status', status || '');
            log.setValue('u_execution_time', executionTime || 0);
            if (errorMessage) {
                log.setValue('u_error_message', String(errorMessage).substring(0, 999));
            }
            log.insert();
        } catch (e) {
            gs.error('IntegrationHelper: Log failed — ' + ((e.getMessage ? e.getMessage() : e.message) || String(e)));
        }
    },

    type: 'IntegrationHelper'
};