import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const budgets = [
  { pattern: /client\.[^/]+\.js$/, maxBytes: 200 * 1024 },
  { pattern: /MultiStepForm\.[^/]+\.js$/, maxBytes: 120 * 1024 },
  { pattern: /index\.[^/]+\.html$/, maxBytes: 150 * 1024 }
];

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return [fullPath];
  });
};

if (!fs.existsSync(distDir)) {
  console.error('Dist directory not found. Execute "npm run build" before running the budget check.');
  process.exit(1);
}

const files = walk(distDir);
let hasError = false;

for (const budget of budgets) {
  const matched = files.filter((file) => budget.pattern.test(path.basename(file)));
  matched.forEach((file) => {
    const stats = fs.statSync(file);
    if (stats.size > budget.maxBytes) {
      hasError = true;
      console.error(`Budget exceeded: ${path.basename(file)} (${stats.size} bytes > ${budget.maxBytes} bytes)`);
    } else {
      console.info(`Budget ok: ${path.basename(file)} (${stats.size} bytes <= ${budget.maxBytes} bytes)`);
    }
  });
}

if (hasError) {
  process.exit(1);
}
console.info('Performance budgets satisfeitos.');
