#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const releaseTypes = ['patch', 'minor', 'major', 'prerelease'];
const prereleaseTypes = ['alpha', 'beta', 'rc'];

const getCurrentVersion = () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  return packageJson.version;
};

const checkTagExists = (tag) => {
  try {
    execSync(`git rev-parse ${tag}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const release = () => {
  const args = process.argv.slice(2);
  const type = args[0];
  const prereleaseType = args[1];
  
  if (!releaseTypes.includes(type)) {
    console.error('❌ Invalid release type. Use: patch, minor, major, or prerelease');
    console.error('Usage: npm run release <type> [prerelease-type]');
    console.error('Examples:');
    console.error('  npm run release patch');
    console.error('  npm run release prerelease alpha');
    process.exit(1);
  }
  
  if (type === 'prerelease' && !prereleaseTypes.includes(prereleaseType)) {
    console.error('❌ Invalid prerelease type. Use: alpha, beta, or rc');
    process.exit(1);
  }
  
  try {
    console.log('🚀 Starting release process...');
    
    // Check if working directory is clean
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.error('❌ Working directory is not clean. Please commit or stash changes.');
      process.exit(1);
    }
    
    // Run all checks
    console.log('🔍 Running pre-release checks...');
    execSync('npm run check', { stdio: 'inherit' });
    
    // Build the package
    console.log('📦 Building package...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Update version
    console.log('📝 Updating version...');
    const currentVersion = getCurrentVersion();
    
    let newVersion;
    if (type === 'prerelease') {
      // Check if the tag already exists
      const expectedTag = `v${currentVersion.replace(/\d+$/, (match) => parseInt(match) + 1)}-${prereleaseType}.0`;
      if (checkTagExists(expectedTag)) {
        console.error(`❌ Tag ${expectedTag} already exists. Please delete it or use a different version.`);
        process.exit(1);
      }
      newVersion = execSync(`npm version prerelease --preid=${prereleaseType}`, { encoding: 'utf8' }).trim();
    } else {
      // Check if the tag already exists
      const expectedTag = `v${currentVersion.replace(/(\d+)\.(\d+)\.(\d+)/, (match, major, minor, patch) => {
        if (type === 'patch') return `${major}.${minor}.${parseInt(patch) + 1}`;
        if (type === 'minor') return `${major}.${parseInt(minor) + 1}.0`;
        if (type === 'major') return `${parseInt(major) + 1}.0.0`;
        return match;
      })}`;
      if (checkTagExists(expectedTag)) {
        console.error(`❌ Tag ${expectedTag} already exists. Please delete it or use a different version.`);
        process.exit(1);
      }
      newVersion = execSync(`npm version ${type}`, { encoding: 'utf8' }).trim();
    }
    
    console.log(`📦 Version updated: ${currentVersion} → ${newVersion}`);
    
    // Note: npm version already creates the git tag, so we don't need to create it again
    
    // Push changes and tag
    console.log('📤 Pushing changes...');
    execSync('git push', { stdio: 'inherit' });
    execSync(`git push origin ${newVersion}`, { stdio: 'inherit' });
    
    console.log('\n✅ Release process complete!');
    console.log(`\n📋 Next steps:`);
    console.log(`  1. Check the GitHub Actions workflow for automated publishing`);
    console.log(`  2. Verify the package was published to npm`);
    
    if (type === 'prerelease') {
      console.log(`\n📦 To install this prerelease:`);
      console.log(`  npm install @preprio/prepr-nextjs@${prereleaseType}`);
    }
    
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  }
};

release(); 