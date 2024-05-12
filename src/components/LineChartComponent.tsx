// src/components/LineChartComponent.tsx
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PopulationDataEntry {
  year: number;
  value: number;
}

interface Prefecture {
  prefCode: number;
  prefName: string;
}

const LineChartComponent = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [chartData, setChartData] = useState<{
    [key: number]: PopulationDataEntry[];
  }>({});
  const [currentLabel, setCurrentLabel] = useState<string>('総人口');

  const labels = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

  // 全国の都道府県データを取得
  const fetchPrefectures = async () => {
    const url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey) {
      throw new Error('API key is undefined. Please check your .env file.');
    }
    const options = {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
      },
    };

    try {
      const response = await fetch(url, options);
      const json = await response.json();
      setPrefectures(json.result);
    } catch (error) {
      console.error('Error fetching prefectures: ', error);
    }
  };

  // PrefCodeに基づいてデータを取得し、指定したラベルのデータをセット
  const fetchData = async (prefCode: number, label: string) => {
    const url = `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`;
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey) {
      throw new Error('API key is undefined. Please check your .env file.');
    }
    const options = {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
      },
    };

    try {
      const response = await fetch(url, options);
      const json = await response.json();

      const selectedData = json.result.data.find(
        (item: any) => item.label === label
      );
      const populationData: PopulationDataEntry[] = selectedData.data.map(
        (item: any) => ({
          year: item.year,
          value: item.value,
        })
      );

      setChartData((prevData) => ({
        ...prevData,
        [prefCode]: populationData,
      }));
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // 選択された都道府県のデータを更新
  const updateData = () => {
    selectedPrefectures.forEach((prefCode) => {
      fetchData(prefCode, currentLabel);
    });
  };

  // 初回実行時および選択ラベル変更時にデータを更新
  useEffect(() => {
    updateData();
  }, [currentLabel, selectedPrefectures]);

  // 初回実行時に都道府県リストを取得
  useEffect(() => {
    fetchPrefectures();
  }, []);

  const togglePrefectureSelection = (prefCode: number) => {
    setSelectedPrefectures((prev) =>
      prev.includes(prefCode)
        ? prev.filter((code) => code !== prefCode)
        : [...prev, prefCode]
    );
  };

  const options = {
    title: {
      text: `${currentLabel}推移`,
    },
    xAxis: {
      title: {
        text: '年',
      },
    },
    yAxis: {
      title: {
        text: '人口数',
      },
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

  return (
    <div style={{ width: '100%' }}>
      <div>
        {prefectures.map((prefecture) => (
          <label key={prefecture.prefCode}>
            <input
              type="checkbox"
              checked={selectedPrefectures.includes(prefecture.prefCode)}
              onChange={() => togglePrefectureSelection(prefecture.prefCode)}
            />
            {prefecture.prefName}
          </label>
        ))}
      </div>
      <select
        value={currentLabel}
        onChange={(e) => setCurrentLabel(e.target.value)}
      >
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChartComponent;
