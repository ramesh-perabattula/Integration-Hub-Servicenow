import React, { useState, useCallback } from 'react';
import './ZoomIntegrationForm.css';

export default function ZoomIntegrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    friendlyName: '',
    clientId: '',
    clientSecret: '',
    methods: ['POST', 'GET', 'PATCH', 'DELETE']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [toast, setToast] = useState(null);
  const [copiedBtn, setCopiedBtn] = useState(null);

  const handleInputChange = useCallback(function(e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(function(prev) {
      var next = Object.assign({}, prev);
      next[name] = value;
      return next;
    });
  }, []);

  var handleMethodChange = useCallback(function(method) {
    setFormData(function(prev) {
      var next = Object.assign({}, prev);
      if (prev.methods.indexOf(method) > -1) {
        next.methods = prev.methods.filter(function(m) { return m !== method; });
      } else {
        next.methods = prev.methods.concat([method]);
      }
      return next;
    });
  }, []);

  var showToast = useCallback(function(msg) {
    setToast(msg);
    setTimeout(function() { setToast(null); }, 2500);
  }, []);

  var copyToClipboard = useCallback(function(text, btnId) {
    navigator.clipboard.writeText(text).then(function() {
      setCopiedBtn(btnId);
      showToast('Copied to clipboard!');
      setTimeout(function() { setCopiedBtn(null); }, 2000);
    }).catch(function() {});
  }, [showToast]);

  var handleSubmit = function() {
    setIsSubmitting(true);
    setError(null);

    var restMessageName = 'ZOOM_' + formData.friendlyName;
    var requestData = {
      u_name: formData.friendlyName,
      u_client_id: formData.clientId,
      u_client_secret: formData.clientSecret,
      u_methods: formData.methods.join(','),
      u_rest_message_name: restMessageName,
      u_status: 'active'
    };

    fetch('/api/now/table/x_1842120_hubby_u_zoom_integration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-UserToken': window.g_ck
      },
      body: JSON.stringify(requestData)
    })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(errData) {
          throw new Error((errData.error && errData.error.message) || 'HTTP ' + response.status + ': Failed to create integration');
        });
      }
      return response.json();
    })
    .then(function(responseData) {
      var rec = responseData.result;
      setResult({
        sys_id: typeof rec.sys_id === 'object' ? rec.sys_id.value : rec.sys_id,
        name: typeof rec.u_name === 'object' ? rec.u_name.display_value : rec.u_name,
        restMessageName: typeof rec.u_rest_message_name === 'object' ? rec.u_rest_message_name.display_value : rec.u_rest_message_name,
        methods: typeof rec.u_methods === 'object' ? rec.u_methods.display_value : rec.u_methods
      });
    })
    .catch(function(err) {
      setError(err.message || 'An unexpected error occurred');
      setStep(2);
    })
    .finally(function() {
      setIsSubmitting(false);
    });
  };

  var nextStep = function() {
    if (step === 1 && !formData.friendlyName.trim()) {
      setError('Please enter an integration name');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  var prevStep = function() {
    setError(null);
    setStep(step - 1);
  };

  // ── SUCCESS VIEW ──
  if (result) {
    var integrationName = result.name;
    var action = 'create_meeting';
    var payload = "{\n  topic: 'Demo Meeting',\n  duration: 30\n}";

    var scopedCode = "var api = new IntegrationHelper('" + integrationName + "');\nvar res = api.execute('" + action + "', " + payload + ");\ngs.info(res);";
    var globalCode = "var api = new GlobalIntegrationHelper('" + integrationName + "');\nvar res = api.execute('" + action + "', " + payload + ");";
    var uiActionCode = "// UI Action Script — Attach to Incident form\nvar api = new GlobalIntegrationHelper('" + integrationName + "');\nvar res = api.execute('create_meeting', {\n  topic: current.short_description + ' Bridge',\n  duration: 60\n});\ngs.addInfoMessage('Zoom: ' + res);";
    var brCode = "(function executeRule(current, previous) {\n    var api = new GlobalIntegrationHelper('" + integrationName + "');\n    var res = api.execute('create_meeting', {\n        topic: 'P1 Bridge: ' + current.number,\n        duration: 60\n    });\n    gs.info('Zoom bridge created: ' + res);\n})(current, previous);";

    return (
      <div className="integration-hub-container">
        {toast && <div className="toast">{toast}</div>}
        <div className="success-card">
          <div className="success-header">
            <div className="success-icon-wrap">
              <span className="success-icon">✓</span>
            </div>
            <h2>Integration Created!</h2>
            <p>Your Zoom integration is ready to use</p>
          </div>

          <div className="integration-details">
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{integrationName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">REST Message</span>
              <span className="detail-value">{result.restMessageName || 'ZOOM_' + integrationName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Methods</span>
              <span className="detail-value">{result.methods || 'POST,GET,PATCH,DELETE'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Auth</span>
              <span className="detail-value">OAuth 2.0</span>
            </div>
          </div>

          <div className="usage-section">
            <h3 className="section-title">Quick Start</h3>

            <div className="usage-option">
              <h4 className="option-title">Scoped Script Include</h4>
              <div className="code-block-container">
                <pre className="code-block"><code>{scopedCode}</code></pre>
                <button onClick={function() { copyToClipboard(scopedCode, 'scoped'); }} className={'copy-btn' + (copiedBtn === 'scoped' ? ' copied' : '')}>
                  {copiedBtn === 'scoped' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="usage-option">
              <h4 className="option-title">Global Usage</h4>
              <div className="code-block-container">
                <pre className="code-block"><code>{globalCode}</code></pre>
                <button onClick={function() { copyToClipboard(globalCode, 'global'); }} className={'copy-btn' + (copiedBtn === 'global' ? ' copied' : '')}>
                  {copiedBtn === 'global' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="usage-option">
              <h4 className="option-title">Use Case</h4>
              <div className="use-case-box">
                <span className="use-case-icon">💡</span>
                <span className="use-case-text">Attach to Incident UI Action to create a Zoom bridge call for P1 incidents</span>
              </div>
            </div>
          </div>

          <div className="developer-guide">
            <div className="guide-header" onClick={function() { setExpandedSection(expandedSection === 'guide' ? null : 'guide'); }}>
              <h3 className="section-title" style={{marginBottom: 0}}>Developer Guide</h3>
              <span className="expand-icon">{expandedSection === 'guide' ? '▾' : '▸'}</span>
            </div>

            {expandedSection === 'guide' && (
              <div className="guide-content">
                <div className="guide-item">
                  <h4 className="guide-item-title">UI Action Script</h4>
                  <div className="code-block-container">
                    <pre className="code-block"><code>{uiActionCode}</code></pre>
                    <button onClick={function() { copyToClipboard(uiActionCode, 'ui'); }} className={'copy-btn' + (copiedBtn === 'ui' ? ' copied' : '')}>
                      {copiedBtn === 'ui' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="guide-item">
                  <h4 className="guide-item-title">Business Rule Script</h4>
                  <div className="code-block-container">
                    <pre className="code-block"><code>{brCode}</code></pre>
                    <button onClick={function() { copyToClipboard(brCode, 'br'); }} className={'copy-btn' + (copiedBtn === 'br' ? ' copied' : '')}>
                      {copiedBtn === 'br' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="guide-item">
                  <h4 className="guide-item-title">Flow Designer</h4>
                  <div className="flow-note">
                    <span className="flow-icon">⚡</span>
                    <div className="flow-text">
                      <strong>Use a Script step in Flow Designer</strong>
                      Add a Script step and paste the Global Usage code above
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button onClick={function() { setResult(null); setStep(1); setFormData({ friendlyName: '', clientId: '', clientSecret: '', methods: ['POST','GET','PATCH','DELETE'] }); }} className="create-another-btn">
            + Create Another Integration
          </button>
        </div>
      </div>
    );
  }

  // ── FORM VIEW ──
  return (
    <div className="integration-hub-container">
      {toast && <div className="toast">{toast}</div>}
      <div className="main-card">
        <div className="header-section">
          <h1 className="main-title">
            <span className="icon">📹</span>Zoom Integration Hub
          </h1>
          <p className="subtitle">Create a Zoom meeting integration with OAuth 2.0 in seconds</p>

          <div className="step-indicator">
            <div className={'step-dot' + (step === 1 ? ' active' : '') + (step > 1 ? ' completed' : '')}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={'step-line' + (step > 1 ? ' active' : '')}></div>
            <div className={'step-dot' + (step === 2 ? ' active' : '') + (step > 2 ? ' completed' : '')}>
              {step > 2 ? '✓' : '2'}
            </div>
            <div className={'step-line' + (step > 2 ? ' active' : '')}></div>
            <div className={'step-dot' + (step === 3 ? ' active' : '')}>3</div>
          </div>
          <div className="step-labels">
            <span className={'step-label' + (step === 1 ? ' active' : '')}>Name</span>
            <span className={'step-label' + (step === 2 ? ' active' : '')}>Configure</span>
            <span className={'step-label' + (step === 3 ? ' active' : '')}>Review</span>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠</span>
            <div className="error-content">{error}</div>
          </div>
        )}

        {/* STEP 1: Name */}
        {step === 1 && (
          <div className="integration-form">
            <div className="fields-section">
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
                  className="field-input"
                  placeholder="e.g. P1-Bridge, Team-Standup"
                  autoFocus
                />
              </div>
            </div>
            <button type="button" onClick={nextStep} className="submit-btn" disabled={!formData.friendlyName.trim()}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2: Configure */}
        {step === 2 && (
          <div className="integration-form">
            <div className="fields-section">
              <div className="field-group">
                <label htmlFor="clientId" className="field-label">
                  Zoom Client ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="From Zoom Marketplace app"
                />
              </div>

              <div className="field-group">
                <label htmlFor="clientSecret" className="field-label">
                  Zoom Client Secret <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="clientSecret"
                  name="clientSecret"
                  value={formData.clientSecret}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="field-group">
                <label className="field-label">HTTP Methods</label>
                <div className="checkbox-grid">
                  {['POST', 'GET', 'PATCH', 'DELETE'].map(function(method) {
                    var isChecked = formData.methods.indexOf(method) > -1;
                    return (
                      <label key={method} className={'checkbox-item' + (isChecked ? ' checked' : '')} onClick={function() { handleMethodChange(method); }}>
                        <input type="checkbox" className="checkbox-input" checked={isChecked} readOnly />
                        <span className="checkbox-visual"></span>
                        <span className="checkbox-label">{method}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <button type="button" onClick={nextStep} className="submit-btn">
              Review →
            </button>
            <button type="button" onClick={prevStep} className="btn-secondary">
              ← Back
            </button>
          </div>
        )}

        {/* STEP 3: Review & Create */}
        {step === 3 && (
          <div className="review-section">
            <div className="review-card" style={{marginTop: '24px'}}>
              <div className="review-item">
                <span className="review-label">Name</span>
                <span className="review-value">{formData.friendlyName}</span>
              </div>
              <div className="review-item">
                <span className="review-label">REST Message</span>
                <span className="review-value accent">ZOOM_{formData.friendlyName}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Client ID</span>
                <span className="review-value">{formData.clientId ? formData.clientId.substring(0, 8) + '••••' : '—'}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Methods</span>
                <span className="review-value">{formData.methods.join(', ') || 'All (default)'}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Authentication</span>
                <span className="review-value accent">OAuth 2.0 (Client Credentials)</span>
              </div>
            </div>

            <button type="button" onClick={handleSubmit} className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <><span className="spinner"></span>Creating Integration...</>
              ) : (
                '🚀 Create Integration'
              )}
            </button>
            <button type="button" onClick={prevStep} className="btn-secondary" disabled={isSubmitting}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}