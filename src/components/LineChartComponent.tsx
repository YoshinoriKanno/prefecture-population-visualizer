// src/components/LineChartComponent.tsx
import React, { useEffect, useState, useCallback } from 'react';
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

const API_KEY = process.env.REACT_APP_API_KEY;

const LineChartComponent = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [chartData, setChartData] = useState<{
    [key: number]: PopulationDataEntry[];
  }>({});
  const [currentLabel, setCurrentLabel] = useState<string>('総人口');

  const labels = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

  const apiHeaders = {
    'X-API-KEY': API_KEY ?? '',
  };

  const fetchPrefectures = useCallback(async () => {
    const url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';

    try {
      const response = await fetch(url, { headers: apiHeaders });
      const json = await response.json();
      setPrefectures(json.result || []);
    } catch (error) {
      console.error('Error fetching prefectures: ', error);
    }
  }, []);

  const fetchPopulationData = async (prefCode: number, label: string) => {
    const url = `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`;

    try {
      const response = await fetch(url, { headers: apiHeaders });
      const json = await response.json();
      const selectedData = json.result.data.find(
        (item: any) => item.label === label
      );

      if (selectedData) {
        const populationData = selectedData.data.map((item: any) => ({
          year: item.year,
          value: item.value,
        }));

        setChartData((prevData) => ({
          ...prevData,
          [prefCode]: populationData,
        }));
      }
    } catch (error) {
      console.error(`Error fetching data for prefCode ${prefCode}: `, error);
    }
  };

  const updateSelectedPrefectureData = useCallback(() => {
    selectedPrefectures.forEach((prefCode) =>
      fetchPopulationData(prefCode, currentLabel)
    );
  }, [selectedPrefectures, currentLabel]);

  useEffect(() => {
    fetchPrefectures();
  }, [fetchPrefectures]);

  useEffect(() => {
    updateSelectedPrefectureData();
  }, [updateSelectedPrefectureData]);

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
