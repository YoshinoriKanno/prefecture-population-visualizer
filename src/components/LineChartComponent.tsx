import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PrefectureList from './PrefectureList';
import CategorySelector from './CategorySelector';
import ErrorMessage from './ErrorMessage';

Highcharts.setOptions({
  accessibility: {
    enabled: false,
  },
});

// 各データの型定義
interface PopulationDataEntry {
  year: number;
  value: number;
}

interface Prefecture {
  prefCode: number;
  prefName: string;
}

// 環境変数からAPIキーを取得
const API_KEY = process.env.REACT_APP_API_KEY;

const LineChartComponent = () => {
  // 都道府県リストを保持
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  // 選択された都道府県のコードを保持
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  // 各都道府県ごとの人口データを保持
  const [chartData, setChartData] = useState<{
    [key: number]: PopulationDataEntry[];
  }>({});
  // 選択された人口カテゴリ（ラベル）を保持
  const [currentLabel, setCurrentLabel] = useState<string>('総人口');
  // エラーメッセージを保持
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 利用できる人口カテゴリのリスト
  const labels = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

  // APIキーのヘッダー設定を useMemo でラップ
  const apiHeaders = useMemo(
    () => ({
      'X-API-KEY': API_KEY ?? '',
    }),
    []
  );

  // 全国の都道府県データを取得する非同期関数
  const fetchPrefectures = useCallback(async () => {
    const url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';

    try {
      const response = await fetch(url, { headers: apiHeaders });
      const json = await response.json();

      if (response.status === 403 || json.statusCode === '403') {
        throw new Error('403 Forbidden: 無効なAPIキーです。');
      }

      // レスポンスから都道府県データを取得し、ステートに設定
      setPrefectures(json.result || []);
      // エラーメッセージをクリア
      setErrorMessage(null);
    } catch (error: any) {
      console.error('Error fetching prefectures: ', error);
      setErrorMessage(error.message || 'データの取得に失敗しました。');
    }
  }, [apiHeaders]);

  // 指定された都道府県とカテゴリの人口データを取得し、チャート用データに追加する関数を useCallback でラップ
  const fetchPopulationData = useCallback(
    async (prefCode: number, label: string) => {
      const url = `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`;

      try {
        const response = await fetch(url, { headers: apiHeaders });
        const json = await response.json();

        if (response.status === 403 || json.statusCode === '403') {
          throw new Error('403 Forbidden: 無効なAPIキーです。');
        }

        // 指定されたカテゴリのデータを取得
        const selectedData = json.result.data.find(
          (item: any) => item.label === label
        );

        if (selectedData) {
          // データをPopulationDataEntry型に整形
          const populationData = selectedData.data.map((item: any) => ({
            year: item.year,
            value: item.value,
          }));

          // 既存のチャートデータに新たに取得したデータをマージ
          setChartData((prevData) => ({
            ...prevData,
            [prefCode]: populationData,
          }));
        }
        // エラーメッセージをクリア
        setErrorMessage(null);
      } catch (error: any) {
        console.error(`Error fetching data for prefCode ${prefCode}: `, error);
        setErrorMessage(error.message || 'データの取得に失敗しました。');
      }
    },
    [apiHeaders]
  );

  // 選択された都道府県ごとのデータを更新する
  const updateSelectedPrefectureData = useCallback(() => {
    selectedPrefectures.forEach((prefCode) =>
      fetchPopulationData(prefCode, currentLabel)
    );
  }, [selectedPrefectures, currentLabel, fetchPopulationData]);

  // 初期表示時に都道府県リストを取得
  useEffect(() => {
    fetchPrefectures();
  }, [fetchPrefectures]);

  // 都道府県やカテゴリが変更された際にデータを更新
  useEffect(() => {
    updateSelectedPrefectureData();
  }, [updateSelectedPrefectureData]);

  // 都道府県の選択状態をトグルする
  const togglePrefectureSelection = (prefCode: number) => {
    setSelectedPrefectures((prev) =>
      prev.includes(prefCode)
        ? prev.filter((code) => code !== prefCode)
        : [...prev, prefCode]
    );
  };

  // Highchartsのオプション設定
  const options = {
    title: {
      text: `${currentLabel}推移`,
    },
    xAxis: {
      title: { text: '年' },
    },
    yAxis: {
      title: { text: '人口数' },
    },
    series: selectedPrefectures.map((prefCode) => ({
      name:
        prefectures.find((pref) => pref.prefCode === prefCode)?.prefName ||
        `PrefCode ${prefCode}`,
      data:
        chartData[prefCode]?.map((item) => ({ x: item.year, y: item.value })) ||
        [],
    })),
  };

  // UI部分
  return (
    <div className={'p-graph'}>
      <ErrorMessage message={errorMessage} />
      <PrefectureList
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        togglePrefectureSelection={togglePrefectureSelection}
      />
      <CategorySelector
        labels={labels}
        currentLabel={currentLabel}
        setCurrentLabel={setCurrentLabel}
      />
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChartComponent;
