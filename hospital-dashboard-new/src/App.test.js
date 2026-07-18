import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login page by default', () => {
  render(<App />);
  const usernameField = screen.getByLabelText(/username/i);
  expect(usernameField).toBeInTheDocument();
});
