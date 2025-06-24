# @preprio/prepr-nextjs

Next.js package for Prepr CMS preview functionality with advanced debugging and visual editing capabilities.

## Development

### Setup
```bash
pnpm install
```

### Available Commands

- `npm run dev` - Start development mode with watch
- `npm run build` - Build the package for production
- `npm run clean` - Clean the dist directory
- `npm run check` - Run all quality checks (type-check, lint, format)
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Fix linting issues
- `npm run lint:check` - Check for linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Release Process

The release process is streamlined and automated:

1. **Check code quality**: `npm run check`
2. **Release**: `npm run release <type> [prerelease-type]`

### Release Types
- `patch` - Bug fixes (1.0.0 → 1.0.1)
- `minor` - New features (1.0.0 → 1.1.0)
- `major` - Breaking changes (1.0.0 → 2.0.0)
- `prerelease` - Pre-release versions

### Examples
```bash
# Release a patch version
npm run release patch

# Release a prerelease alpha version
npm run release prerelease alpha

# Release a prerelease beta version
npm run release prerelease beta
```

The release script will:
1. Check if working directory is clean
2. Run all quality checks
3. Build the package
4. Update version in package.json
5. Commit changes and create git tag
6. Push changes and tag to remote

## Package Structure

```
dist/
├── react/          # React components and hooks
├── middleware/     # Next.js middleware
├── server/         # Server-side utilities
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.css       # Compiled CSS
```

## Exports

- `./react` - React components and hooks
- `./middleware` - Next.js middleware
- `./server` - Server-side utilities
- `./utils` - Utility functions
- `./types` - TypeScript types
- `./index.css` - Compiled CSS styles 