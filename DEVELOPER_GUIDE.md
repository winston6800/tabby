# Tabby Developer Guide

## Project Overview

Tabby is a Chrome extension built with React, TypeScript, and Node.js. This guide will help you understand the codebase, set up your development environment, and contribute to the project.

## Repository Structure

```
tabby/
├── chrome-extension/    # Chrome extension source code
├── server/             # Backend server code
├── shared/             # Shared types and utilities
├── vite-react/         # Frontend React application
└── .github/            # GitHub Actions workflows
```

## Prerequisites

- Node.js (v18.x or later)
- npm (v9.x or later) or yarn (v1.x or later)
- Google Chrome (for extension development)
- Git

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/winston6800/tabby.git
cd tabby
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install extension dependencies
cd chrome-extension
npm install

# Install server dependencies
cd ../server
npm install

# Install frontend dependencies
cd ../vite-react
npm install
```

### 3. Environment Setup

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Update the environment variables as needed.

## Building the Project

### Chrome Extension

```bash
cd chrome-extension
npm run build
```

The built extension will be in `chrome-extension/dist/`.

### Server

```bash
cd server
npm run build
```

### Frontend

```bash
cd vite-react
npm run build
```

## Running Tests

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Integration Tests

```bash
npm run test:integration
```

## Code Style Guide

We follow these style guides:
- [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/react/) for React components
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) for TypeScript code

### Linting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Adding New Features

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Write tests
4. Run tests and linting
5. Create a pull request

## Testing Guidelines

### Unit Tests
- Place test files next to the files they test
- Use the `.test.ts` or `.test.tsx` extension
- Follow the AAA pattern (Arrange, Act, Assert)

### Integration Tests (TODO)
- Place in `__tests__/integration/`
- Test complete user flows
- Use realistic test data

(TODO: Add Database Schema)

## CI/CD Pipeline

Our CI/CD pipeline runs on GitHub Actions and Vite+React and includes:
- Linting
- Unit tests
- Integration tests
- Build verification
- Deployment (when merged to main)

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a release branch
4. Run full test suite
5. Create pull request
6. After review, merge to main
7. Create GitHub release

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

### Pull Request Guidelines

- Include a clear description of changes
- Reference related issues
- Include tests for new features
- Update documentation as needed
- Follow the existing code style

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify environment variables

2. **Test Failures**
   - Check test database connection
   - Verify test data
   - Check for race conditions

3. **Extension Not Loading**
   - Check manifest.json
   - Verify build output
   - Check Chrome console for errors

## Getting Help

- Create an issue on GitHub
- Join our [Discord community](link to be added)
- Contact the maintainers

---

*This guide is a living document and will be updated as the project evolves. Last updated: [Current Date]* 