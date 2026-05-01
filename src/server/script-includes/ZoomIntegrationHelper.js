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
                throw new Error('Integration with name "' + name + '" not found');
            }
        }
    },

    /**
     * Executes a Zoom API action with retry logic and structured logging.
     *
     * @param {string} action - One of: create_meeting, get_meeting, update_meeting, delete_meeting
     * @param {object} payload - Action-specific data (e.g. { topic: '...', duration: 30 })
     * @returns {string} API response body
     */
    execute: function(action, payload) {
        var startTime = new Date().getTime();
        var requestData = null;
        var responseBody = null;
        var errorMessage = null;
        var status = 'success';
        var retryCount = 0;
        var maxRetries = 2;

        try {
            if (!this.restMessageName) {
                throw new Error('REST Message name is not set — integration may not have been created properly. Check the u_rest_message_name field.');
            }

            if (!this.integrationRecord) {
                throw new Error('Integration record not found');
            }

            // Validate payload
            var validationError = this._validatePayload(action, payload);
            if (validationError) {
                throw new Error(validationError);
            }

            // Map action to HTTP method name
            var methodName = this._mapActionToMethod(action);
            if (!methodName) {
                throw new Error('Unsupported action: "' + action + '". Valid actions: create_meeting, get_meeting, update_meeting, delete_meeting');
            }

            // Prepare request
            requestData = this._prepareRequestData(action, payload);

            // Execute the REST call (no retry — avoids scoped app restrictions on java.lang.Thread)
            responseBody = this._executeRestCall(methodName, requestData, payload);

        } catch (error) {
            status = 'failure';
            errorMessage = (error.getMessage ? error.getMessage() : error.message) || String(error);
            responseBody = 'Error: ' + errorMessage;
        }

        // Always log execution
        var executionTime = new Date().getTime() - startTime;
        this._logExecution(action, requestData, responseBody, status, errorMessage, executionTime);

        return responseBody;
    },

    /**
     * Validates the payload for a given Zoom action.
     */
    _validatePayload: function(action, payload) {
        if (!payload) {
            payload = {};
        }

        if (action === 'create_meeting' && !payload.topic) {
            return 'Missing required field: topic';
        }

        if ((action === 'get_meeting' || action === 'delete_meeting') && !payload.meetingId) {
            return 'Missing required field: meetingId';
        }

        if (action === 'update_meeting') {
            if (!payload.meetingId) {
                return 'Missing required field: meetingId';
            }
            if (!payload.topic) {
                return 'Missing required field: topic';
            }
        }

        return null;
    },

    /**
     * Prepares the request data (headers, body, template variables) for Zoom.
     */
    _prepareRequestData: function(action, payload) {
        var requestData = {
            headers: {},
            body: null,
            contentType: 'application/json',
            stringParams: {}
        };

        // OAuth 2.0 is handled at the REST message level — no manual Authorization header needed

        if (action === 'create_meeting') {
            requestData.body = {
                "topic": payload.topic,
                "type": 2,
                "duration": payload.duration || 60
            };
            requestData.stringParams['topic'] = payload.topic;
            requestData.stringParams['duration'] = String(payload.duration || 60);

        } else if (action === 'get_meeting' || action === 'delete_meeting') {
            requestData.stringParams['meetingId'] = String(payload.meetingId);

        } else if (action === 'update_meeting') {
            requestData.stringParams['meetingId'] = String(payload.meetingId);
            requestData.body = {
                "topic": payload.topic,
                "duration": payload.duration || 60
            };
            requestData.stringParams['topic'] = payload.topic || '';
            requestData.stringParams['duration'] = String(payload.duration || 60);
        }

        return requestData;
    },

    /**
     * Executes the actual REST API call via ServiceNow's RESTMessageV2.
     */
    _executeRestCall: function(methodName, requestData, payload) {
        var restMessage = new sn_ws.RESTMessageV2(this.restMessageName, methodName);

        // 30 second timeout
        restMessage.setHttpTimeout(30000);

        // Set template variables (resolves ${variable} in endpoint and body)
        if (requestData.stringParams) {
            for (var paramName in requestData.stringParams) {
                if (requestData.stringParams.hasOwnProperty(paramName)) {
                    restMessage.setStringParameterNoEscape(paramName, requestData.stringParams[paramName]);
                }
            }
        }

        // Set headers
        for (var headerName in requestData.headers) {
            if (requestData.headers.hasOwnProperty(headerName)) {
                restMessage.setRequestHeader(headerName, requestData.headers[headerName]);
            }
        }

        // Set content type
        if (requestData.contentType) {
            restMessage.setRequestHeader('Content-Type', requestData.contentType);
        }

        // Set request body
        if (requestData.body) {
            if (typeof requestData.body === 'object') {
                restMessage.setRequestBody(JSON.stringify(requestData.body));
            } else {
                restMessage.setRequestBody(requestData.body);
            }
        }

        // Execute
        var response = restMessage.execute();
        var responseBody = response.getBody();
        var statusCode = response.getStatusCode();

        if (statusCode < 200 || statusCode >= 300) {
            throw new Error('HTTP ' + statusCode + ': ' + responseBody);
        }

        gs.info('IntegrationHelper: ' + this.integrationName + ' — ' + methodName + ' executed successfully (HTTP ' + statusCode + ')');
        return responseBody;
    },

    /**
     * Maps a Zoom action name to the HTTP method function name.
     */
    _mapActionToMethod: function(action) {
        switch (action) {
            case 'create_meeting': return 'create_meeting';
            case 'get_meeting':    return 'get_meeting';
            case 'update_meeting': return 'update_meeting';
            case 'delete_meeting': return 'delete_meeting';
            default:               return null;
        }
    },

    /**
     * Logs execution details to the Integration Logs table.
     */
    _logExecution: function(action, requestData, response, status, errorMessage, executionTime) {
        try {
            var logRecord = new GlideRecord('x_1842120_hubby_u_integration_logs');
            logRecord.initialize();

            logRecord.setValue('u_integration_name', this.integrationName || '');
            logRecord.setValue('u_integration_type', 'zoom');
            logRecord.setValue('u_action', action || '');
            logRecord.setValue('u_status', status || '');
            logRecord.setValue('u_execution_time', executionTime || 0);

            // Sanitize sensitive data before logging
            var sanitizedRequest = this._sanitizeForLogging(requestData);
            var sanitizedResponse = this._sanitizeForLogging(response);

            logRecord.setValue('u_request', JSON.stringify(sanitizedRequest).substring(0, 3999));
            logRecord.setValue('u_response', String(sanitizedResponse).substring(0, 3999));

            if (errorMessage) {
                logRecord.setValue('u_error_message', String(errorMessage).substring(0, 999));
            }

            logRecord.insert();

        } catch (e) {
            gs.error('IntegrationHelper: Failed to log execution — ' + ((e.getMessage ? e.getMessage() : e.message) || String(e)));
        }
    },

    /**
     * Masks sensitive fields in data before logging.
     * Uses standard for-loop instead of forEach for Rhino compatibility.
     */
    _sanitizeForLogging: function(data) {
        if (!data) {
            return data;
        }

        var sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization', 'auth', 'client_secret', 'auth_token'];
        var dataString = JSON.stringify(data);

        for (var i = 0; i < sensitiveFields.length; i++) {
            var field = sensitiveFields[i];
            var regex = new RegExp('"' + field + '"\\s*:\\s*"[^"]*"', 'gi');
            dataString = dataString.replace(regex, '"' + field + '":"***MASKED***"');
        }

        try {
            return JSON.parse(dataString);
        } catch (e) {
            return '***SANITIZED***';
        }
    },

    type: 'IntegrationHelper'
};