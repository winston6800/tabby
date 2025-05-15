import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import SignupForm from './components/auth/SignupForm';
import NodeCanvas from './components/NodeCanvas';
import 'reactflow/dist/style.css';

/**
 * Node Types Configuration
 * Maps custom node types to their components
 * Currently only has the default CustomNode type
 */
const nodeTypes = {
  custom: CustomNode,
};

/**
 * Main App Component
 * 
 * Sets up routing for the application:
 * - /login: Login page
 * - /signup: Registration page
 * - /canvas: Main node canvas UI
 * - /: Redirects to canvas
 * 
 * TODO: Add authentication protection for routes
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/canvas" element={<NodeCanvas />} />
        <Route path="/" element={<Navigate to="/canvas" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
