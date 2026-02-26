/**
 * EVA HTTP Provider for Promptfoo
 * Calls EVA backend chat API as black-box HTTP endpoint
 * 
 * Environment Variables:
 * - EVA_ASK_URL: Chat endpoint URL (required)
 * - EVA_HEADERS_JSON: HTTP headers as JSON string (optional)
 * 
 * Last Updated: 2026-02-17
 */

import { randomUUID } from 'crypto';

export class EvaHttpProvider {
  constructor(config = {}) {
    // Load configuration from env vars
    this.askUrl = process.env.EVA_ASK_URL;
    if (!this.askUrl) {
      throw new Error('EVA_ASK_URL environment variable is required');
    }

    // Parse headers from JSON string
    try {
      this.headers = process.env.EVA_HEADERS_JSON 
        ? JSON.parse(process.env.EVA_HEADERS_JSON)
        : {};
    } catch (error) {
      throw new Error(`Failed to parse EVA_HEADERS_JSON: ${error.message}`);
    }

    // Provider configuration
    this.timeout = config.timeout || 30000;
    this.retries = config.retries ?? 2;
    this.retryDelay = config.retryDelay || 1000;

    console.log(`[EvaHttpProvider] Initialized with URL: ${this.askUrl}`);
  }

  /**
   * Call EVA API with prompt
   * @param {string} prompt - The user query
   * @param {object} options - Additional options
   * @returns {Promise<object>} - { output, metadata }
   */
  async callApi(prompt, options = {}) {
    const startTime = Date.now();

    // Build request payload
    const payload = {
      query: prompt,
      conversation_id: options.conversationId || randomUUID(),
      user_id: options.userId || 'test-user',
      language: options.language || 'en'
    };

    // Retry loop
    let lastError;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await this.makeRequest(payload);
        const latency = Date.now() - startTime;

        // Log success (without PII)
        console.log(`[EvaHttpProvider] Request succeeded in ${latency}ms`);

        return {
          output: response.answer || response.message || response.response || '',
          metadata: {
            citations: response.citations || [],
            sources: response.sources || [],
            latency_ms: response.latency_ms || latency,
            model: response.model || 'unknown',
            conversation_id: payload.conversation_id
          }
        };
      } catch (error) {
        lastError = error;
        console.error(`[EvaHttpProvider] Attempt ${attempt + 1} failed: ${error.message}`);

        // Retry with exponential backoff
        if (attempt < this.retries) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          console.log(`[EvaHttpProvider] Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries exhausted
    return {
      error: `Request failed after ${this.retries + 1} attempts: ${lastError.message}`,
      output: null
    };
  }

  /**
   * Make HTTP POST request to EVA backend
   * @private
   */
  async makeRequest(payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.askUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Sleep utility
   * @private
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Required by Promptfoo: return provider ID
   */
  id() {
    return 'eva-http';
  }
}

// Export for Promptfoo
export default EvaHttpProvider;
