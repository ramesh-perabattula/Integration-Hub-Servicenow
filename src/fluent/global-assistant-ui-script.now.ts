import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const globalAssistantUiScript = Record({
    $id: Now.ID['global_assistant_ui_script'],
    table: 'sys_ui_script',
    data: {
        name: 'x_1842120_hubby.GlobalAssistant',
        global: true,
        active: true,
        description: 'Global AI Assistant injected into all ServiceNow Classic UI pages.',
        script: `
(function() {
    // Prevent multiple injections
    if (window._aiAssistantInjected) return;
    window._aiAssistantInjected = true;

    // Run when DOM is ready
    function initAssistant() {
        // Prevent loading in tiny iframes or non-HTML documents
        if (window.innerWidth < 400 || window.innerHeight < 400) return;
        
        // Create the host element for Shadow DOM
        var host = document.createElement('div');
        host.id = 'ai-assistant-global-host';
        host.style.position = 'fixed';
        host.style.bottom = '24px';
        host.style.right = '24px';
        host.style.zIndex = '2147483647'; // Max z-index to stay above everything
        document.body.appendChild(host);

        // Attach Shadow DOM (Production Grade: isolates CSS from ServiceNow)
        var shadow = host.attachShadow({ mode: 'open' });

        // Define Styles
        var style = document.createElement('style');
        style.textContent = \`
            :host {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                box-sizing: border-box;
            }
            *, *::before, *::after { box-sizing: inherit; }
            
            .ai-fab {
                width: 56px; height: 56px;
                border-radius: 50%;
                background: #0f172a;
                border: 1px solid #334155;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
                color: white; font-size: 1.5rem;
                position: absolute; bottom: 0; right: 0;
            }
            .ai-fab:hover { transform: scale(1.08); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
            .ai-fab.hidden { transform: scale(0); opacity: 0; pointer-events: none; }
            
            .ai-chat-window {
                position: absolute; bottom: 0; right: 0;
                width: 340px; height: 500px; max-height: calc(100vh - 48px);
                background-color: #09090b;
                border-radius: 16px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                display: flex; flex-direction: column; overflow: hidden;
                border: 1px solid #27272a;
                transform-origin: bottom right;
                transform: scale(0.9); opacity: 0; pointer-events: none;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
            }
            .ai-chat-window.open { transform: scale(1); opacity: 1; pointer-events: auto; }
            
            .ai-header {
                padding: 16px 20px; background-color: #18181b; border-bottom: 1px solid #27272a;
                display: flex; align-items: center; justify-content: space-between;
                color: #fafafa; font-weight: 600; font-size: 0.95rem;
            }
            .ai-close-btn {
                background: none; border: none; font-size: 1.5rem; line-height: 1;
                color: #a1a1aa; cursor: pointer; transition: color 0.2s ease;
            }
            .ai-close-btn:hover { color: #fafafa; }
            
            .ai-messages {
                flex: 1; padding: 16px; overflow-y: auto;
                display: flex; flex-direction: column; gap: 12px;
            }
            .ai-msg-row { display: flex; width: 100%; }
            .ai-msg-row.user { justify-content: flex-end; }
            .ai-msg-row.assistant { justify-content: flex-start; }
            
            .ai-bubble {
                max-width: 85%; padding: 10px 14px; border-radius: 12px;
                font-size: 0.875rem; line-height: 1.4; word-wrap: break-word;
            }
            .ai-msg-row.user .ai-bubble { background-color: #fafafa; color: #09090b; border-bottom-right-radius: 4px; }
            .ai-msg-row.assistant .ai-bubble { background-color: #27272a; color: #fafafa; border-bottom-left-radius: 4px; }
            
            .ai-input-area {
                padding: 12px 16px; border-top: 1px solid #27272a; background-color: #18181b;
                display: flex; align-items: center; gap: 8px;
            }
            .ai-input {
                flex: 1; background: none; border: none; font-family: inherit; font-size: 0.875rem;
                resize: none; max-height: 80px; height: 40px; padding: 10px 0; outline: none; color: #fafafa;
            }
            .ai-input::placeholder { color: #71717a; }
            .ai-send-btn {
                width: 32px; height: 32px; border-radius: 8px; border: none;
                background-color: #fafafa; color: #09090b;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: opacity 0.2s ease;
            }
            .ai-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            
            .ai-typing { display: flex; gap: 4px; padding: 6px 4px; }
            .ai-dot { width: 6px; height: 6px; background-color: #a1a1aa; border-radius: 50%; animation: aiBounce 1.4s infinite ease-in-out both; }
            .ai-dot:nth-child(1) { animation-delay: -0.32s; }
            .ai-dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes aiBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            
            /* Custom Scrollbar for sleekness */
            .ai-messages::-webkit-scrollbar { width: 6px; }
            .ai-messages::-webkit-scrollbar-track { background: transparent; }
            .ai-messages::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        \`;

        // Define HTML Structure
        var container = document.createElement('div');
        container.innerHTML = \`
            <button class="ai-fab">✨</button>
            <div class="ai-chat-window">
                <div class="ai-header">
                    <span>✨ AI Co-Pilot</span>
                    <button class="ai-close-btn">&times;</button>
                </div>
                <div class="ai-messages">
                    <div class="ai-msg-row assistant">
                        <div class="ai-bubble">Hi! I am your AI Co-Pilot. I can read this page. How can I help you today?</div>
                    </div>
                </div>
                <div class="ai-input-area">
                    <textarea class="ai-input" placeholder="Ask about this page..."></textarea>
                    <button class="ai-send-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    </button>
                </div>
            </div>
        \`;

        shadow.appendChild(style);
        shadow.appendChild(container);

        // Elements
        var fab = shadow.querySelector('.ai-fab');
        var chatWindow = shadow.querySelector('.ai-chat-window');
        var closeBtn = shadow.querySelector('.ai-close-btn');
        var messagesDiv = shadow.querySelector('.ai-messages');
        var inputField = shadow.querySelector('.ai-input');
        var sendBtn = shadow.querySelector('.ai-send-btn');
        
        var isProcessing = false;

        // Toggle Logic
        fab.addEventListener('click', function() {
            fab.classList.add('hidden');
            chatWindow.classList.add('open');
            inputField.focus();
        });
        closeBtn.addEventListener('click', function() {
            chatWindow.classList.remove('open');
            fab.classList.remove('hidden');
        });

        function addMessage(role, text) {
            var row = document.createElement('div');
            row.className = 'ai-msg-row ' + role;
            var bubble = document.createElement('div');
            bubble.className = 'ai-bubble';
            bubble.innerText = text;
            row.appendChild(bubble);
            messagesDiv.appendChild(row);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function showTyping() {
            var row = document.createElement('div');
            row.className = 'ai-msg-row assistant ai-typing-indicator';
            var bubble = document.createElement('div');
            bubble.className = 'ai-bubble ai-typing';
            bubble.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
            row.appendChild(bubble);
            messagesDiv.appendChild(row);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function hideTyping() {
            var typingEl = shadow.querySelector('.ai-typing-indicator');
            if (typingEl) typingEl.remove();
        }

        function handleSend() {
            var text = inputField.value.trim();
            if (!text || isProcessing) return;

            inputField.value = '';
            addMessage('user', text);
            isProcessing = true;
            sendBtn.disabled = true;
            inputField.disabled = true;
            showTyping();

            // Get Context
            var context = document.body.innerText.substring(0, 3000);

            // Call Backend
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/xmlhttp.do', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            // Handle CSRF Token for ServiceNow
            if (window.g_ck) xhr.setRequestHeader('X-UserToken', window.g_ck);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    hideTyping();
                    isProcessing = false;
                    sendBtn.disabled = false;
                    inputField.disabled = false;
                    inputField.focus();

                    if (xhr.status === 200) {
                        try {
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
                            var answerAttr = xmlDoc.documentElement.getAttribute("answer");
                            var data = JSON.parse(answerAttr);
                            
                            if (data.error) addMessage('assistant', "Error: " + data.error);
                            else addMessage('assistant', data.answer || "I'm not sure how to respond to that.");
                        } catch(e) {
                            addMessage('assistant', "Sorry, I received an invalid response from the server.");
                        }
                    } else {
                        addMessage('assistant', "Network Error: Could not connect to backend.");
                    }
                }
            };

            var params = 'sysparm_processor=x_1842120_hubby.AiAssistantHelper' +
                         '&sysparm_name=askGemini' +
                         '&sysparm_question=' + encodeURIComponent(text) +
                         '&sysparm_context=' + encodeURIComponent(context);
                         
            xhr.send(params);
        }

        sendBtn.addEventListener('click', handleSend);
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAssistant();
    } else {
        document.addEventListener('DOMContentLoaded', initAssistant);
    }
})();
        `
    }
});
