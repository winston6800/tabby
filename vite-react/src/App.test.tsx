// Import necessary testing utilities and the component to test
import React from 'react';
import { describe, it, expect } from 'vitest';  // Vitest's test functions
import { render, screen } from '@testing-library/react';  // React testing utilities
import '@testing-library/jest-dom';  // Custom DOM matchers
import App from './App';

// Test suite for the App component
describe('App', () => {
  // Test case: Check if the App component renders without crashing
  it('renders without crashing', () => {
    // Render the App component
    render(<App />);
    
    // Assert that the main element is present in the document
    // This verifies that our component's basic structure is correct
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 