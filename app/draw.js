function draw(time, rawData) {
  var dom = document.getElementById(`draw-area-${time}`);
  var myChart = echarts.init(dom);
  var app = {};
  option = null;
  var COLORS = [
    "#ffffff",
    "#ffd9cc",
    "#ffb399",
    "#ff8c66",
    "#ff6333",
    "#ff3c00",
    "#cc2c00",
    "#992600",
    "#661800",
    "#330c00",
  ];
  var latExtent = [39.5, 40.6];
  var lngExtent = [115.9, 116.8];
  var cellCount = [100, 100];
  var cellSizeCoord = [
    (latExtent[1] - latExtent[0]) / cellCount[0],
    (lngExtent[1] - lngExtent[0]) / cellCount[1]
  ];
  var gapSize=0;

  var data = [];
  for (var i = 0; i < 100; i++) {
    for (var j = 0; j < 100; j++) {
      data.push([i, j, grade(rawData[i][j])]) // rawData_class1
    }
  }

  function grade(value) {
    if (value <= 0) {
      return 0;
    }
    if (value <= 50) {
      return 1;
    }
    if (value <= 100) {
      return 2;
    }
    if (value <= 200) {
      return 3;
    }
    if (value <= 500) {
      return 4;
    }
    if (value <= 1000) {
      return 5;
    }
    if (value <= 2000) {
      return 6;
    }
    if (value <= 4000) {
      return 7;
    }
    return 8;
  }

  function renderItem(params, api) {
    var context = params.context;
    var lngIndex = api.value(0);
    var latIndex = api.value(1);
    var coordLeftTop = [
      +(lngExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
      +(latExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
    ];
    var pointLeftTop = getCoord(params, api, lngIndex, latIndex);
    var pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1);

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
    var coords = params.context.coords || (params.context.coords = []);
    var key = lngIndex + '-' + latIndex;

    // bmap returns point in integer, which makes cell width unstable.
    // So we have to use right bottom point.
    return coords[key] || (coords[key] = api.coord([
      +(lngExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
      +(latExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
    ]));
  }

  option = {
    tooltip: {},
    visualMap: {
      type: 'piecewise',
      inverse: true,
      top: 10,
      left: 10,
      pieces: [{
        value: 0, color: COLORS[0]
      }, {
        value: 1, color: COLORS[1]
      }, {
        value: 2, color: COLORS[2]
      }, {
        value: 3, color: COLORS[3]
      }, {
        value: 4, color: COLORS[4]
      }, {
        value: 5, color: COLORS[5]
      }, {
        value: 6, color: COLORS[6]
      }, {
        value: 7, color: COLORS[7]
      }, {
        value: 8, color: COLORS[8]
      }],
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
        encode: {
          tooltip: 2
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
            'color': '#f3f3f3'
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
            'visibility': 'off'
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
  }
}
