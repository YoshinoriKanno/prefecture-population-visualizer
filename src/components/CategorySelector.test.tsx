import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CategorySelector from './CategorySelector';

describe('CategorySelector', () => {
  it('renders category options correctly', () => {
    const labels = ['総人口', '年少人口', '生産年齢人口', '老年人口'];
    render(
      <CategorySelector
        labels={labels}
        currentLabel={'総人口'}
        setCurrentLabel={() => { }}
      />
    );

    // カテゴリがセレクトボックスに表示されていることを確認
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('calls setCurrentLabel when a category is selected', () => {
    const labels = ['総人口', '年少人口', '生産年齢人口', '老年人口'];
    const setCurrentLabel = jest.fn();

    render(
      <CategorySelector
        labels={labels}
        currentLabel={'総人口'}
        setCurrentLabel={setCurrentLabel}
      />
    );

    // セレクトボックスを変更
    fireEvent.change(screen.getByDisplayValue('総人口'), {
      target: { value: '年少人口' },
    });

    // 関数が呼び出されていることを確認
    expect(setCurrentLabel).toHaveBeenCalledWith('年少人口');
  });
});
