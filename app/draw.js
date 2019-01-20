const COLORS = [
  '#ffffff',
  '#ffd9cc',
  '#ffb399',
  '#ff8c66',
  '#ff6333',
  '#ff3c00',
  '#cc2c00',
  '#992600',
  '#661800',
  '#330c00',
  '#000e33',
  '#000000',
]

const COLORS2 = [
  '#ffffff',
  '#7f6db9',
  '#88b55d',
  '#6a98cc',
  '#cf5685',
  '#6ab5b1'
]

function draw(time, rawData, type) {
  const dom = document.getElementById(`draw-area-${time}`)
  const myChart = echarts.init(dom)

  const latExtent = [39.5, 40.6]
  const lngExtent = [115.9, 116.8]
  const cellCount = [100, 100]
  const cellSizeCoord = [
    (latExtent[1] - latExtent[0]) / cellCount[0],
    (lngExtent[1] - lngExtent[0]) / cellCount[1]
  ]

  const data = []
  type = parseInt(type);
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      data.push([i, j, type === 6 ? grade(rawData[i][j]) : rawData[i][j][type], rawData[i][j][0],
        rawData[i][j][1],rawData[i][j][2],rawData[i][j][3],rawData[i][j][4],
      ]) // rawData_class1
    }
  }

  function grade(detail) {
    const max = Math.max(detail[0], detail[1], detail[2], detail[3], detail[4]);

    if (max === 0)
      return 0;
    else if (max === detail[0])
      return 1;
    else if (max === detail[1])
      return 2;
    else if (max === detail[2])
      return 3;
    else if (max === detail[3])
      return 4;
    else
      return 5;
  }

  function renderItem(params, api) {
    const lngIndex = api.value(0)
    const latIndex = api.value(1)
    const pointLeftTop = getCoord(params, api, lngIndex, latIndex)
    const pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1)

    return {
      type: 'rect',
      shape: {
        x: pointLeftTop[0],
        y: pointLeftTop[1],
        width: pointRightBottom[0] - pointLeftTop[0],
        height: pointRightBottom[1] - pointLeftTop[1]
      },
      style: api.style({
        stroke: 'rgba(0,0,0,0.1)'
      }),
      styleEmphasis: api.styleEmphasis()
    };
  }

  function getCoord(params, api, lngIndex, latIndex) {
    const coords = params.context.coords || (params.context.coords = [])
    const key = lngIndex + '-' + latIndex

    // bmap returns point in integer, which makes cell width unstable.
    // So we have to use right bottom point.
    return coords[key] || (coords[key] = api.coord([
      +(lngExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
      +(latExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
    ]));
  }

  const option = {
    tooltip: {},
    visualMap: {
      type: 'piecewise',
      inverse: true,
      top: 10,
      left: 10,
      pieces: type === 6 ?
      [{
        value: 0, color: COLORS2[0], label: '无'
      }, {
        value: 1, color: COLORS2[1], label: '色情广告'
      }, {
        value: 2, color: COLORS2[2], label: '发票办证'
      }, {
        value: 3, color: COLORS2[3], label: '银行相关'
      }, {
        value: 4, color: COLORS2[4], label: '房产交易'
      }, {
        value: 5, color: COLORS2[5], label: '其他'
      }]
      :
      [
        {lte: 0, color: COLORS[0]},
        {gt: 0, lte: 50, color: COLORS[1]},
        {gt: 50, lte: 100, color: COLORS[2]},
        {gt: 100, lte: 200, color: COLORS[3]},
        {gt: 200, lte: 500, color: COLORS[4]},
        {gt: 500, lte: 1000, color: COLORS[5]},
        {gt: 1000, lte: 2000, color: COLORS[6]},
        {gt: 2000, lte: 4000, color: COLORS[7]},
        {gt: 4000, lte: 10000, color: COLORS[7]},
        {gt: 10000, lte: 15000, color: COLORS[7]},
        {gt: 15000, color: COLORS[8]},
    ],
      borderColor: '#ccc',
      borderWidth: 2,
      backgroundColor: '#eee',
      dimension: 2,
      inRange: {
        color: COLORS,
        opacity: 0.7
      }
    },
    series: [
      {
        type: 'custom',
        coordinateSystem: 'bmap',
        renderItem: renderItem,
        animation: false,
        itemStyle: {
          emphasis: {
            color: 'yellow'
          }
        },
        // tooltip won't be showed when only 1 dimenion is displayed
        dimensions: ['x', 'y', '总数', '色情广告', '发票办证', '银行相关', '房产交易', '其他'],
        encode: {
          tooltip: type === 5 ? [2, 3, 4, 5, 6, 7] : (type === 6 ? [3, 4, 5, 6, 7] : [2])
        },
        data: data
      }
    ],
    bmap: {
      center: [116.46, 39.92],
      zoom: 11.8,
      roam: true,
      mapStyle: {
        styleJson: [{
          'featureType': 'water',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'land',
          'elementType': 'all',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'railway',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'highway',
          'elementType': 'all',
          'stylers': {
            'color': '#999999'
          }
        }, {
          'featureType': 'highway',
          'elementType': 'labels',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'geometry',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'geometry.fill',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'poi',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'green',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'subway',
          'elementType': 'all',
          'stylers': {
            // 'visibility': 'off'
          }
        }, {
          'featureType': 'manmade',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'local',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'labels',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'boundary',
          'elementType': 'all',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'building',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'label',
          'elementType': 'labels.text.fill',
          'stylers': {
            'color': 'rgba(0,0,0,0)'
          }
        }]
      }
    }
  };
  if (option && typeof option === "object") {
    myChart.setOption(option, true);

    myChart.on('click', function (params) {
      console.log(params)
      drawDoughnutChart(params.data.slice(3))
    })

    const map = myChart.getModel().getComponent('bmap').getBMap();
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));    
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));    
  }
}


function drawDoughnutChart(data) {
  const ctx = 'draw-area-right'
  const myChart = new Chart(ctx,{
    type: 'doughnut',
    data: {
      labels: ['色情广告', '发票办证', '银行相关', '房产交易', '其他'],
      datasets: [{
        data: data,
        backgroundColor: COLORS2.slice(1),
      }]
    },
    // options: options
  });
}
