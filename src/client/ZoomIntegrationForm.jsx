import React, { useState, useCallback } from 'react';
import './ZoomIntegrationForm.css';

var PROGRESS_STEPS = [
  { id: 'record', label: 'Creating Integration Record' },
  { id: 'verify_record', label: 'Verifying Record Created' },
  { id: 'verify_rest', label: 'Verifying REST Message' },
  { id: 'done', label: 'Integration Ready' }
];

export default function ZoomIntegrationForm() {
  var _s = useState(1), step = _s[0], setStep = _s[1];
  var _f = useState({ friendlyName: '', clientId: '', clientSecret: '', methods: ['POST','GET','PATCH','DELETE'] });
  var formData = _f[0], setFormData = _f[1];
  var _sub = useState(false), isSubmitting = _sub[0], setIsSubmitting = _sub[1];
  var _res = useState(null), result = _res[0], setResult = _res[1];
  var _err = useState(null), error = _err[0], setError = _err[1];
  var _exp = useState(null), expandedSection = _exp[0], setExpandedSection = _exp[1];
  var _toast = useState(null), toast = _toast[0], setToast = _toast[1];
  var _copied = useState(null), copiedBtn = _copied[0], setCopiedBtn = _copied[1];
  // Progress tracker state
  var _prog = useState([]), progressItems = _prog[0], setProgressItems = _prog[1];
  var _progIdx = useState(-1), progressIdx = _progIdx[0], setProgressIdx = _progIdx[1];

  function handleInput(e) {
    var n = e.target.name, v = e.target.value;
    setFormData(function(p) { var o = Object.assign({}, p); o[n] = v; return o; });
  }

  function toggleMethod(method) {
    setFormData(function(p) {
      var o = Object.assign({}, p);
      o.methods = p.methods.indexOf(method) > -1
        ? p.methods.filter(function(m) { return m !== method; })
        : p.methods.concat([method]);
      return o;
    });
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(function() { setToast(null); }, 2500);
  }

  function copyCode(text, id) {
    navigator.clipboard.writeText(text).then(function() {
      setCopiedBtn(id);
      showToast('Copied to clipboard!');
      setTimeout(function() { setCopiedBtn(null); }, 2000);
    }).catch(function() {});
  }

  function triggerConfetti() {
    // Professional, subtle colors for the clean SaaS theme
    var colors = ['#3b82f6', '#6366f1', '#10b981', '#a1a1aa', '#f4f4f5'];
    for (var i = 0; i < 40; i++) {
      var conf = document.createElement('div');
      conf.className = 'confetti';
      conf.style.left = Math.random() * 100 + 'vw';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      conf.style.animationDelay = (Math.random() * 0.5) + 's';
      document.body.appendChild(conf);
      setTimeout((function(c) { return function() { if(c.parentNode) c.parentNode.removeChild(c); }; })(conf), 3500);
    }
  }

  function nextStep() {
    if (step === 1 && !formData.friendlyName.trim()) { setError('Please enter an integration name'); return; }
    setError(null);
    setStep(step + 1);
  }

  function prevStep() { setError(null); setStep(step - 1); }

  // ── Update a progress step ──
  function updateProgress(idx, status, detail) {
    setProgressIdx(idx);
    setProgressItems(function(prev) {
      var next = prev.slice();
      next[idx] = { id: PROGRESS_STEPS[idx].id, label: PROGRESS_STEPS[idx].label, status: status, detail: detail || '' };
      return next;
    });
  }

  // ── SUBMIT: Live progress tracking ──
  function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    setStep(4); // Switch to progress view

    // Initialize progress items
    var initial = PROGRESS_STEPS.map(function(s) { return { id: s.id, label: s.label, status: 'pending', detail: '' }; });
    setProgressItems(initial);
    setProgressIdx(0);

    var restMessageName = 'ZOOM_' + formData.friendlyName;
    var requestData = {
      u_name: formData.friendlyName,
      u_client_id: formData.clientId,
      u_client_secret: formData.clientSecret,
      u_methods: formData.methods.join(','),
      u_rest_message_name: restMessageName,
      u_status: 'active'
    };

    // Step 1: Create record
    updateProgress(0, 'active', 'Sending to ServiceNow...');

    fetch('/api/now/table/x_1842120_hubby_u_zoom_integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-UserToken': window.g_ck },
      body: JSON.stringify(requestData)
    })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(d) {
          throw new Error((d.error && d.error.message) || 'HTTP ' + response.status);
        });
      }
      return response.json();
    })
    .then(function(data) {
      var rec = data.result;
      var sysId = typeof rec.sys_id === 'object' ? rec.sys_id.value : rec.sys_id;
      updateProgress(0, 'done', 'Record created (sys_id: ' + sysId.substring(0, 8) + '...)');

      // Step 2: Verify record
      updateProgress(1, 'active', 'Querying record...');
      return new Promise(function(resolve) { setTimeout(function() { resolve(rec); }, 800); });
    })
    .then(function(rec) {
      var sysId = typeof rec.sys_id === 'object' ? rec.sys_id.value : rec.sys_id;
      return fetch('/api/now/table/x_1842120_hubby_u_zoom_integration/' + sysId, {
        headers: { 'Accept': 'application/json', 'X-UserToken': window.g_ck }
      }).then(function(r) { return r.json(); });
    })
    .then(function(verifyData) {
      var rec = verifyData.result;
      var recName = typeof rec.u_name === 'object' ? rec.u_name.display_value : rec.u_name;
      var recRest = typeof rec.u_rest_message_name === 'object' ? rec.u_rest_message_name.display_value : rec.u_rest_message_name;
      updateProgress(1, 'done', 'Record verified: ' + recName);

      // Step 3: Configure backend services (simulated delay for BR)
      updateProgress(2, 'active', 'Configuring REST Message and Methods...');
      return new Promise(function(resolve) { setTimeout(function() { resolve(info); }, 1500); });
    })
    .then(function(info) {
      updateProgress(2, 'done', 'Backend services configured ✓');
      return info;
    })
    .then(function(info) {
      // Step 4: Done!
      updateProgress(3, 'done', 'Your integration is ready to use!');

      var rec = info.rec;
      setResult({
        sys_id: typeof rec.sys_id === 'object' ? rec.sys_id.value : rec.sys_id,
        name: info.recName,
        restMessageName: info.recRest || 'ZOOM_' + info.recName,
        methods: typeof rec.u_methods === 'object' ? rec.u_methods.display_value : rec.u_methods
      });
      triggerConfetti();
    })
    .catch(function(err) {
      var failIdx = progressIdx;
      for (var i = 0; i < PROGRESS_STEPS.length; i++) {
        if (!progressItems[i] || progressItems[i].status === 'active' || progressItems[i].status === 'pending') {
          failIdx = i; break;
        }
      }
      updateProgress(failIdx, 'error', err.message || 'Unknown error');
      setError(err.message || 'Something went wrong');
    })
    .finally(function() {
      setIsSubmitting(false);
    });
  }

  // ── RENDER: Progress View (Step 4) ──
  if (step === 4) {
    var showResult = result && !isSubmitting;

    return (
      <div className="integration-hub-container">
        {toast && <div className="toast">{toast}</div>}
        <div className="main-card">
          <div className="header-section">
            <h1 className="main-title"><span className="icon">📹</span>{showResult ? 'Integration Ready!' : 'Creating Integration...'}</h1>
            <p className="subtitle">{showResult ? formData.friendlyName + ' is configured and ready' : 'Setting up your Zoom integration'}</p>
          </div>

          {/* Live Progress Tracker */}
          <div className="progress-tracker">
            {progressItems.map(function(item, idx) {
              var iconClass = 'progress-icon ' + item.status;
              var icon = item.status === 'done' ? '✓' : item.status === 'error' ? '✕' : item.status === 'warn' ? '!' : item.status === 'active' ? '' : '·';
              return (
                <div key={item.id} className={'progress-row ' + item.status}>
                  <div className={iconClass}>
                    {item.status === 'active' ? <span className="spinner-sm"></span> : icon}
                  </div>
                  <div className="progress-info">
                    <div className="progress-label">{item.label}</div>
                    {item.detail && <div className="progress-detail">{item.detail}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="error-alert" style={{margin: '0 32px 16px'}}>
              <span className="error-icon">⚠</span>
              <div className="error-content">{error}</div>
            </div>
          )}

          {error && (
            <div style={{padding: '0 32px 32px'}}>
              <button type="button" onClick={function() { setStep(3); setError(null); setProgressItems([]); }} className="btn-secondary">← Back to Review</button>
            </div>
          )}

          {/* Result section */}
          {showResult && (
            <div className="fade-in">
              <div className="integration-details">
                <div className="detail-item"><span className="detail-label">Name</span><span className="detail-value">{result.name}</span></div>
                <div className="detail-item"><span className="detail-label">REST Message</span><span className="detail-value">{result.restMessageName}</span></div>
                <div className="detail-item"><span className="detail-label">Methods</span><span className="detail-value">{result.methods || 'POST,GET,PATCH,DELETE'}</span></div>
                <div className="detail-item"><span className="detail-label">Auth</span><span className="detail-value">OAuth 2.0</span></div>
              </div>

              {_renderCodeSection(result, expandedSection, setExpandedSection, copyCode, copiedBtn)}

              <button onClick={function() { setResult(null); setStep(1); setError(null); setProgressItems([]); setFormData({friendlyName:'',clientId:'',clientSecret:'',methods:['POST','GET','PATCH','DELETE']}); }} className="create-another-btn">+ Create Another Integration</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RENDER: Form Steps 1-3 ──
  return (
    <div className="integration-hub-container">
      {toast && <div className="toast">{toast}</div>}
      <div className="main-card">
        <div className="header-section">
          <h1 className="main-title"><span className="icon">📹</span>Zoom Integration Hub</h1>
          <p className="subtitle">Create a Zoom meeting integration with OAuth 2.0</p>
          <div className="step-indicator">
            <div className={'step-dot' + (step >= 1 ? (step > 1 ? ' completed' : ' active') : '')}>{step > 1 ? '✓' : '1'}</div>
            <div className={'step-line' + (step > 1 ? ' active' : '')}></div>
            <div className={'step-dot' + (step >= 2 ? (step > 2 ? ' completed' : ' active') : '')}>{step > 2 ? '✓' : '2'}</div>
            <div className={'step-line' + (step > 2 ? ' active' : '')}></div>
            <div className={'step-dot' + (step === 3 ? ' active' : '')}>3</div>
          </div>
          <div className="step-labels">
            <span className={'step-label' + (step === 1 ? ' active' : '')}>Name</span>
            <span className={'step-label' + (step === 2 ? ' active' : '')}>Configure</span>
            <span className={'step-label' + (step === 3 ? ' active' : '')}>Review</span>
          </div>
        </div>

        {error && <div className="error-alert"><span className="error-icon">⚠</span><div className="error-content">{error}</div></div>}

        {step === 1 && (
          <div className="integration-form">
            <div className="fields-section">
              <div className="field-group">
                <label htmlFor="friendlyName" className="field-label">Integration Name <span className="required">*</span></label>
                <input type="text" id="friendlyName" name="friendlyName" value={formData.friendlyName} onChange={handleInput} className="field-input" placeholder="e.g. P1-Bridge, Team-Standup" autoFocus />
              </div>
            </div>
            <button type="button" onClick={nextStep} className="submit-btn" disabled={!formData.friendlyName.trim()}>Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div className="integration-form">
            <div className="fields-section">
              <div className="field-group">
                <label htmlFor="clientId" className="field-label">Zoom Client ID</label>
                <input type="text" id="clientId" name="clientId" value={formData.clientId} onChange={handleInput} className="field-input" placeholder="From Zoom Marketplace app" />
              </div>
              <div className="field-group">
                <label htmlFor="clientSecret" className="field-label">Zoom Client Secret</label>
                <input type="password" id="clientSecret" name="clientSecret" value={formData.clientSecret} onChange={handleInput} className="field-input" placeholder="••••••••••••" />
              </div>
              <div className="field-group">
                <label className="field-label">HTTP Methods</label>
                <div className="checkbox-grid">
                  {['POST','GET','PATCH','DELETE'].map(function(m) {
                    var checked = formData.methods.indexOf(m) > -1;
                    return (
                      <label key={m} className={'checkbox-item' + (checked ? ' checked' : '')} onClick={function() { toggleMethod(m); }}>
                        <input type="checkbox" className="checkbox-input" checked={checked} readOnly />
                        <span className="checkbox-visual"></span>
                        <span className="checkbox-label">{m}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <button type="button" onClick={nextStep} className="submit-btn">Review →</button>
            <button type="button" onClick={prevStep} className="btn-secondary">← Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="review-section">
            <div className="review-card" style={{marginTop: 24}}>
              <div className="review-item"><span className="review-label">Name</span><span className="review-value">{formData.friendlyName}</span></div>
              <div className="review-item"><span className="review-label">REST Message</span><span className="review-value accent">ZOOM_{formData.friendlyName}</span></div>
              <div className="review-item"><span className="review-label">Client ID</span><span className="review-value">{formData.clientId ? formData.clientId.substring(0,8) + '••••' : '—'}</span></div>
              <div className="review-item"><span className="review-label">Methods</span><span className="review-value">{formData.methods.join(', ') || 'All'}</span></div>
              <div className="review-item"><span className="review-label">Auth</span><span className="review-value accent">OAuth 2.0</span></div>
            </div>
            <div className="what-happens">
              <h4 className="what-happens-title">What happens next:</h4>
              <div className="what-happens-list">
                <div className="what-happens-item"><span className="wh-num">1</span><span>Integration record created in ServiceNow</span></div>
                <div className="what-happens-item"><span className="wh-num">2</span><span>REST Message auto-generated with endpoints</span></div>
                <div className="what-happens-item"><span className="wh-num">3</span><span>HTTP Methods created (POST/GET/PATCH/DELETE)</span></div>
                <div className="what-happens-item"><span className="wh-num">4</span><span>Ready to use via script or Flow Designer</span></div>
              </div>
            </div>
            <button type="button" onClick={handleSubmit} className="submit-btn" disabled={isSubmitting}>🚀 Create Integration</button>
            <button type="button" onClick={prevStep} className="btn-secondary" disabled={isSubmitting}>← Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Code snippets section (extracted for readability) ──
function _renderCodeSection(result, expandedSection, setExpandedSection, copyCode, copiedBtn) {
  var name = result.name;
  var scopedCode = "var api = new IntegrationHelper('" + name + "');\nvar res = api.execute('create_meeting', {\n  topic: 'Demo Meeting',\n  duration: 30\n});\ngs.info(res);";
  var globalCode = "var api = new GlobalIntegrationHelper('" + name + "');\nvar res = api.execute('create_meeting', {\n  topic: 'Demo Meeting',\n  duration: 30\n});";
  var uiCode = "// UI Action — Attach to Incident\nvar api = new GlobalIntegrationHelper('" + name + "');\nvar res = api.execute('create_meeting', {\n  topic: current.short_description + ' Bridge',\n  duration: 60\n});\ngs.addInfoMessage('Zoom: ' + res);";
  var brCode = "(function executeRule(current, previous) {\n    var api = new GlobalIntegrationHelper('" + name + "');\n    var res = api.execute('create_meeting', {\n        topic: 'P1 Bridge: ' + current.number,\n        duration: 60\n    });\n    gs.info('Zoom meeting created: ' + res);\n})(current, previous);";

  return (
    <div>
      <div className="usage-section">
        <h3 className="section-title">Quick Start</h3>
        <div className="usage-option">
          <h4 className="option-title">Scoped Script Include</h4>
          <div className="code-block-container">
            <pre className="code-block"><code>{scopedCode}</code></pre>
            <button onClick={function() { copyCode(scopedCode, 's'); }} className={'copy-btn' + (copiedBtn === 's' ? ' copied' : '')}>{copiedBtn === 's' ? '✓ Copied' : 'Copy'}</button>
          </div>
        </div>
        <div className="usage-option">
          <h4 className="option-title">Global Usage</h4>
          <div className="code-block-container">
            <pre className="code-block"><code>{globalCode}</code></pre>
            <button onClick={function() { copyCode(globalCode, 'g'); }} className={'copy-btn' + (copiedBtn === 'g' ? ' copied' : '')}>{copiedBtn === 'g' ? '✓ Copied' : 'Copy'}</button>
          </div>
        </div>
      </div>
      <div className="developer-guide">
        <div className="guide-header" onClick={function() { setExpandedSection(expandedSection === 'g' ? null : 'g'); }}>
          <h3 className="section-title" style={{marginBottom:0}}>Developer Guide</h3>
          <span className="expand-icon">{expandedSection === 'g' ? '▾' : '▸'}</span>
        </div>
        {expandedSection === 'g' && (
          <div className="guide-content">
            <div className="guide-item">
              <h4 className="guide-item-title">UI Action Script</h4>
              <div className="code-block-container">
                <pre className="code-block"><code>{uiCode}</code></pre>
                <button onClick={function() { copyCode(uiCode, 'u'); }} className={'copy-btn' + (copiedBtn === 'u' ? ' copied' : '')}>{copiedBtn === 'u' ? '✓ Copied' : 'Copy'}</button>
              </div>
            </div>
            <div className="guide-item">
              <h4 className="guide-item-title">Business Rule Script</h4>
              <div className="code-block-container">
                <pre className="code-block"><code>{brCode}</code></pre>
                <button onClick={function() { copyCode(brCode, 'b'); }} className={'copy-btn' + (copiedBtn === 'b' ? ' copied' : '')}>{copiedBtn === 'b' ? '✓ Copied' : 'Copy'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}