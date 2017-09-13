export var ChartConfig = {
    chart: {
        zoomType: 'x'
    },
    title: {
        text: 'Historic Generation'
    },
    subtitle: {
        text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
    },
    rangeSelector: {
        selected: 1
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        min: 2,
        title: {
            text: 'Generation'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, '#ffffff'],
                    [1, '#ffffff']
                ]
            },
            marker: {
                radius: 2
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            }
        }
    },

    series: [{
        type: 'area',
        name: '',
        data: [
            [Date.UTC(2013,5,2),0.7695],
            [Date.UTC(2013,5,3),0.7648],
            [Date.UTC(2013,5,4),0.7645],
            [Date.UTC(2013,5,5),0.7638],
            [Date.UTC(2013,5,6),0.7549],
            [Date.UTC(2013,5,7),0.7562]
        ],
        tooltip: {
            valueDecimals: 2
        }
    }]
}