import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PrefectureList from './PrefectureList';

const prefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

describe('PrefectureList', () => {
  it('renders prefectures correctly', () => {
    render(
      <PrefectureList
        prefectures={prefectures}
        selectedPrefectures={[]}
        togglePrefectureSelection={() => { }}
      />
    );

    // 都道府県がリストに表示されていることを確認
    prefectures.forEach((prefecture) => {
      expect(screen.getByLabelText(prefecture.prefName)).toBeInTheDocument();
    });
  });

  it('checks checkboxes based on selectedPrefectures', () => {
    render(
      <PrefectureList
        prefectures={prefectures}
        selectedPrefectures={[1]}
        togglePrefectureSelection={() => { }}
      />
    );

    // 北海道のチェックボックスが選択されていることを確認
    expect(screen.getByLabelText('北海道')).toBeChecked();

    // 青森県のチェックボックスが選択されていないことを確認
    expect(screen.getByLabelText('青森県')).not.toBeChecked();
  });

  it('calls togglePrefectureSelection when checkbox is clicked', () => {
    const togglePrefectureSelection = jest.fn();

    render(
      <PrefectureList
        prefectures={prefectures}
        selectedPrefectures={[]}
        togglePrefectureSelection={togglePrefectureSelection}
      />
    );

    // 北海道のチェックボックスをクリック
    fireEvent.click(screen.getByLabelText('北海道'));

    // 関数が呼び出されていることを確認
    expect(togglePrefectureSelection).toHaveBeenCalledWith(1);
  });
});
