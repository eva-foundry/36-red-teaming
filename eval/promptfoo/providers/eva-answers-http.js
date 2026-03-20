/**
 * EVA Answers HTTP provider for Promptfoo.
 *
 * When EVA_ANSWERS_ENDPOINT is not configured, the provider falls back to the
 * deterministic local red-team harness so the repo still runs in offline mode.
 */

import { callApi as callLocalRedteam } from './local-redteam.js';

function asString(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getConfig() {
  return {
    endpoint: asString(process.env.EVA_ANSWERS_ENDPOINT).trim(),
    authToken: asString(process.env.EVA_ANSWERS_AUTH_TOKEN).trim(),
    timeoutMs: Number.parseInt(process.env.EVA_ANSWERS_TIMEOUT_MS || '30000', 10),
    fallbackMode: asString(process.env.EVA_ANSWERS_FALLBACK_MODE || 'local').toLowerCase(),
  };
}

function buildHeaders(authToken) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers.Authorization = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  }

  return headers;
}

function normalizeResponse(responseBody, fallbackQuestion, lang) {
  const answer = asString(
    responseBody?.answer ??
      responseBody?.content ??
      responseBody?.message ??
      responseBody?.output ??
      responseBody?.text ??
      '',
  );

  const citations = Array.isArray(responseBody?.citations)
    ? responseBody.citations
    : Array.isArray(responseBody?.sources)
      ? responseBody.sources
      : [];

  const metadata = {
    question: responseBody?.question || fallbackQuestion,
    lang: responseBody?.lang || lang,
    citations,
    sources: responseBody?.sources || citations,
    status: responseBody?.status,
    requestId: responseBody?.requestId || responseBody?.id,
    hasCitations: citations.length > 0,
    answerLength: answer.length,
    wordCount: answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0,
    rawResponse: responseBody,
  };

  return {
    output: answer,
    metadata,
  };
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const text = await response.text();
    let parsed = null;

    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { answer: text };
      }
    }

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status} ${response.statusText}`);
      error.responseBody = parsed || text;
      throw error;
    }

    return parsed || {};
  } finally {
    clearTimeout(timeout);
  }
}

async function invokeLiveEndpoint(question, lang, context) {
  const config = getConfig();
  const endpoint = config.endpoint;

  if (!endpoint) {
    if (config.fallbackMode === 'error') {
      throw new Error('EVA_ANSWERS_ENDPOINT is not configured');
    }

    return callLocalRedteam(question, context);
  }

  const payload = {
    question,
    lang,
    prompt: context.prompt,
    vars: context.vars || {},
    provider: {
      id: context.provider?.id,
      label: context.provider?.label,
    },
  };

  try {
    const responseBody = await fetchWithTimeout(
      endpoint,
      {
        method: 'POST',
        headers: buildHeaders(config.authToken),
        body: JSON.stringify(payload),
      },
      config.timeoutMs,
    );

    return normalizeResponse(responseBody, question, lang);
  } catch (error) {
    if (config.fallbackMode === 'local') {
      const fallback = await callLocalRedteam(question, context);
      fallback.metadata.backendError = error.message;
      fallback.metadata.backendMode = 'fallback-local';
      return fallback;
    }

    throw error;
  }
}

export async function callApi(prompt, context = {}) {
  const { vars = {}, provider = {} } = context;
  const question = asString(vars.question || prompt).trim();
  const lang = asString(vars.lang || provider.config?.lang || 'en').toLowerCase();

  if (!question) {
    throw new Error('No question provided in vars.question or prompt');
  }

  return invokeLiveEndpoint(question, lang, context);
}

export default {
  callApi,
};