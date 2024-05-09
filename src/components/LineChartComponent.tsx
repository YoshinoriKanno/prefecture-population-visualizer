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
      text: 'My chart'
    },
    series: [
      {
        data: [1, 2, 3, 4, 5, 6]
      }
    ],
    accessibility: {
      enabled: false
    }
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}

export default LineChartComponent;
