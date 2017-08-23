export var ChartConfig = {
    chart: {
        type: 'pie'
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: 'black'
                }
            }
        }
    },
    series: [{
        name: "Portfolios",
        colorByPoint: true,
        data: [
            {
                name: "Proposal",
                y: 33.33
            }, {
                name: "Priced",
                y: 33.33,
                sliced: true,
                selected: true
            }, {
                name: "Qualified",
                y: 16.66
            }, {
                name: "Indicative Pricing Only",
                y: 16.66
            }]
    }]
}