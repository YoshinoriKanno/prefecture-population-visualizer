// src/components/LineChartComponent.tsx
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PopulationDataEntry {
  year: number;
  value: number;
}

interface PopulationResponse {
  message: string | null;
  result: {
    boundaryYear: number;
    data: {
      label: string;
      data: PopulationDataEntry[];
    }[];
  };
}

const LineChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=11362&prefCode=11';

      // 環境変数から API キーを取得し、未定義の場合はエラーを投げる
      const apiKey = process.env.REACT_APP_API_KEY;
      if (!apiKey) {
        throw new Error('API key is undefined. Please check your .env file.');
      }
      const options = {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey, // apiKeyがundefinedでないことが保証される
        },
      };

      try {
        const response = await fetch(url, options);
        const json = await response.json();
        const populationData = json.result.data[0].data.map(
          (item: PopulationDataEntry) => ({
            x: item.year,
            y: item.value,
          })
        );
        setChartData(populationData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
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
        name: '総人口',
        data: chartData,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChartComponent;
