import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message when message is provided', () => {
    const message = 'エラーメッセージ';
    render(<ErrorMessage message={message} />);

    // エラーメッセージが表示されていることを確認
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('does not render when message is null', () => {
    render(<ErrorMessage message={null} />);

    // エラーメッセージが表示されていないことを確認
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });
});
