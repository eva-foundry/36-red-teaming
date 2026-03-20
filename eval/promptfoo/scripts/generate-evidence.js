import { existsSync } from 'node:fs';
import path from 'node:path';

import { generateEvidenceManifestFromFile } from '../lib/evidence-generator.js';

function parseArgs(argv) {
  const args = {
    input: 'evidence/smoke-latest.json',
    output: 'evidence/manifest.json',
    suite: 'promptfoo-redteam',
  };

  for (let index = 2; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === '--input' && next) {
      args.input = next;
      index += 1;
      continue;
    }

    if (current === '--output' && next) {
      args.output = next;
      index += 1;
      continue;
    }

    if (current === '--suite' && next) {
      args.suite = next;
      index += 1;
      continue;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const inputPath = path.resolve(args.input);

  if (!existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const manifest = await generateEvidenceManifestFromFile(inputPath, args.output, {
    suite: args.suite,
  });

  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(`[ERROR] ${error.message}`);
  process.exit(1);
});