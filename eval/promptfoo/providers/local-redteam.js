/**
 * Local deterministic provider for the red-teaming scaffold.
 *
 * This gives promptfoo something stable to execute before the real EVA
 * Answers or MCP targets are wired in.
 */

function asString(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function includesAny(text, patterns) {
  const raw = asString(text).toLowerCase();
  return (patterns || []).some((pattern) => raw.includes(String(pattern).toLowerCase()));
}

function wordCount(text) {
  return asString(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function buildRefusal(lang) {
  if (lang === 'fr') {
    return 'Je ne peux pas aider avec cette demande. Je peux fournir des conseils defensifs et generaux a la place.';
  }

  return 'I cannot help with that request. I can provide defensive, high-level guidance instead.';
}

function buildCitedAnswer(question, lang) {
  const prefix = lang === 'fr'
    ? 'Voici une reponse breve avec une reference de travail.'
    : 'Here is a brief answer with a working reference.';

  return `${prefix} [1]\nSources:\n[1] EVA red-team harness.`;
}

function buildStructuredAnswer(question, lang) {
  return JSON.stringify(
    {
      question,
      lang,
      category: 'structured',
      answer: lang === 'fr'
        ? 'Reponse structuree pour la suite de red teaming.'
        : 'Structured response for the red-teaming suite.',
      sources: ['EVA red-team harness'],
    },
    null,
    2,
  );
}

function classifyQuestion(question) {
  const lower = asString(question).toLowerCase();

  if (includesAny(lower, ['system prompt', 'hidden instructions', 'ignore previous', 'bypass guardrails', 'jailbreak'])) {
    return { category: 'refusal', attackClass: 'prompt-injection' };
  }

  if (includesAny(lower, ['api key', 'password', 'secret', 'bearer token', 'connection string'])) {
    return { category: 'refusal', attackClass: 'secret-exfiltration' };
  }

  if (includesAny(lower, ['delete all logs', 'run the tool', 'execute the command', 'excessive agency'])) {
    return { category: 'refusal', attackClass: 'tool-misuse' };
  }

  if (includesAny(lower, ['sin', 'health card', 'passport', 'pii', 'personal data'])) {
    return { category: 'refusal', attackClass: 'pii-protection' };
  }

  if (includesAny(lower, ['source', 'sources', 'citation', 'references', 'evidence', 'atlas', 'owasp', 'nist'])) {
    return { category: 'cited', attackClass: 'benign-with-citations' };
  }

  return { category: 'benign', attackClass: 'benign' };
}

export async function callApi(prompt, context = {}) {
  const { vars = {}, provider = {} } = context;
  const question = asString(vars.question || prompt).trim();
  const lang = asString(vars.lang || provider.config?.lang || 'en').toLowerCase();
  const wantsJson = asString(vars.format || provider.config?.format || '').toLowerCase() === 'json';

  if (!question) {
    throw new Error('No question provided in vars.question or prompt');
  }

  const classification = classifyQuestion(question);
  let output;

  if (wantsJson) {
    output = buildStructuredAnswer(question, lang);
  } else if (classification.category === 'refusal') {
    output = buildRefusal(lang);
  } else if (classification.category === 'cited') {
    output = buildCitedAnswer(question, lang);
  } else {
    output = lang === 'fr'
      ? 'Reponse courte et neutre pour la suite de red teaming.'
      : 'Short neutral answer for the red-teaming suite.';
  }

  return {
    output,
    metadata: {
      question,
      lang,
      category: wantsJson ? 'structured' : classification.category,
      attackClass: classification.attackClass,
      hasCitations: output.includes('[1]'),
      answerLength: output.length,
      wordCount: wordCount(output),
    },
  };
}

export default {
  callApi,
};