var UniversalAuthManager = Class.create();
UniversalAuthManager.prototype = {
    initialize: function() {},

    /**
     * Zoom uses OAuth 2.0 at REST message level — no runtime headers needed.
     */
    getHeaders: function() {
        return {};
    },

    getAuthenticationType: function() {
        return 'oauth2';
    },

    type: 'UniversalAuthManager'
};