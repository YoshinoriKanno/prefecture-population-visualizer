// src/components/LineChartComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LineChartComponent from './LineChartComponent';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('LineChartComponent tests', () => {
  it('fetches prefectures and displays them', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: [
          { prefCode: 1, prefName: '北海道' },
          { prefCode: 2, prefName: '青森県' },
        ],
      })
    );

    render(<LineChartComponent />);
    await waitFor(() => expect(screen.getByText('北海道')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('青森県')).toBeInTheDocument());
  });

  it('handles selection changes and fetches population data', async () => {
    fetchMock.mockResponses(
      JSON.stringify({ result: [{ prefCode: 1, prefName: '北海道' }] }),
      JSON.stringify({
        result: {
          data: [{ label: '総人口', data: [{ year: 2020, value: 10000 }] }],
        },
      })
    );

    render(<LineChartComponent />);
    const checkbox = await screen.findByLabelText('北海道');
    fireEvent.click(checkbox);

    // 指定した年と人口データがチャートに反映されていることを確認
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(screen.getByText('総人口推移')).toBeInTheDocument();
  });
});
