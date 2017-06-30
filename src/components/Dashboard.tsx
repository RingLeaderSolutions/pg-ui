import * as React from "react";
import Header from "./Header";
import CounterCard from "./CounterCard";

var ReactHighCharts = require("react-highcharts");

const Dashboard : React.SFC<{}> = () => {
    var config = {
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
    };

    return (
        <div className="content-inner">
            <Header title="Dashboard" />
            <div className="content-dashboard">
                <div className="uk-child-width-expand@s uk-text-center" data-uk-grid>
                    <CounterCard title="6" label="Total Portfolios" />
                    <CounterCard title="56" label="Total Sites" />
                    <CounterCard title="4,583" label="Total MPANs" />
                    <CounterCard title="TPI" label="Your Team" />
                </div>
                <div className="uk-child-width-expand@s uk-text-center" data-uk-grid>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h3>Portfolio Status</h3>
                            <ReactHighCharts config={config} />
                        </div>
                    </div>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h3>Portfolio Timeline</h3>
                            <table className="uk-table uk-table-divider">
                                <thead>
                                    <tr>
                                        <th>Contract Dates</th>
                                        <th>Portfolios</th>
                                        <th>MPAN Workload</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1st October 2017</td>
                                        <td><strong>Quantum Analysis 17/18</strong></td>
                                        <td><span className="uk-label uk-label-danger">487</span></td>
                                    </tr>
                                    <tr>
                                        <td>1st April 2018</td>
                                        <td><strong>At Energy 18/19</strong></td>
                                        <td><span className="uk-label uk-label-warning">126</span></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><strong>Capalona 18/19</strong></td>
                                        <td><span className="uk-label uk-label-warning">65</span></td>
                                    </tr>
                                    <tr>
                                        <td>1st July 2018</td>
                                        <td><strong>Zenergi Ltd 18/19</strong></td>
                                        <td><span className="uk-label uk-label-danger">382</span></td>
                                    </tr>
                                    <tr>
                                        <td>1st April 2019</td>
                                        <td><strong>Eco Elite 19/20</strong></td>
                                        <td><span className="uk-label uk-label-warning">23</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Dashboard;