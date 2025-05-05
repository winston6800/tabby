// Import testing utilities and matchers
import '@testing-library/jest-dom';  // Adds custom DOM matchers like toBeInTheDocument()
import { expect, afterEach } from 'vitest';  // Import Vitest's test utilities
import { cleanup } from '@testing-library/react';  // Import cleanup utility
import * as matchers from '@testing-library/jest-dom/matchers';  // Import DOM matchers

// Extend Vitest's expect method with custom DOM matchers
// This allows us to use matchers like toBeInTheDocument() in our tests
expect.extend(matchers);

// Cleanup after each test case
// This ensures each test starts with a clean DOM
afterEach(() => {
  cleanup();
}); 