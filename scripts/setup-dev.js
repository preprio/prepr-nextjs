#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const setupDev = () => {
  console.log('🚀 Setting up development environment...');
  
  try {
    // Install dependencies if not already installed
    if (!existsSync(join(process.cwd(), 'node_modules'))) {
      console.log('📦 Installing dependencies...');
      execSync('pnpm install', { stdio: 'inherit' });
    }
    
    // Initial build
    console.log('🔨 Running initial build...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Type check
    console.log('🔍 Running type check...');
    execSync('npm run type-check', { stdio: 'inherit' });
    
    // Lint check
    console.log('🧹 Running lint check...');
    execSync('npm run lint:check', { stdio: 'inherit' });
    
    // Format check
    console.log('💅 Running format check...');
    execSync('npm run format:check', { stdio: 'inherit' });
    
    console.log('\n✅ Development environment setup complete!');
    console.log('\n📋 Available commands:');
    console.log('  npm run dev          - Start development mode');
    console.log('  npm run build        - Build the package');
    console.log('  npm run analyze      - Analyze bundle size');
    console.log('  npm run lint         - Fix linting issues');
    console.log('  npm run format       - Format code');
    console.log('  npm run type-check   - Check TypeScript types');
    console.log('\n💡 Manual quality checks:');
    console.log('  npm run type-check   - Before committing');
    console.log('  npm run lint:check   - Before committing');
    console.log('  npm run format:check - Before committing');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

setupDev(); 