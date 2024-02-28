import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutoComplete from '../AutoComplete';

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
  (global.fetch as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'John Doe' },
        // Add more mock users as needed
      ]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('displays suggestions based on input with real API call', async () => {
  render(<AutoComplete />);
  const inputElement = screen.getByTestId("searchInputID");
  fireEvent.change(inputElement, { target: { value: 'John' } });

  await waitFor(() => {
    // Expecting the mock fetch to be called with the API URL including the query
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('John'));

    // Check if the suggestion is displayed
    expect(screen.getByTestId('resultsID').textContent).toMatch("John Doe")
  });
});
