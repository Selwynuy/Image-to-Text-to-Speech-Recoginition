import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Image to Speech Converter heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Image to Speech Converter/i);
  expect(headingElement).toBeInTheDocument();
});
