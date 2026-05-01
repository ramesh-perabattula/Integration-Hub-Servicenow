var IntegrationHelper = Class.create();
IntegrationHelper.prototype = {
    initialize: function(name) {
        this.integrationRecord = null;
        this.restMessageName = null;
        this.authManager = new UniversalAuthManager();
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

    execute: function(action, payload) {
        var startTime = new Date().getTime();
        var requestData = null;
        var responseBody = null;
        var errorMessage = null;
        var status = 'success';
        var retryCount = 0;
        var maxRetries = 2;

        try {
            if (!this.restMessageName || !this.integrationRecord) {
                throw new Error('Integration not properly initialized');
            }

            var integrationType = this.integrationRecord.getValue('u_integration_type') || 'zoom';
            
            // Validation layer
            var validationError = this._validatePayload(action, payload, integrationType);
            if (validationError) {
                throw new Error(validationError);
            }

            // Prepare request data and method name
            var methodName = this._mapActionToMethod(action, integrationType);
            if (!methodName) {
                throw new Error('Unsupported action "' + action + '" for integration type "' + integrationType + '"');
            }

            requestData = this._prepareRequestData(action, payload, integrationType);
            
            // Execute with retry mechanism
            while (retryCount <= maxRetries) {
                try {
                    responseBody = this._executeRestCall(methodName, requestData, integrationType);
                    break; // Success - exit retry loop
                } catch (e) {
                    retryCount++;
                    if (retryCount > maxRetries) {
                        throw e; // Final attempt failed
                    }
                    gs.info('Retry attempt ' + retryCount + ' for integration: ' + this.integrationName);
                    java.lang.Thread.sleep(1000); // 1 second delay between retries
                }
            }

        } catch (error) {
            status = 'failure';
            errorMessage = error.getMessage();
            responseBody = 'Error: ' + errorMessage;
        } finally {
            var executionTime = new Date().getTime() - startTime;
            this._logExecution(action, requestData, responseBody, status, errorMessage, executionTime);
        }

        return responseBody;
    },

    _validatePayload: function(action, payload, integrationType) {
        if (!payload) payload = {};

        switch (integrationType) {
            case 'zoom':
                if (action === 'create_meeting' && !payload.topic) {
                    return 'Missing required field: topic';
                }
                break;
            case 'slack':
                if (action === 'send_message' && !payload.text) {
                    return 'Missing required field: text';
                }
                break;
            case 'jira':
                if (action === 'create_issue') {
                    if (!payload.summary) return 'Missing required field: summary';
                    if (!payload.description) return 'Missing required field: description';
                }
                break;
            case 'twilio':
                if (action === 'send_sms') {
                    if (!payload.to) return 'Missing required field: to';
                    if (!payload.message) return 'Missing required field: message';
                }
                break;
            case 'postman':
                // No validation needed
                break;
        }
        return null;
    },

    _prepareRequestData: function(action, payload, integrationType) {
        var requestData = {
            headers: {},
            body: null,
            contentType: null
        };

        // Get authentication headers
        var authHeaders = this.authManager.getHeaders(this.integrationRecord);
        for (var header in authHeaders) {
            requestData.headers[header] = authHeaders[header];
        }

        // Prepare type-specific request data
        switch (integrationType) {
            case 'zoom':
                if (action === 'create_meeting') {
                    requestData.contentType = 'application/json';
                    requestData.body = {
                        "topic": payload.topic,
                        "type": 2,
                        "duration": payload.duration || 60
                    };
                }
                break;

            case 'slack':
                if (action === 'send_message') {
                    requestData.contentType = 'application/json';
                    var channel = this.integrationRecord.getValue('u_default_channel') || payload.channel || '#general';
                    requestData.body = {
                        "channel": channel,
                        "text": payload.text
                    };
                }
                break;

            case 'jira':
                if (action === 'create_issue') {
                    requestData.contentType = 'application/json';
                    var projectKey = this.integrationRecord.getValue('u_project_key') || 'DEFAULT';
                    requestData.body = {
                        "fields": {
                            "project": {
                                "key": projectKey
                            },
                            "summary": payload.summary,
                            "description": payload.description,
                            "issuetype": {
                                "name": "Task"
                            }
                        }
                    };
                }
                break;

            case 'twilio':
                if (action === 'send_sms') {
                    requestData.contentType = 'application/x-www-form-urlencoded';
                    var fromNumber = this.integrationRecord.getValue('u_phone_number') || payload.from;
                    requestData.body = 'From=' + encodeURIComponent(fromNumber) + 
                                     '&To=' + encodeURIComponent(payload.to) + 
                                     '&Body=' + encodeURIComponent(payload.message);
                }
                break;

            case 'postman':
                // No special body preparation needed for GET requests
                break;
        }

        return requestData;
    },

    _executeRestCall: function(methodName, requestData, integrationType) {
        // Create REST message
        var restMessage = new sn_ws.RESTMessageV2(this.restMessageName, methodName);
        
        // Set timeout to 30 seconds
        restMessage.setHttpTimeout(30000);
        
        // Set headers
        for (var headerName in requestData.headers) {
            restMessage.setRequestHeader(headerName, requestData.headers[headerName]);
        }
        
        // Set content type if specified
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

        // Execute request
        var response = restMessage.execute();
        var responseBody = response.getBody();
        var statusCode = response.getStatusCode();

        if (statusCode < 200 || statusCode >= 300) {
            throw new Error('HTTP ' + statusCode + ': ' + responseBody);
        }

        gs.info('Integration executed successfully: ' + this.integrationName + ' - ' + methodName);
        return responseBody;
    },

    _mapActionToMethod: function(action, integrationType) {
        // Keep existing Zoom mappings for backward compatibility
        if (integrationType === 'zoom') {
            switch (action) {
                case 'create_meeting': return 'create_meeting';
                case 'get_meeting': return 'get_meeting';
                case 'update_meeting': return 'update_meeting';
                case 'delete_meeting': return 'delete_meeting';
                default: return null;
            }
        }

        // Map actions for other integration types
        switch (integrationType) {
            case 'slack':
                return action === 'send_message' ? 'send_message' : null;
            case 'jira':
                switch (action) {
                    case 'create_issue': return 'create_issue';
                    case 'get_issue': return 'get_issue';
                    default: return null;
                }
            case 'twilio':
                return action === 'send_sms' ? 'send_sms' : null;
            case 'postman':
                return action === 'list_collections' ? 'list_collections' : null;
            default:
                return null;
        }
    },

    _logExecution: function(action, requestData, response, status, errorMessage, executionTime) {
        try {
            var logRecord = new GlideRecord('x_1842120_hubby_u_integration_logs');
            logRecord.initialize();
            
            logRecord.setValue('u_integration_name', this.integrationName);
            logRecord.setValue('u_integration_type', this.integrationRecord.getValue('u_integration_type') || 'zoom');
            logRecord.setValue('u_action', action);
            logRecord.setValue('u_status', status);
            logRecord.setValue('u_execution_time', executionTime);
            
            // Mask sensitive data in logs
            var sanitizedRequest = this._sanitizeForLogging(requestData);
            var sanitizedResponse = this._sanitizeForLogging(response);
            
            logRecord.setValue('u_request', JSON.stringify(sanitizedRequest).substring(0, 3999));
            logRecord.setValue('u_response', String(sanitizedResponse).substring(0, 3999));
            
            if (errorMessage) {
                logRecord.setValue('u_error_message', String(errorMessage).substring(0, 999));
            }
            
            logRecord.insert();
            
        } catch (e) {
            gs.error('Failed to log integration execution: ' + e.getMessage());
        }
    },

    _sanitizeForLogging: function(data) {
        if (!data) return data;
        
        var sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization', 'auth'];
        var dataString = JSON.stringify(data);
        
        // Simple masking - replace sensitive values
        sensitiveFields.forEach(function(field) {
            var regex = new RegExp('"' + field + '"\\s*:\\s*"[^"]*"', 'gi');
            dataString = dataString.replace(regex, '"' + field + '":"***MASKED***"');
        });
        
        try {
            return JSON.parse(dataString);
        } catch (e) {
            return '***SANITIZED***';
        }
    },

    type: 'IntegrationHelper'
};