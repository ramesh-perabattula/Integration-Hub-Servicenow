import React, { useState, useRef, useEffect } from 'react';
import './FloatingAssistant.css';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your AI Co-Pilot. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Read the visible text from the page to use as context
  function getPageContext() {
    return document.body.innerText.substring(0, 3000); // Send up to 3000 chars of context
  }

  function handleSend() {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const context = getPageContext();

    // Call ServiceNow GlideAjax
    const url = '/api/now/table/sys_script_include'; // A hacky way to call GlideAjax via REST if we are in UI Builder
    // Actually, in a React app hosted on ServiceNow, we can use the Table API to call a Scripted REST API,
    // or if we have access to GlideAjax, we can use it. Since `window.GlideAjax` might not be available
    // in all modern SN React contexts without UI Builder setup, we will use a raw XMLHttpRequest or fetch 
    // to the GlideAjax processor endpoint: `xmlhttp.do`.
    
    const params = new URLSearchParams();
    params.append('sysparm_processor', 'x_1842120_hubby.AiAssistantHelper'); // Scope is usually required
    params.append('sysparm_name', 'askGemini');
    params.append('sysparm_question', userText);
    params.append('sysparm_context', context);

    fetch('/xmlhttp.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-UserToken': window.g_ck
      },
      body: params.toString()
    })
    .then(response => response.text())
    .then(xmlString => {
      // Parse GlideAjax XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const answerNode = xmlDoc.documentElement.getAttribute("answer");
      
      if (!answerNode) throw new Error("Empty response from AI");
      
      const data = JSON.parse(answerNode);
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
    })
    .catch(err => {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to Gemini: ' + err.message }]);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="ai-assistant-wrapper">
      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? 'open' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-header-title">
            <span className="ai-sparkle">✨</span> AI Co-Pilot
          </div>
          <button className="ai-close-btn" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message-row ${msg.role}`}>
              <div className="ai-message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message-row assistant">
              <div className="ai-message-bubble typing">
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-area">
          <textarea 
            className="ai-chat-input"
            placeholder="Ask about this page..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button className="ai-send-btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className={`ai-fab ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <span className="ai-fab-icon">✨</span>
      </button>
    </div>
  );
}
