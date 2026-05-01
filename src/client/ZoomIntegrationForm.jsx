import React, { useState } from 'react';
import './ZoomIntegrationForm.css';

export default function ZoomIntegrationForm() {
  const [formData, setFormData] = useState({
    friendlyName: '',
    integrationType: 'zoom',
    // Zoom fields
    clientId: '',
    clientSecret: '',
    methods: [],
    // Universal fields  
    apiKey: '',
    baseUrl: '',
    projectKey: '',
    defaultChannel: '',
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter(m => m !== method)
        : [...prev.methods, method]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data based on integration type
      const requestData = {
        u_name: formData.friendlyName,
        u_integration_type: formData.integrationType,
        u_status: 'active'
      };

      // Add type-specific fields
      switch (formData.integrationType) {
        case 'zoom':
          requestData.u_client_id = formData.clientId;
          requestData.u_client_secret = formData.clientSecret;
          requestData.u_methods = formData.methods.join(',');
          break;
        case 'slack':
          requestData.u_api_key = formData.apiKey;
          requestData.u_default_channel = formData.defaultChannel;
          break;
        case 'jira':
          requestData.u_api_key = formData.apiKey;
          requestData.u_base_url = formData.baseUrl;
          requestData.u_project_key = formData.projectKey;
          break;
        case 'twilio':
          requestData.u_account_sid = formData.accountSid;
          requestData.u_auth_token = formData.authToken;
          requestData.u_phone_number = formData.phoneNumber;
          break;
        case 'postman':
          requestData.u_api_key = formData.apiKey;
          requestData.u_base_url = formData.baseUrl;
          break;
      }

      const response = await fetch('/api/now/table/x_1842120_hubby_u_zoom_integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-UserToken': window.g_ck
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: Failed to create integration`);
      }

      const responseData = await response.json();
      const createdRecord = responseData.result;
      
      setResult({
        sys_id: typeof createdRecord.sys_id === 'object' ? createdRecord.sys_id.value : createdRecord.sys_id,
        name: typeof createdRecord.u_name === 'object' ? createdRecord.u_name.display_value : createdRecord.u_name,
        integrationType: typeof createdRecord.u_integration_type === 'object' ? 
          createdRecord.u_integration_type.display_value : 
          createdRecord.u_integration_type,
        restMessageName: typeof createdRecord.u_rest_message_name === 'object' ? 
          createdRecord.u_rest_message_name.display_value : 
          createdRecord.u_rest_message_name
      });

      // Reset form
      setFormData({
        friendlyName: '',
        integrationType: 'zoom',
        clientId: '',
        clientSecret: '',
        methods: [],
        apiKey: '',
        baseUrl: '',
        projectKey: '',
        defaultChannel: '',
        accountSid: '',
        authToken: '',
        phoneNumber: ''
      });

    } catch (err) {
      console.error('Error creating integration:', err);
      setError(err.message || 'An unexpected error occurred while creating the integration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExampleAction = () => {
    switch (result?.integrationType || formData.integrationType) {
      case 'zoom': return 'create_meeting';
      case 'slack': return 'send_message';
      case 'jira': return 'create_issue';
      case 'twilio': return 'send_sms';
      case 'postman': return 'list_collections';
      default: return 'action';
    }
  };

  const getExamplePayload = () => {
    switch (result?.integrationType || formData.integrationType) {
      case 'zoom': return '{\n  topic: \'Demo Meeting\',\n  duration: 30\n}';
      case 'slack': return '{\n  text: \'Hello from ServiceNow\'\n}';
      case 'jira': return '{\n  summary: \'Test Issue\',\n  description: \'Created via ServiceNow\'\n}';
      case 'twilio': return '{\n  to: \'+91XXXXXXXXXX\',\n  message: \'Hello from ServiceNow\'\n}';
      case 'postman': return '{}';
      default: return '{}';
    }
  };

  const getUseCase = (type) => {
    const useCases = {
      zoom: 'Use in Incident UI Action to create bridge call',
      slack: 'Send alert when Incident is created',
      jira: 'Auto-create issue from Problem record',
      twilio: 'Send SMS for P1 incidents',
      postman: 'Fetch API collections for automation'
    };
    return useCases[type] || 'General API integration';
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getIntegrationIcon = (type) => {
    const icons = {
      zoom: '📹',
      slack: '💬', 
      jira: '📋',
      twilio: '📱',
      postman: '🚀'
    };
    return icons[type] || '🔗';
  };

  if (result) {
    const integrationName = result.name;
    const integrationType = result.integrationType;
    const action = getExampleAction();
    const payload = getExamplePayload();

    const scopedCode = `var api = new IntegrationHelper('${integrationName}');
var res = api.execute('${action}', ${payload});`;

    const globalCode = `var api = new GlobalIntegrationHelper('${integrationName}');
var res = api.execute('${action}', ${payload});`;

    const uiActionCode = `// UI Action Script
var api = new GlobalIntegrationHelper('${integrationName}');
var res = api.execute('${action}', ${payload});
gs.addInfoMessage('Integration executed: ' + res);`;

    const businessRuleCode = `// Business Rule Script
(function executeRule(current, previous) {
    var api = new GlobalIntegrationHelper('${integrationName}');
    var res = api.execute('${action}', ${payload});
    gs.info('Integration result: ' + res);
})(current, previous);`;

    return (
      <div className="integration-hub-container">
        <div className="success-card">
          <div className="success-header">
            <span className="success-icon">✅</span>
            <h2>Integration Created Successfully!</h2>
          </div>
          
          <div className="integration-details">
            <div className="detail-item">
              <span className="detail-label">Integration Name:</span>
              <span className="detail-value">{integrationName}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value">
                {getIntegrationIcon(integrationType)} {integrationType}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">REST Message:</span>
              <span className="detail-value">{result.restMessageName || `${integrationType.toUpperCase()}_${integrationName}`}</span>
            </div>
          </div>

          {/* How to Use This Integration Section */}
          <div className="usage-section">
            <h3 className="section-title">ℹ️ How to Use This Integration</h3>
            
            {/* Option 1: Direct Script Include */}
            <div className="usage-option">
              <h4 className="option-title">Option 1: Scoped Usage</h4>
              <div className="code-block-container">
                <pre className="code-block">
                  <code>{scopedCode}</code>
                </pre>
                <button onClick={() => copyToClipboard(scopedCode)} className="copy-btn">
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Option 2: Global Usage */}
            <div className="usage-option">
              <h4 className="option-title">Option 2: Global Usage</h4>
              <div className="code-block-container">
                <pre className="code-block">
                  <code>{globalCode}</code>
                </pre>
                <button onClick={() => copyToClipboard(globalCode)} className="copy-btn">
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Option 3: Use Cases */}
            <div className="usage-option">
              <h4 className="option-title">Option 3: Example Use Case</h4>
              <div className="use-case-box">
                <span className="use-case-icon">💡</span>
                <span className="use-case-text">{getUseCase(integrationType)}</span>
              </div>
            </div>
          </div>

          {/* Developer Guide Section */}
          <div className="developer-guide">
            <div 
              className="guide-header"
              onClick={() => toggleSection('guide')}
            >
              <h3 className="section-title">📘 Developer Guide</h3>
              <span className="expand-icon">{expandedSection === 'guide' ? '▼' : '▶'}</span>
            </div>
            
            {expandedSection === 'guide' && (
              <div className="guide-content">
                {/* UI Action Usage */}
                <div className="guide-item">
                  <h4 className="guide-item-title">⚙️ UI Action Usage</h4>
                  <div className="code-block-container">
                    <pre className="code-block">
                      <code>{uiActionCode}</code>
                    </pre>
                    <button onClick={() => copyToClipboard(uiActionCode)} className="copy-btn">
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Business Rule Usage */}
                <div className="guide-item">
                  <h4 className="guide-item-title">🔄 Business Rule Usage</h4>
                  <div className="code-block-container">
                    <pre className="code-block">
                      <code>{businessRuleCode}</code>
                    </pre>
                    <button onClick={() => copyToClipboard(businessRuleCode)} className="copy-btn">
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Flow Designer Note */}
                <div className="guide-item">
                  <h4 className="guide-item-title">🌊 Flow Designer Usage</h4>
                  <div className="flow-note">
                    <span className="flow-icon">💡</span>
                    <div className="flow-text">
                      <strong>Use Script step and call GlobalIntegrationHelper</strong>
                      <br />
                      <small>Add a Script step in your flow and use the Global Usage code above</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setResult(null)}
            className="create-another-btn"
          >
            Create Another Integration
          </button>
        </div>
      </div>
    );
  }

  const renderTypeSpecificFields = () => {
    switch (formData.integrationType) {
      case 'zoom':
        return (
          <div className="fields-section">
            <div className="field-group">
              <label htmlFor="clientId" className="field-label">Client ID</label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="clientSecret" className="field-label">Client Secret</label>
              <input
                type="password"
                id="clientSecret"
                name="clientSecret"
                value={formData.clientSecret}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Methods</label>
              <div className="checkbox-grid">
                {['POST', 'GET', 'PATCH', 'DELETE'].map(method => (
                  <label key={method} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.methods.includes(method)}
                      onChange={() => handleMethodChange(method)}
                      disabled={isSubmitting}
                      className="checkbox-input"
                    />
                    <span className="checkbox-label">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'slack':
        return (
          <div className="fields-section">
            <div className="field-group">
              <label htmlFor="apiKey" className="field-label">
                API Key (Bot Token) <span className="required">*</span>
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                className="field-input"
                placeholder="xoxb-..."
              />
            </div>

            <div className="field-group">
              <label htmlFor="defaultChannel" className="field-label">Default Channel</label>
              <input
                type="text"
                id="defaultChannel"
                name="defaultChannel"
                value={formData.defaultChannel}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="field-input"
                placeholder="#general"
              />
            </div>
          </div>
        );

      case 'jira':
        return (
          <div className="fields-section">
            <div className="field-group">
              <label htmlFor="apiKey" className="field-label">
                API Key <span className="required">*</span>
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="baseUrl" className="field-label">
                Base URL <span className="required">*</span>
              </label>
              <input
                type="text"
                id="baseUrl"
                name="baseUrl"
                value={formData.baseUrl}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="https://your-domain.atlassian.net"
                required
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="projectKey" className="field-label">Project Key</label>
              <input
                type="text"
                id="projectKey"
                name="projectKey"
                value={formData.projectKey}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="PROJ"
                className="field-input"
              />
            </div>
          </div>
        );

      case 'twilio':
        return (
          <div className="fields-section">
            <div className="field-group">
              <label htmlFor="accountSid" className="field-label">
                Account SID <span className="required">*</span>
              </label>
              <input
                type="text"
                id="accountSid"
                name="accountSid"
                value={formData.accountSid}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="authToken" className="field-label">
                Auth Token <span className="required">*</span>
              </label>
              <input
                type="password"
                id="authToken"
                name="authToken"
                value={formData.authToken}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="phoneNumber" className="field-label">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="+1234567890"
                className="field-input"
              />
            </div>
          </div>
        );

      case 'postman':
        return (
          <div className="fields-section">
            <div className="field-group">
              <label htmlFor="apiKey" className="field-label">
                API Key <span className="required">*</span>
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="baseUrl" className="field-label">Base URL (optional)</label>
              <input
                type="text"
                id="baseUrl"
                name="baseUrl"
                value={formData.baseUrl}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="https://api.getpostman.com"
                className="field-input"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="integration-hub-container">
      <div className="main-card">
        <div className="header-section">
          <h1 className="main-title">🌐 Universal Integration Hub</h1>
          <p className="subtitle">Connect ServiceNow with external platforms seamlessly</p>
        </div>
        
        {error && (
          <div className="error-alert">
            <span className="error-icon">❌</span>
            <div className="error-content">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="integration-form">
          <div className="field-group">
            <label htmlFor="friendlyName" className="field-label">
              Integration Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="friendlyName"
              name="friendlyName"
              value={formData.friendlyName}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="field-input"
              placeholder="Enter a friendly name for this integration"
            />
          </div>

          <div className="field-group">
            <label htmlFor="integrationType" className="field-label">
              Integration Type <span className="required">*</span>
            </label>
            <select
              id="integrationType"
              name="integrationType"
              value={formData.integrationType}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="field-select"
            >
              <option value="zoom">{getIntegrationIcon('zoom')} Zoom</option>
              <option value="slack">{getIntegrationIcon('slack')} Slack</option>
              <option value="jira">{getIntegrationIcon('jira')} Jira</option>
              <option value="twilio">{getIntegrationIcon('twilio')} Twilio</option>
              <option value="postman">{getIntegrationIcon('postman')} Postman</option>
            </select>
          </div>

          {renderTypeSpecificFields()}

          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting || !formData.friendlyName}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating Integration...
              </>
            ) : (
              'Create Integration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}