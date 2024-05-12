import React from 'react';
import './App.css';
import LineChartComponent from './components/LineChartComponent';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <h1 className="c-heading">都道府県単位人口増減率</h1>
        <p className="c-description">
          1965-2045年（5年毎）の
          <br className={'md:u-hidden'} />
          都道府県単位人口増減率野グラフです。
        </p>
        <LineChartComponent />
      </main>
    </div>
  );
}

export default App;
