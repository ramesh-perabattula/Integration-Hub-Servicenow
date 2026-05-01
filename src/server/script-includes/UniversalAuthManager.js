var UniversalAuthManager = Class.create();
UniversalAuthManager.prototype = {
    initialize: function() {
        // Constructor
    },

    /**
     * Returns authentication headers for a Zoom integration.
     * For Zoom, OAuth 2.0 is handled at the REST message level —
     * no manual Authorization header is needed at runtime.
     *
     * @param {GlideRecord} record - The integration record
     * @returns {object} Empty headers object (OAuth handles auth)
     */
    getHeaders: function(record) {
        // Zoom uses OAuth 2.0 attached to the REST message — no headers needed
        return {};
    },

    /**
     * Returns 'oauth2' for Zoom integrations.
     */
    getAuthenticationType: function() {
        return 'oauth2';
    },

    /**
     * Creates an OAuth 2.0 Entity and Profile for a Zoom integration.
     *
     * This creates two records:
     *   1. oauth_entity       — holds client_id, client_secret, token_url
     *   2. oauth_entity_profile — links to the entity with grant_type: client_credentials
     *
     * Zoom's Server-to-Server OAuth uses client_credentials grant:
     *   POST https://zoom.us/oauth/token
     *   Authorization: Basic base64(client_id:client_secret)
     *   grant_type=client_credentials
     *
     * @param {GlideRecord} record - Integration record with u_client_id, u_client_secret, u_name
     * @returns {string|null} sys_id of the created OAuth profile, or null on failure
     */
    createOAuthProfile: function(record) {
        try {
            var integrationName = record.getValue('u_name');
            var clientId = record.getValue('u_client_id');
            var clientSecret = record.getValue('u_client_secret');

            if (!clientId || !clientSecret) {
                gs.warn('UniversalAuthManager: Missing client_id or client_secret for "' + integrationName + '"');
                return null;
            }

            var profileName = 'ZOOM_OAUTH_PROFILE_' + integrationName;

            // Check if profile already exists
            var existingProfile = new GlideRecord('oauth_entity_profile');
            existingProfile.addQuery('name', profileName);
            existingProfile.query();

            if (existingProfile.next()) {
                gs.info('OAuth profile "' + profileName + '" already exists — returning existing sys_id');
                return existingProfile.getUniqueValue();
            }

            // Step 1: Create or find the OAuth Entity
            var entityName = 'ZOOM_OAUTH_ENTITY_' + integrationName;

            var oauthEntity = new GlideRecord('oauth_entity');
            oauthEntity.addQuery('name', entityName);
            oauthEntity.query();

            var entitySysId;
            if (oauthEntity.next()) {
                entitySysId = oauthEntity.getUniqueValue();
                gs.info('OAuth entity "' + entityName + '" already exists');
            } else {
                // Create new OAuth Entity
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
                    gs.error('UniversalAuthManager: Failed to create OAuth entity for "' + integrationName + '"');
                    return null;
                }
                gs.info('Created OAuth entity: ' + entityName);
            }

            // Step 2: Create the OAuth Entity Profile
            var profile = new GlideRecord('oauth_entity_profile');
            profile.initialize();
            profile.setValue('name', profileName);
            profile.setValue('oauth_entity', entitySysId);
            profile.setValue('grant_type', 'client_credentials');
            profile.setValue('active', true);
            var profileSysId = profile.insert();

            if (!profileSysId) {
                gs.error('UniversalAuthManager: Failed to create OAuth profile for "' + integrationName + '"');
                return null;
            }

            gs.info('Created OAuth profile: ' + profileName + ' (sys_id: ' + profileSysId + ')');
            return profileSysId;

        } catch (error) {
            gs.error('UniversalAuthManager.createOAuthProfile — Error: ' + ((error.getMessage ? error.getMessage() : error.message) || String(error)));
            return null;
        }
    },

    type: 'UniversalAuthManager'
};