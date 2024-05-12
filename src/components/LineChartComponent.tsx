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
  const [showPref11, setShowPref11] = useState(true);
  const [showPref12, setShowPref12] = useState(true);

  // PrefCodeに基づいてデータを取得し、PopulationDataEntry[] の型で結果をセットする
  const fetchData = async (
    prefCode: string,
    setData: React.Dispatch<React.SetStateAction<PopulationDataEntry[]>>
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

      // `PopulationDataEntry` 型のデータに適した形でマッピング
      const populationData: PopulationDataEntry[] =
        json.result.data[0].data.map((item: any) => ({
          year: item.year,
          value: item.value,
        }));

      // 型が一致するように `PopulationDataEntry[]` 配列をセット
      setData(populationData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData('11', setChartData11);
    fetchData('12', setChartData12);
  }, []);

  const options = {
    title: {
      text: '総人口推移',
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
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChartComponent;
