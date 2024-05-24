import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LineChartComponent from './LineChartComponent';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

// fetchMockを有効にする
fetchMock.enableMocks();

// 各テストの前にfetchMockをリセット
beforeEach(() => {
  fetchMock.resetMocks();
});

describe('LineChartComponent tests', () => {
  // 都道府県データを取得し、表示するテスト
  it('fetches prefectures and displays them', async () => {
    // モックレスポンスを設定
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: [
          { prefCode: 1, prefName: '北海道' },
          { prefCode: 2, prefName: '青森県' },
        ],
      })
    );

    // コンポーネントをレンダリング
    render(<LineChartComponent />);

    // 都道府県名が表示されるのを待つ
    await waitFor(() => expect(screen.getByText('北海道')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('青森県')).toBeInTheDocument());
  });

  // 選択変更と人口データの取得を処理するテスト
  it('handles selection changes and fetches population data', async () => {
    // モックレスポンスを設定
    fetchMock.mockResponses(
      JSON.stringify({ result: [{ prefCode: 1, prefName: '北海道' }] }),
      JSON.stringify({
        result: {
          data: [{ label: '総人口', data: [{ year: 2020, value: 10000 }] }],
        },
      })
    );

    // コンポーネントをレンダリング
    render(<LineChartComponent />);

    // チェックボックスを探してクリック
    const checkbox = await screen.findByLabelText('北海道');
    fireEvent.click(checkbox);

    // チャートに反映されたことを確認
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(screen.getByText('総人口推移')).toBeInTheDocument();
  });
});
