// src/components/LineChartComponent.jsx
import React from 'react';

import Highcharts from 'highcharts';
import HighchartsAccessibility from 'highcharts/modules/accessibility';

import HighchartsReact from 'highcharts-react-official';

// モジュールの初期化
HighchartsAccessibility(Highcharts);

const LineChartComponent = () => {
  const options = {
    title: {
      text: 'My chart',
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    },
    series: [
      {
        name: 'Installation & Developers',
        data: [
          43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
          161454, 154610,
        ],
      },
      {
        name: 'Manufacturing',
        data: [
          24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243,
          31050,
        ],
      },
      {
        name: 'Sales & Distribution',
        data: [
          11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213,
          25663,
        ],
      },
    ],
    accessibility: {
      enabled: false,
    },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChartComponent;
