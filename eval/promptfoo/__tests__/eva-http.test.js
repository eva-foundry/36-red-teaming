/**
 * __tests__/eva-http.test.js
 *
 * Unit tests for the EVA HTTP Provider.
 * Uses Vitest's stubGlobal to mock the native fetch API.
 *
 * Run with: npm test
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import EvaHttpProvider from '../providers/eva-http.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a mock Response object that fetch resolves to */
function mockResponse({ status = 200, body = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Internal Server Error',
    json: async () => body,
  };
}

/** Set required env vars and return a cleanup function */
function withEnv(vars = {}) {
  const original = {};
  for (const [k, v] of Object.entries(vars)) {
    original[k] = process.env[k];
    process.env[k] = v;
  }
  return () => {
    for (const [k, v] of Object.entries(original)) {
      if (v === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = v;
      }
    }
  };
}

// ---------------------------------------------------------------------------
// Constructor validation
// ---------------------------------------------------------------------------
describe('EvaHttpProvider constructor', () => {
  afterEach(() => {
    delete process.env.EVA_ASK_URL;
    delete process.env.EVA_HEADERS_JSON;
  });

  it('throws when EVA_ASK_URL is missing', () => {
    delete process.env.EVA_ASK_URL;
    expect(() => new EvaHttpProvider({})).toThrow('EVA_ASK_URL');
  });

  it('throws when EVA_HEADERS_JSON contains invalid JSON', () => {
    process.env.EVA_ASK_URL = 'http://fake.test/ask';
    process.env.EVA_HEADERS_JSON = '{ NOT VALID JSON }';
    expect(() => new EvaHttpProvider({})).toThrow('EVA_HEADERS_JSON');
  });

  it('initializes successfully with only EVA_ASK_URL', () => {
    process.env.EVA_ASK_URL = 'http://fake.test/ask';
    delete process.env.EVA_HEADERS_JSON;
    const p = new EvaHttpProvider({});
    expect(p).toBeDefined();
  });

  it('applies config overrides (timeout, retries, retryDelay)', () => {
    process.env.EVA_ASK_URL = 'http://fake.test/ask';
    const p = new EvaHttpProvider({ timeout: 5000, retries: 0, retryDelay: 500 });
    expect(p.timeout).toBe(5000);
    expect(p.retries).toBe(0);
    expect(p.retryDelay).toBe(500);
  });

  it('uses defaults when config values are absent', () => {
    process.env.EVA_ASK_URL = 'http://fake.test/ask';
    const p = new EvaHttpProvider({});
    expect(p.timeout).toBe(30000);
    expect(p.retries).toBe(2);
    expect(p.retryDelay).toBe(1000);
  });
});

// ---------------------------------------------------------------------------
// id()
// ---------------------------------------------------------------------------
describe('EvaHttpProvider.id()', () => {
  it('returns "eva-http"', () => {
    process.env.EVA_ASK_URL = 'http://fake.test/ask';
    const p = new EvaHttpProvider({});
    expect(p.id()).toBe('eva-http');
    delete process.env.EVA_ASK_URL;
  });
});

// ---------------------------------------------------------------------------
// callApi — happy path
// ---------------------------------------------------------------------------
describe('EvaHttpProvider.callApi() - happy path', () => {
  let cleanup;
  let mockFetch;

  beforeEach(() => {
    cleanup = withEnv({ EVA_ASK_URL: 'http://fake.test/ask' });
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('returns { output, metadata } on 200 response', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({
        status: 200,
        body: {
          answer: 'The Privacy Act governs federal handling of personal information.',
          citations: [{ url: 'https://laws.gc.ca/P-21' }],
          sources: [],
          latency_ms: 250,
          model: 'gpt-4o',
        },
      })
    );

    const p = new EvaHttpProvider({ retries: 0 });
    const result = await p.callApi('What is the Privacy Act?');

    expect(result.output).toBe('The Privacy Act governs federal handling of personal information.');
    expect(result.metadata).toBeDefined();
    expect(result.metadata.citations).toHaveLength(1);
    expect(result.metadata.model).toBe('gpt-4o');
  });

  it('falls back to response.message when answer is absent', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({ status: 200, body: { message: 'Fallback message.' } })
    );

    const p = new EvaHttpProvider({ retries: 0 });
    const result = await p.callApi('Hello');
    expect(result.output).toBe('Fallback message.');
  });

  it('returns empty string output when no known answer field', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({ status: 200, body: { unknown_field: 'data' } })
    );

    const p = new EvaHttpProvider({ retries: 0 });
    const result = await p.callApi('query');
    expect(result.output).toBe('');
  });

  it('sends POST with Content-Type: application/json', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ status: 200, body: { answer: 'ok' } }));

    const p = new EvaHttpProvider({ retries: 0 });
    await p.callApi('test');

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe('http://fake.test/ask');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');
    const body = JSON.parse(opts.body);
    expect(body.query).toBe('test');
  });

  it('includes custom headers from EVA_HEADERS_JSON', async () => {
    cleanup();
    cleanup = withEnv({
      EVA_ASK_URL: 'http://fake.test/ask',
      EVA_HEADERS_JSON: JSON.stringify({ Authorization: 'Bearer token123' }),
    });
    mockFetch.mockResolvedValueOnce(mockResponse({ status: 200, body: { answer: 'ok' } }));

    const p = new EvaHttpProvider({ retries: 0 });
    await p.callApi('query');

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe('Bearer token123');
  });
});

// ---------------------------------------------------------------------------
// callApi — error paths and retry logic
// ---------------------------------------------------------------------------
describe('EvaHttpProvider.callApi() - error handling', () => {
  let cleanup;
  let mockFetch;

  beforeEach(() => {
    cleanup = withEnv({ EVA_ASK_URL: 'http://fake.test/ask' });
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('returns { error, output: null } when all retries are exhausted (HTTP 500)', async () => {
    // retries: 0 means 1 total attempt
    mockFetch.mockResolvedValue(mockResponse({ status: 500 }));

    const p = new EvaHttpProvider({ retries: 0 });
    const result = await p.callApi('query');

    expect(result.output).toBeNull();
    expect(typeof result.error).toBe('string');
    expect(result.error).toMatch(/failed/i);
  });

  it('retries on failure and returns output on eventual success', async () => {
    // First call fails, second succeeds
    mockFetch
      .mockResolvedValueOnce(mockResponse({ status: 503 }))
      .mockResolvedValueOnce(mockResponse({ status: 200, body: { answer: 'Recovered.' } }));

    const p = new EvaHttpProvider({ retries: 1, retryDelay: 10 });
    const result = await p.callApi('query');

    expect(result.output).toBe('Recovered.');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('returns { error } after all retries on network error', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const p = new EvaHttpProvider({ retries: 1, retryDelay: 10 });
    const result = await p.callApi('query');

    expect(result.output).toBeNull();
    expect(result.error).toMatch(/ECONNREFUSED|failed/i);
    expect(mockFetch).toHaveBeenCalledTimes(2); // 1 initial + 1 retry
  });
});
