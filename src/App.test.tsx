// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component tests', () => {
  test('renders the main heading', () => {
    render(<App />);
    const headingElements = screen.getAllByText(/都道府県単位人口増減率/);
    expect(headingElements.length).toBeGreaterThan(0); // 何らかの要素が存在することを確認
    headingElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  test('renders LineChartComponent', () => {
    render(<App />);
    expect(screen.getByText(/総人口推移/)).toBeInTheDocument();
  });
});
