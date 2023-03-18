export const CHART_CONFIG = (data) => {
  return {
    title: {
      text: 'Niveles peligrosidad WC',
      left: '1%',
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '10%',
    },
    xAxis: {
      data: data.map(function (item) {
        return item.time;
      }),
    },
    yAxis: {},
    toolbox: {
      right: 10,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    visualMap: {
      top: 50,
      right: 10,
      pieces: [
        {
          gt: 0,
          lte: 50,
          color: '#93CE07',
        },
        {
          gt: 51,
          lte: 70,
          color: '#FBDB0F',
        },
        {
          gt: 71,
          lte: 85,
          color: '#FC7D02',
        },
        {
          gt: 86,
          lte: 95,
          color: '#FD0100',
        },
        {
          gt: 96,
          lte: 100,
          color: '#AA069F',
        },
      ],
      outOfRange: {
        color: '#999',
      },
    },
    series: [
      {
        name: 'Temperature',
        type: 'line',
        data: data.map(function (item) {
          let { tact } = item.data;
          if (tact && typeof tact === 'string') {
            tact = Number.parseInt(tact);
          }
          tact = Math.round((tact / 10 - 273) * 100) / 100;
          return tact;
        }),
      },
      {
        name: 'Humedad',
        type: 'line',
        data: data.map(function (item) {
          let { hact } = item.data;
          if (hact && typeof hact === 'string') {
            hact = Number.parseInt(hact);
          }
          return hact;
        }),
      },
      {
        name: 'Niveles NO2',
        type: 'line',
        data: data.map(function (item) {
          let { noxl } = item.data;
          if (noxl && typeof noxl === 'string') {
            noxl = Number.parseInt(noxl);
          }
          return noxl;
        }),
      },
      {
        name: 'Niveles partículas orgánicas',
        type: 'line',
        data: data.map(function (item) {
          let { va10 } = item.data;
          if (va10 && typeof va10 === 'string') {
            va10 = Number.parseInt(va10);
          }
          return va10;
        }),
      },
      {
        name: 'Niveles partículas PM10',
        type: 'line',
        data: data.map(function (item) {
          let { pm10 } = item.data;
          if (pm10 && typeof pm10 === 'string') {
            pm10 = Number.parseInt(pm10);
          }
          return pm10;
        }),
      },
      {
        name: 'Niveles partículas PM2.5',
        type: 'line',
        data: data.map(function (item) {
          let { pm25 } = item.data;
          if (pm25 && typeof pm25 === 'string') {
            pm25 = Number.parseInt(pm25);
          }
          return pm25;
        }),
      },
    ],
  };
};
