# Tabby Developer Guide

## Project Overview

Tabby is a productivity web application (with a companion Chrome extension) built with React, TypeScript, and Node.js. This guide will help you understand the codebase, set up your development environment, and contribute to the project.

## Repository Structure

```
tabby/
├── extension/    # Chrome extension (companion app, not integrated with main app)
├── server/             # Backend server code
├── shared/             # Shared types and utilities
├── vite-react/         # Frontend React application (main app, includes Burn Engine)
└── .github/            # GitHub Actions workflows
```

## Key Features

- **Burn Engine**: The main app includes a Burn Engine, allowing users to set an hourly rate and visualize their burn rate and total money "burned" during focus sessions. This feature is designed to create urgency and increase productivity.
- **Visual Node Mapping**: Organize and connect ideas visually.
- **Focus Sessions**: Distraction-free work on selected nodes.
- **Progress Tracking**: Monitor streaks and completion rates.

## App & Extension

- **Web App**: The main Tabby app is a web application. All core features, including the Burn Engine, are here.  
  - To run:  
    ```sh
    cd vite-react
    npm install
    npm run dev
    ```
- **Chrome Extension (Companion App)**:  
  - The extension is a separate, non-integrated companion. It does not communicate with the main app by default.
  - If you want to test or use the extension, you must import the extension folder directly into your test environment or load it manually in Chrome as an unpacked extension.
  - The extension is not required for the main app to function.

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

#Install server dependencies
cd ../server
npm install
#Install frontend dependencies
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
## Running extension
1. Go to the extension setting in the browser of choice
2. Enable dev mode
3. Click load unpack
4. Open the Tabby folder (double click)
5. Click the extension folder
6. Click select folder
7. Now you can see Tabby as one of your usable extensions
## Getting Started


### Server

```bash
cd server
npm run build
```

### Frontend

```bash
cd vite-react
npm run dev
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

We try to follow these style guides:
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
---

*This guide is a living document and will be updated as the project evolves. Last updated: [Current Date]* 