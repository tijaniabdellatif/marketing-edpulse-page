import React from 'react';
import { render } from '@testing-library/react';
import Button from '@/components/hoc/Button';

describe('Button Component', () => {
  it('renders the button with the correct text', () => {
    const { getByText } = render(<Button />);
    
    // Check if the text "hey this is a button" is present
    const buttonElement = getByText(/hey this is a button/i);
    expect(buttonElement).toBeInTheDocument();
  });
});