#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const analyzeBundle = () => {
  console.log('🔍 Analyzing bundle...');
  
  try {
    // Build the package first
    console.log('📦 Building package...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Check if metafile exists
    const metafilePath = join(process.cwd(), 'dist', 'react', 'index.meta.json');
    
    if (!readFileSync(metafilePath, 'utf8')) {
      console.log('❌ No metafile found. Make sure tsup is configured with metafile: true');
      return;
    }
    
    // Generate bundle analysis report
    console.log('📊 Generating bundle analysis...');
    execSync('npx tsup --analyze', { stdio: 'inherit' });
    
    // Additional bundle size analysis
    console.log('\n📏 Bundle size breakdown:');
    const distPath = join(process.cwd(), 'dist');
    
    // List all built files and their sizes
    const files = [
      'react/index.js',
      'react/index.cjs',
      'middleware/index.js',
      'middleware/index.cjs',
      'server/index.js',
      'server/index.cjs',
      'utils/index.js',
      'utils/index.cjs',
      'types/index.js',
      'types/index.cjs',
      'contexts/index.js',
      'contexts/index.cjs',
      'index.css'
    ];
    
    files.forEach(file => {
      try {
        const filePath = join(distPath, file);
        const stats = readFileSync(filePath, 'utf8');
        const sizeInBytes = Buffer.byteLength(stats, 'utf8');
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        console.log(`  ${file}: ${sizeInKB} KB`);
      } catch (error) {
        // File doesn't exist, skip
      }
    });
    
    console.log('\n✅ Bundle analysis complete!');
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message);
    process.exit(1);
  }
};

analyzeBundle(); 