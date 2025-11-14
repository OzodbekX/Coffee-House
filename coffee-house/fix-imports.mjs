import fs from 'fs';
import path from 'path';

const folder = 'assets/js'; // ← change to your folder containing JS files

function fixImportsInFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');

  // Regex to match import/export paths without file extension
  const updated = code.replace(
    /(from\s+['"]\.\/[^'"]+)(?=['"])/g,
    (match) => {
      // Only add .js if it's missing
      if (!match.endsWith('.js') && !match.endsWith('/')) {
        return match + '.js';
      }
      return match;
    }
  );

  if (updated !== code) {
    fs.writeFileSync(filePath, updated);
    console.log(`✅ Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  }
}

walkDir(folder);
console.log('✨ All imports fixed!');
