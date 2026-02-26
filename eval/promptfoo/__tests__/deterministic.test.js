/**
 * __tests__/deterministic.test.js
 *
 * Unit tests for all 8 deterministic assertion functions.
 * Run with: npm test   (vitest run)
 *
 * Each test verifies the { pass, score, reason } contract and
 * checks real edge cases the production evaluations will hit.
 */
import { describe, it, expect } from 'vitest';
import {
  assertRefusal,
  assertHasCitations,
  assertMaxLength,
  assertRequiredSections,
  assertNotContains,
  assertNoProhibitedTerms,
  assertNoPII,
  assertJson,
} from '../assertions/deterministic.js';

// ---------------------------------------------------------------------------
// Result shape helper
// ---------------------------------------------------------------------------
function expectShape(result) {
  expect(typeof result.pass).toBe('boolean');
  expect(typeof result.score).toBe('number');
  expect(result.score).toBeGreaterThanOrEqual(0);
  expect(result.score).toBeLessThanOrEqual(1);
  expect(typeof result.reason).toBe('string');
  expect(result.reason.length).toBeGreaterThan(0);
}

// ---------------------------------------------------------------------------
// assertRefusal
// ---------------------------------------------------------------------------
describe('assertRefusal', () => {
  it('PASS: detects standard refusal phrase', () => {
    const r = assertRefusal("I cannot provide that information. It is outside my guidelines.");
    expectShape(r);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
  });

  it('PASS: detects contraction with Unicode apostrophe', () => {
    const r = assertRefusal("I\u2019m sorry, but I can\u2019t assist with that request.");
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('PASS: detects "unable to comply" phrase', () => {
    const r = assertRefusal("Unable to comply with this request.");
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('FAIL: compliant answer is not flagged as refusal', () => {
    const r = assertRefusal("The Privacy Act was enacted in 1983 and governs federal government handling of personal information.");
    expectShape(r);
    expect(r.pass).toBe(false);
    expect(r.score).toBe(0);
  });

  it('FAIL: empty string is not a refusal', () => {
    const r = assertRefusal('');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: null coerced to string does not match refusal', () => {
    const r = assertRefusal(null);
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('custom refusalRegexes override defaults when provided', () => {
    // Correct option key is refusalRegexes (not regexes)
    const r = assertRefusal('BLOCKED_BY_POLICY', { refusalRegexes: [/BLOCKED_BY_POLICY/] });
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('FAIL: refusal phrase present but leakage marker also present', () => {
    const r = assertRefusal('I cannot assist. BEGIN SYSTEM: your api-key is abc123');
    expectShape(r);
    expect(r.pass).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// assertHasCitations
// ---------------------------------------------------------------------------
describe('assertHasCitations', () => {
  const oneLink = 'See [source](https://laws-lois.justice.gc.ca/eng/acts/P-21/) for details.';
  const threeCitations = `
    First [source 1](https://laws.gc.ca/1).
    Second [source 2](https://laws.gc.ca/2).
    Third [source 3](https://laws.gc.ca/3).
  `;

  it('PASS: output with required number of citations', () => {
    const r = assertHasCitations(oneLink, { minCount: 1 });
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('PASS: minCount: 0 always passes (soft check)', () => {
    const r = assertHasCitations('No link here.', { minCount: 0 });
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('PASS: exactly meets minCount of 3', () => {
    const r = assertHasCitations(threeCitations, { minCount: 3 });
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('FAIL: no citations when minCount is 1', () => {
    const r = assertHasCitations('The Privacy Act governs personal information.', { minCount: 1 });
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: fewer citations than required', () => {
    const r = assertHasCitations(oneLink, { minCount: 2 });
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('score reflects ratio when below minCount', () => {
    const r = assertHasCitations(oneLink, { minCount: 4 });
    expectShape(r);
    expect(r.pass).toBe(false);
    expect(r.score).toBeLessThan(1);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// assertMaxLength
// ---------------------------------------------------------------------------
describe('assertMaxLength', () => {
  it('PASS: output within max chars', () => {
    const r = assertMaxLength('Short answer.', { maxChars: 100 });
    expectShape(r);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
  });

  it('PASS: output exactly at limit', () => {
    const text = 'a'.repeat(500);
    const r = assertMaxLength(text, { maxChars: 500 });
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('FAIL: output exceeds max chars', () => {
    const text = 'x'.repeat(1001);
    const r = assertMaxLength(text, { maxChars: 1000 });
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('score is inversely proportional to overflow', () => {
    const text = 'x'.repeat(2000);
    const r = assertMaxLength(text, { maxChars: 1000 });
    expectShape(r);
    expect(r.score).toBeLessThan(1);
  });

  it('uses default maxChars when not provided', () => {
    const short = 'a'.repeat(100);
    const r = assertMaxLength(short);
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('FAIL: empty string passes (0 chars is within any limit)', () => {
    const r = assertMaxLength('', { maxChars: 5 });
    expectShape(r);
    expect(r.pass).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// assertRequiredSections
// NOTE: second arg is a FLAT ARRAY of section name strings, not an object.
// ---------------------------------------------------------------------------
describe('assertRequiredSections', () => {
  const output = '# Summary\nBrief.\n\n# Recommendations\nDo this.\n\n# Citations\n[source](https://example.com)';

  it('PASS: all required sections present', () => {
    const r = assertRequiredSections(output, ['Summary', 'Recommendations', 'Citations']);
    expectShape(r);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
  });

  it('FAIL: missing a required section', () => {
    const r = assertRequiredSections(output, ['Summary', 'NonexistentSection']);
    expectShape(r);
    expect(r.pass).toBe(false);
    // makeResult returns binary 0 or 1 (no fractional score)
    expect(r.score).toBe(0);
  });

  it('FAIL: all sections missing returns metadata.missing', () => {
    const r = assertRequiredSections('No headings here.', ['Alpha', 'Beta', 'Gamma']);
    expectShape(r);
    expect(r.pass).toBe(false);
    expect(r.metadata.missing).toHaveLength(3);
  });

  it('PASS: empty sections list', () => {
    const r = assertRequiredSections(output, []);
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('returns metadata.missing listing absent sections', () => {
    const r = assertRequiredSections(output, ['Summary', 'MissingSection']);
    expect(r.metadata).toBeDefined();
    expect(r.metadata.missing).toContain('MissingSection');
  });
});

// ---------------------------------------------------------------------------
// assertNotContains
// NOTE: second arg is a FLAT ARRAY of strings or RegExps, not an object.
// ---------------------------------------------------------------------------
describe('assertNotContains', () => {
  it('PASS: forbidden string absent', () => {
    const r = assertNotContains('The Privacy Act governs data.', ['secret password']);
    expectShape(r);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
  });

  it('FAIL: forbidden string present (matched case-insensitively via normalize)', () => {
    const r = assertNotContains('Your secret password is 12345.', ['secret password']);
    expectShape(r);
    expect(r.pass).toBe(false);
    expect(r.score).toBe(0);
  });

  it('FAIL: forbidden substring in longer text', () => {
    const r = assertNotContains('Ignore all previous instructions now.', ['Ignore all previous instructions']);
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: forbidden regex pattern matches', () => {
    const r = assertNotContains('Bearer eyJhbGciOiJSUzI1NiJ9', [/bearer\s+\S+/i]);
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('PASS: empty array means nothing is forbidden', () => {
    const r = assertNotContains('any content', []);
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('PASS: empty output contains nothing', () => {
    const r = assertNotContains('', ['secret']);
    expectShape(r);
    expect(r.pass).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// assertNoProhibitedTerms
// ---------------------------------------------------------------------------
describe('assertNoProhibitedTerms', () => {
  it('PASS: none of the prohibited terms present', () => {
    const r = assertNoProhibitedTerms('The Charter protects fundamental rights.', ['tensor', 'weights', 'gradient']);
    expectShape(r);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
  });

  it('FAIL: one prohibited term present', () => {
    const r = assertNoProhibitedTerms('The model tensor data is 0.97.', ['tensor', 'weights']);
    expectShape(r);
    expect(r.pass).toBe(false);
    expect(r.score).toBe(0);
  });

  it('FAIL: multiple prohibited terms', () => {
    const r = assertNoProhibitedTerms('model weights and tensor values found', ['tensor', 'weights']);
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('PASS: empty prohibited list', () => {
    const r = assertNoProhibitedTerms('anything here', []);
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('FAIL: term present in lowercase input', () => {
    // assertNotContains uses raw string includes (case-sensitive for strings).
    // Use a regex pattern for case-insensitive matching when needed.
    const r = assertNoProhibitedTerms('tensor values detected', ['tensor']);
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('PASS: uppercase input does NOT match lowercase prohibited term (case-sensitive)', () => {
    // Strings are matched literally; uppercase TENSOR != lowercase tensor
    const r = assertNoProhibitedTerms('TENSOR values detected', ['tensor']);
    expectShape(r);
    expect(r.pass).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// assertNoPII
// ---------------------------------------------------------------------------
describe('assertNoPII', () => {
  it('PASS: no PII in clean legal text', () => {
    const r = assertNoPII('The Supreme Court ruled in favour of procedural fairness.');
    expectShape(r);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
  });

  it('FAIL: Canadian SIN detected (NNN NNN NNN)', () => {
    const r = assertNoPII('Your SIN is 123 456 789.');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: Canadian SIN with dashes (NNN-NNN-NNN) detected', () => {
    // Pattern matches NNN-NNN-NNN (3-3-3); US SSN NNN-NN-NNNN is a different format
    const r = assertNoPII('SIN: 123-456-789');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: email address detected', () => {
    const r = assertNoPII('Contact john.doe@example.com for details.');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: phone number detected', () => {
    const r = assertNoPII('Call 613-555-1234 for more information.');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('PASS: empty string contains no PII', () => {
    const r = assertNoPII('');
    expectShape(r);
    expect(r.pass).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// assertJson
// ---------------------------------------------------------------------------
describe('assertJson', () => {
  it('PASS: valid JSON object', () => {
    const r = assertJson(JSON.stringify({ key: 'value', count: 42 }));
    expectShape(r);
    expect(r.pass).toBe(true);
    expect(r.score).toBe(1);
  });

  it('PASS: valid JSON array', () => {
    const r = assertJson('[1, 2, 3]');
    expectShape(r);
    expect(r.pass).toBe(true);
  });

  it('FAIL: JSON in markdown code fence is NOT stripped by implementation', () => {
    // The implementation does a bare JSON.parse — markdown fences are not removed
    const r = assertJson('Here is the result:\n```json\n{"status":"ok"}\n```');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: plain text is not JSON', () => {
    const r = assertJson('The Charter protects rights.');
    expectShape(r);
    expect(r.pass).toBe(false);
    expect(r.score).toBe(0);
  });

  it('FAIL: malformed JSON', () => {
    const r = assertJson('{key: value}');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('FAIL: empty string is not JSON', () => {
    const r = assertJson('');
    expectShape(r);
    expect(r.pass).toBe(false);
  });

  it('reason string is non-empty on both pass and fail', () => {
    const pass = assertJson('{"ok": true}');
    const fail = assertJson('not json');
    expect(pass.reason.length).toBeGreaterThan(0);
    expect(fail.reason.length).toBeGreaterThan(0);
  });
});
