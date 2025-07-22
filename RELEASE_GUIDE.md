# Release Guide for Prepr Next.js Package

This guide outlines the complete release process for the `@preprio/prepr-nextjs` package, including version management, branch workflow, and automated publishing.

## Overview

The project uses **Changesets** for version management and automated releases. The workflow is designed to:
- Manage versioning through changesets
- Automate changelog generation
- Handle both feature releases and hotfixes
- Ensure code quality through automated CI/CD

## Branch Workflow

### Main Branches
- **`main`** - Production-ready code, protected branch
- **`release/*`** - Feature branches for upcoming releases (e.g., `release/2.0.0-alpha`)

### Development Process

1. **Create Feature/Release Branch**
   ```bash
   # For new features or versions
   git checkout -b release/2.0.0-alpha
   # OR for hotfixes (use release/ prefix to trigger CI)
   git checkout -b release/hotfix-critical-fix
   ```

2. **Make Changes and Add Changesets**
   ```bash
   # After making your changes, add a changeset
   pnpm changeset
   ```
   This will prompt you to:
   - Select the type of change (major, minor, patch)
   - Write a summary of the changes
   - Generate a changeset file in `.changeset/`

3. **Version Management in Branch**
   ```bash
   # Update version based on changesets
   pnpm changeset version
   ```
   This will:
   - Update `package.json` version
   - Generate/update `CHANGELOG.md`
   - Remove consumed changeset files

4. **Commit Version Changes**
   ```bash
   git add .
   git commit -m "Version bump to 2.0.0-alpha.12"
   git push origin release/2.0.0-alpha
   ```

## Pull Request Process

### Creating a Release PR

1. **Open PR to Main**
   - Source: Your feature/release branch
   - Target: `main`
   - Title: "Release: v2.0.0-alpha.12" (or appropriate version)

2. **PR Requirements**
   - All CI checks must pass (`.github/workflows/ci.yml`)
   - Code review approval required
   - Version should already be updated in the branch

3. **CI Validation**
   The CI workflow will automatically:
   - Run `pnpm run check` (type-check, lint, format)
   - Build the package
   - Upload build artifacts

### After PR Merge

Once merged to `main`, the release workflow (`.github/workflows/release.yml`) automatically:
- Detects the version change
- Runs `pnpm run release` (build + publish)
- Publishes to npm registry
- Creates GitHub release with changelog

## Development Commands

### Essential Commands
```bash
# Add a changeset (do this after making changes)
pnpm changeset

# Update versions based on changesets
pnpm changeset version

# Build and publish (automated in CI)
pnpm run release

# Run all quality checks
pnpm run check

# Build the package
pnpm run build
```

### Code Quality
```bash
# Type checking
pnpm run type-check

# Lint and fix
pnpm run lint

# Format code
pnpm run format

# Run all checks
pnpm run check
```

## Changeset Types

### Major Changes (Breaking)
- API changes that break backward compatibility
- Removing public functions/components
- Changing function signatures

### Minor Changes (Feature)
- Adding new features
- Adding new public APIs
- Non-breaking enhancements

### Patch Changes (Fix)
- Bug fixes
- Documentation updates
- Internal refactoring without API changes

## Best Practices

### Version Management
1. **Always add changesets** for any user-facing changes
2. **Update versions in your branch** before creating PR
3. **Use semantic versioning** appropriately
4. **Write clear changeset summaries** for end users

### Branch Management
1. **Create release branches** for significant versions
2. **Keep branches focused** on specific features/fixes
3. **Merge frequently** to avoid conflicts
4. **Delete merged branches** to keep repository clean

### Quality Assurance
1. **Run checks locally** before pushing
2. **Test build process** with `pnpm run build`
3. **Verify all exports** work correctly
4. **Check TypeScript types** are generated properly

## Release Checklist

### Before Creating PR
- [ ] All changes have associated changesets
- [ ] Version updated with `pnpm changeset version`
- [ ] Local checks pass (`pnpm run check`)
- [ ] Build succeeds (`pnpm run build`)
- [ ] Changelog is accurate

### During PR Review
- [ ] CI checks pass
- [ ] Code review completed
- [ ] Version number is correct
- [ ] No merge conflicts

### After Merge
- [ ] Monitor release workflow
- [ ] Verify npm publication
- [ ] Check GitHub release creation
- [ ] Update documentation if needed

## Troubleshooting

### Common Issues

**CI Fails on Type Check**
```bash
# Fix locally first
pnpm run type-check
# Fix issues, then commit
```

**Build Artifacts Missing**
```bash
# Ensure build completes
pnpm run build
# Check dist/ folder is created
```

**Version Not Updated**
```bash
# Make sure you ran changeset version
pnpm changeset version
git add . && git commit -m "Version bump"
```

### Emergency Hotfixes

For critical issues in production:

1. Create hotfix branch from `main` using `release/hotfix-*` naming
   ```bash
   git checkout -b release/hotfix-critical-fix
   ```
2. Make minimal necessary changes
3. Add patch changeset
4. Update version immediately
5. Create PR with "HOTFIX" prefix
6. Expedite review and merge

**Note:** Use `release/hotfix-*` naming to ensure CI runs automatically. The CI workflow only triggers on `release/*` branches, not standalone `hotfix/*` branches.

## Configuration Files

- `.changeset/config.json` - Changeset configuration
- `.github/workflows/release.yml` - Automated release workflow
- `.github/workflows/ci.yml` - CI validation workflow
- `package.json` - Package configuration and scripts

## Support

For questions about the release process:
- Check existing changesets in `.changeset/`
- Review recent releases in GitHub
- Consult the [Changesets documentation](https://github.com/changesets/changesets)