import React from 'react';

// Prefectureインターフェースの定義
// 都道府県のコードと名前を保持
interface Prefecture {
  prefCode: number;
  prefName: string;
}

// PrefectureListコンポーネントのプロパティのインターフェース定義
interface PrefectureListProps {
  prefectures: Prefecture[]; // 都道府県のリスト
  selectedPrefectures: number[]; // 選択された都道府県のコードのリスト
  togglePrefectureSelection: (prefCode: number) => void; // 選択状態を切り替える関数
}

// PrefectureListコンポーネントの定義
const PrefectureList: React.FC<PrefectureListProps> = ({
  prefectures,
  selectedPrefectures,
  togglePrefectureSelection,
}) => {
  return (
    <ul className={'p-graph__prefecture-lists'}>
      {prefectures.map((prefecture) => (
        // 各都道府県のリストアイテムを生成
        <li key={prefecture.prefCode} className={'p-graph__prefecture-list'}>
          <label key={prefecture.prefCode}>
            <input
              type="checkbox"
              // 都道府県が選択されているかどうかをチェック
              checked={selectedPrefectures.includes(prefecture.prefCode)}
              // チェックボックスの変更イベントで選択状態を切り替える関数を呼び出す
              onChange={() => togglePrefectureSelection(prefecture.prefCode)}
            />
            {prefecture.prefName}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default PrefectureList;
