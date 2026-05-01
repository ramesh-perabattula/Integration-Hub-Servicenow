var UniversalAuthManager = Class.create();
UniversalAuthManager.prototype = {
    initialize: function() {
        // Constructor
    },

    /**
     * Returns authentication headers for the given integration record.
     * For Zoom, OAuth is handled at the REST message level — no headers needed here.
     * For Slack, Jira, Twilio, Postman — headers are set dynamically.
     */
    getHeaders: function(record) {
        try {
            if (!record) {
                return {};
            }

            var integrationType = record.getValue('u_integration_type') || 'zoom';
            var headers = {};

            switch (integrationType) {
                case 'zoom':
                    // OAuth 2.0 is attached at the REST message level
                    // No manual Authorization header needed
                    headers = {};
                    break;

                case 'slack':
                    var slackToken = record.getValue('u_api_key');
                    if (slackToken) {
                        headers['Authorization'] = 'Bearer ' + slackToken;
                    }
                    break;

                case 'jira':
                    var jiraApiKey = record.getValue('u_api_key');
                    var jiraEmail = record.getValue('u_email');
                    if (jiraApiKey) {
                        // Use u_email field if available, otherwise try parsing email:token format
                        var credentials;
                        if (jiraEmail) {
                            credentials = jiraEmail + ':' + jiraApiKey;
                        } else if (jiraApiKey.indexOf(':') > -1) {
                            // Backward compatibility: u_api_key may contain email:token
                            credentials = jiraApiKey;
                        } else {
                            credentials = 'user@example.com:' + jiraApiKey;
                        }
                        headers['Authorization'] = 'Basic ' + GlideStringUtil.base64Encode(credentials);
                    }
                    break;

                case 'twilio':
                    var accountSid = record.getValue('u_account_sid');
                    var authToken = record.getValue('u_auth_token');
                    if (accountSid && authToken) {
                        var twilioCredentials = accountSid + ':' + authToken;
                        headers['Authorization'] = 'Basic ' + GlideStringUtil.base64Encode(twilioCredentials);
                    }
                    break;

                case 'postman':
                    var postmanApiKey = record.getValue('u_api_key');
                    if (postmanApiKey) {
                        headers['X-Api-Key'] = postmanApiKey;
                    }
                    break;

                default:
                    gs.warn('Unknown integration type: ' + integrationType);
                    headers = {};
            }

            return headers;

        } catch (error) {
            gs.error('UniversalAuthManager.getHeaders - Error: ' + error.getMessage());
            return {};
        }
    },

    /**
     * Returns the authentication_type string for a REST message based on integration type.
     * Zoom uses OAuth 2.0; all others handle auth via headers at runtime.
     */
    getAuthenticationType: function(integrationType) {
        switch (integrationType) {
            case 'zoom':
                return 'oauth2';
            case 'slack':
            case 'jira':
            case 'twilio':
            case 'postman':
                return 'no_authentication';
            default:
                return 'no_authentication';
        }
    },

    /**
     * Creates an OAuth 2.0 Entity Profile for Zoom integrations.
     * Table: oauth_entity_profile
     * Grant type: client_credentials
     * Token URL: https://zoom.us/oauth/token
     *
     * @param {GlideRecord} record - The integration record containing u_client_id and u_client_secret
     * @returns {string|null} The sys_id of the created OAuth profile, or null on failure
     */
    createOAuthProfile: function(record) {
        try {
            var integrationName = record.getValue('u_name');
            var clientId = record.getValue('u_client_id');
            var clientSecret = record.getValue('u_client_secret');

            if (!clientId || !clientSecret) {
                gs.warn('UniversalAuthManager.createOAuthProfile - Missing client_id or client_secret for: ' + integrationName);
                return null;
            }

            var profileName = 'ZOOM_' + integrationName;

            // Check if profile already exists
            var existingProfile = new GlideRecord('oauth_entity_profile');
            existingProfile.addQuery('name', profileName);
            existingProfile.query();

            if (existingProfile.next()) {
                gs.info('OAuth profile ' + profileName + ' already exists - returning existing sys_id');
                return existingProfile.getUniqueValue();
            }

            // First, create or find the OAuth Entity (oauth_entity)
            var entityName = 'ZOOM_OAUTH_' + integrationName;

            var oauthEntity = new GlideRecord('oauth_entity');
            oauthEntity.addQuery('name', entityName);
            oauthEntity.query();

            var entitySysId;
            if (oauthEntity.next()) {
                entitySysId = oauthEntity.getUniqueValue();
                gs.info('OAuth entity ' + entityName + ' already exists');
            } else {
                // Create the OAuth Entity
                var newEntity = new GlideRecord('oauth_entity');
                newEntity.initialize();
                newEntity.setValue('name', entityName);
                newEntity.setValue('client_id', clientId);
                newEntity.setValue('client_secret', clientSecret);
                newEntity.setValue('token_url', 'https://zoom.us/oauth/token');
                newEntity.setValue('default_grant_type', 'client_credentials');
                newEntity.setValue('active', true);
                entitySysId = newEntity.insert();

                if (!entitySysId) {
                    gs.error('UniversalAuthManager.createOAuthProfile - Failed to create OAuth entity for: ' + integrationName);
                    return null;
                }
                gs.info('Created OAuth entity: ' + entityName);
            }

            // Create the OAuth Entity Profile
            var profile = new GlideRecord('oauth_entity_profile');
            profile.initialize();
            profile.setValue('name', profileName);
            profile.setValue('oauth_entity', entitySysId);
            profile.setValue('grant_type', 'client_credentials');
            profile.setValue('active', true);
            var profileSysId = profile.insert();

            if (!profileSysId) {
                gs.error('UniversalAuthManager.createOAuthProfile - Failed to create OAuth profile for: ' + integrationName);
                return null;
            }

            gs.info('Created OAuth profile: ' + profileName + ' (sys_id: ' + profileSysId + ')');
            return profileSysId;

        } catch (error) {
            gs.error('UniversalAuthManager.createOAuthProfile - Error: ' + error.getMessage());
            return null;
        }
    },

    type: 'UniversalAuthManager'
};