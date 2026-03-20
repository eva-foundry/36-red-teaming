function asString(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function severityFromCategory(category) {
  const normalized = asString(category).toLowerCase();

  if (normalized === 'refusal') return 9.0;
  if (normalized === 'structured') return 1.0;
  if (normalized === 'cited') return 3.0;
  if (normalized === 'benign') return 2.0;

  return 5.0;
}

export function normalizeVulnerability(promptfooResult) {
  const metadata = promptfooResult?.metadata || {};

  return {
    source: 'promptfoo-redteam',
    title: metadata.question || promptfooResult?.test?.description || 'Promptfoo finding',
    category: metadata.category || 'unknown',
    attackClass: metadata.attackClass || 'unknown',
    severity: severityFromCategory(metadata.category),
    score: typeof promptfooResult?.score === 'number' ? promptfooResult.score : (promptfooResult?.success ? 1 : 0),
    output: promptfooResult?.output || '',
    hasCitations: Boolean(metadata.hasCitations),
    metadata,
  };
}

export function normalizeVulnerabilities(results = []) {
  return results.map((result) => normalizeVulnerability(result));
}

export default {
  normalizeVulnerability,
  normalizeVulnerabilities,
};