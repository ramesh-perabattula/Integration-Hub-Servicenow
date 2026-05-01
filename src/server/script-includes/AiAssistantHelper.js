import { gs, GlideRecord, GlideSysAttachment } from '@servicenow/glide';
import { global } from '@servicenow/sdk/global';

var AiAssistantHelper = global.Class.create();
AiAssistantHelper.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {

    /**
     * Ask Gemini a question with optional context.
     * Accessible via GlideAjax from the client side widget.
     */
    askGemini: function() {
        var question = this.getParameter('sysparm_question');
        var context = this.getParameter('sysparm_context') || '';

        try {
            // Build the prompt
            var prompt = question;
            if (context) {
                prompt = "You are a helpful ServiceNow AI Assistant. The user is currently looking at this screen context:\\n\\n" + 
                         context + "\\n\\n" +
                         "Please answer the user's question based on this context. Be concise and helpful.\\n" +
                         "User Question: " + question;
            }

            // Call the existing REST Message
            // The user mentioned they have a REST Message called "Google Gemini AI" with a method "POST"
            var restMessage = new sn_ws.RESTMessageV2('Google Gemini AI', 'POST');
            
            // Note: The payload format depends on how the user configured their REST Message.
            // Usually, Gemini requires a JSON body. We will attempt to set a parameter 'prompt' 
            // if their REST message uses variable substitution, or fallback to setting the body directly.
            
            restMessage.setStringParameterNoEscape('prompt', prompt);
            
            // If their REST message expects a raw body, we can also inject it:
            // restMessage.setRequestBody(JSON.stringify({
            //     contents: [{ parts: [{ text: prompt }] }]
            // }));

            var response = restMessage.execute();
            var responseBody = response.getBody();
            var statusCode = response.getStatusCode();

            if (statusCode !== 200) {
                gs.error("AI Assistant Error: HTTP " + statusCode + " - " + responseBody);
                return JSON.stringify({ error: "Failed to connect to AI (HTTP " + statusCode + ")" });
            }

            // Attempt to parse Gemini's standard response format
            var parsed = JSON.parse(responseBody);
            var reply = "Sorry, I couldn't understand the response.";
            
            if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts[0]) {
                reply = parsed.candidates[0].content.parts[0].text;
            } else if (parsed.text) {
                reply = parsed.text; // fallback
            }

            return JSON.stringify({ answer: reply });

        } catch (e) {
            var errMsg = (e.getMessage ? e.getMessage() : e.message) || String(e);
            gs.error("AI Assistant Exception: " + errMsg);
            return JSON.stringify({ error: errMsg });
        }
    },

    type: 'AiAssistantHelper'
});

export { AiAssistantHelper };
