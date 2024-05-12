// src/components/LineChartComponent.tsx
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PopulationDataEntry {
  year: number;
  value: number;
}

const LineChartComponent = () => {
  const [chartData11, setChartData11] = useState<PopulationDataEntry[]>([]);
  const [chartData12, setChartData12] = useState<PopulationDataEntry[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>('総人口');
  const [showPref11, setShowPref11] = useState(true);
  const [showPref12, setShowPref12] = useState(true);

  const labels = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

  // PrefCodeに基づいてデータを取得し、指定したラベルのデータをセットする
  const fetchData = async (
    prefCode: string,
    setData: React.Dispatch<React.SetStateAction<PopulationDataEntry[]>>,
    label: string
  ) => {
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

      // 指定されたラベルに対応するデータを抽出
      const selectedData = json.result.data.find(
        (item: any) => item.label === label
      );
      const populationData: PopulationDataEntry[] = selectedData.data.map(
        (item: any) => ({
          year: item.year,
          value: item.value,
        })
      );

      setData(populationData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // データを取得しなおす処理
  const updateData = () => {
    fetchData('11', setChartData11, currentLabel);
    fetchData('12', setChartData12, currentLabel);
  };

  // 初回読み込み時、またはラベルの変更時にデータを更新
  useEffect(() => {
    updateData();
  }, [currentLabel]);

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
    series: [
      {
        name: '埼玉県',
        data: chartData11.map((item) => ({
          x: item.year,
          y: item.value,
        })),
        visible: showPref11,
      },
      {
        name: '千葉県',
        data: chartData12.map((item) => ({
          x: item.year,
          y: item.value,
        })),
        visible: showPref12,
      },
    ],
  };

  return (
    <div style={{ width: '100%' }}>
      <label>
        <input
          type="checkbox"
          checked={showPref11}
          onChange={(e) => setShowPref11(e.target.checked)}
        />
        埼玉県
      </label>
      <label>
        <input
          type="checkbox"
          checked={showPref12}
          onChange={(e) => setShowPref12(e.target.checked)}
        />
        千葉県
      </label>
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
