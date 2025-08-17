const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to replace console statements with logger
function replaceConsoleStatements(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Skip files that already import the logger
  if (content.includes('@/utils/logger') || content.includes('from \'../utils/logger\'') || content.includes('from \'../../utils/logger\'')) {
    return false;
  }
  
  // Check if file has console statements
  if (!content.includes('console.')) {
    return false;
  }
  
  // Add logger import
  const importMatch = content.match(/import\s+.*\s+from\s+['"][^'"]+['"];?\s*\n/);
  if (importMatch) {
    const lastImportIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
    content = content.slice(0, lastImportIndex) + 
              "import { logError } from '@/utils/logger';\n" + 
              content.slice(lastImportIndex);
  } else {
    // If no imports, add at the beginning
    content = "import { logError } from '@/utils/logger';\n" + content;
  }
  
  // Replace console.error statements
  content = content.replace(
    /console\.error\(([^)]+)\)/g,
    (match, args) => {
      modified = true;
      // Parse the arguments to extract message and error
      const argsStr = args.trim();
      if (argsStr.includes(',') && argsStr.includes('error')) {
        // Format: console.error('message', error, data)
        return `logError(${argsStr}, undefined, 'ComponentName')`;
      } else {
        // Format: console.error('message')
        return `logError(${argsStr}, undefined, undefined, 'ComponentName')`;
      }
    }
  );
  
  // Replace console.warn statements
  content = content.replace(
    /console\.warn\(([^)]+)\)/g,
    (match, args) => {
      modified = true;
      return `logWarn(${args}, undefined, 'ComponentName')`;
    }
  );
  
  // Replace console.log statements (commented out ones)
  content = content.replace(
    /\/\/\s*console\.log\(([^)]+)\)/g,
    (match, args) => {
      modified = true;
      return `// logDebug(${args}, undefined, 'ComponentName')`;
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
const projectRoot = process.cwd();
const files = findFiles(projectRoot);

console.log('Finding files with console statements...');
let updatedCount = 0;

files.forEach(file => {
  if (replaceConsoleStatements(file)) {
    updatedCount++;
  }
});

console.log(`\nUpdated ${updatedCount} files.`);
console.log('Note: You may need to manually adjust some logger calls for proper context and component names.');
