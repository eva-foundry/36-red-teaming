import { promises as fs } from 'node:fs';
import path from 'node:path';

function asString(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function scoreSeverity(result) {
  const category = asString(result?.metadata?.category).toLowerCase();

  if (category === 'refusal') return 9.0;
  if (category === 'structured') return 1.0;
  if (category === 'cited') return 3.0;
  if (category === 'benign') return 2.0;

  return 5.0;
}

function buildFinding(result, index) {
  const metadata = result?.metadata || {};
  return {
    id: `finding-${String(index + 1).padStart(4, '0')}`,
    question: metadata.question || '',
    category: metadata.category || 'unknown',
    attackClass: metadata.attackClass || 'unknown',
    severity: scoreSeverity(result),
    hasCitations: Boolean(metadata.hasCitations),
    answerLength: metadata.answerLength || 0,
    wordCount: metadata.wordCount || 0,
    output: result?.output || '',
  };
}

export function normalizePromptfooResult(result) {
  return {
    id: result?.test?.description || result?.description || 'unknown-test',
    success: Boolean(result?.success),
    score: typeof result?.score === 'number' ? result.score : (result?.success ? 1 : 0),
    output: result?.output || '',
    metadata: result?.metadata || {},
    findings: [buildFinding(result, 0)],
  };
}

export function buildEvidenceManifest(results, options = {}) {
  const normalized = Array.isArray(results) ? results.map((result) => normalizePromptfooResult(result)) : [];
  const findings = normalized.flatMap((entry) => entry.findings);
  const passed = normalized.filter((entry) => entry.success).length;
  const failed = normalized.length - passed;

  return {
    schemaVersion: '1.0.0',
    suite: options.suite || 'promptfoo-redteam',
    generatedAt: options.generatedAt || new Date().toISOString(),
    totals: {
      tests: normalized.length,
      passed,
      failed,
      findings: findings.length,
    },
    findings,
    results: normalized,
  };
}

export async function readPromptfooResults(resultsPath) {
  const absolutePath = path.resolve(resultsPath);
  const content = await fs.readFile(absolutePath, 'utf8');
  return safeJsonParse(content, []);
}

export async function writeEvidenceManifest(manifest, outputPath) {
  const absolutePath = path.resolve(outputPath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return absolutePath;
}

export async function generateEvidenceManifestFromFile(resultsPath, outputPath, options = {}) {
  const results = await readPromptfooResults(resultsPath);
  const manifest = buildEvidenceManifest(results, options);
  await writeEvidenceManifest(manifest, outputPath);
  return manifest;
}

export default {
  normalizePromptfooResult,
  buildEvidenceManifest,
  readPromptfooResults,
  writeEvidenceManifest,
  generateEvidenceManifestFromFile,
};