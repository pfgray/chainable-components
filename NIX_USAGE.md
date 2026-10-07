# Using Nix with Chainable Components

This project includes a Nix flake that provides all necessary tools for building and publishing.

## Requirements

- [Nix](https://nixos.org/download.html) with flakes enabled

## Quick Start

### Option 1: Enter Development Shell

```bash
nix develop
```

This will give you a shell with:
- Node.js 22.23.3
- npm 10.9.9
- git

### Option 2: Use direnv (Automatic)

If you have [direnv](https://direnv.net/) installed:

```bash
# Allow direnv to load the environment
direnv allow
```

The development environment will automatically load when you `cd` into the project directory.

## Building the Project

Once in the Nix shell:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint the code
npm run lint
```

## Publishing

```bash
# Make sure you're logged in to npm
npm login

# Publish (requires npm auth)
npm publish
```

## Troubleshooting

### "node: command not found"

Make sure you're inside the Nix development shell:
```bash
nix develop
```

Or if using direnv, make sure you've allowed it:
```bash
direnv allow
```
