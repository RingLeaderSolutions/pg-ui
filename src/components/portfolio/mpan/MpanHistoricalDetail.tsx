import * as React from "react";
import Header from "../../common/Header";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { MpanHistorical, Portfolio } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { ChartConfig } from "./MpanHistoricalChartConfig";
import * as moment from 'moment';

var ReactHighCharts = require("react-highcharts");
var ReactHighstock = require('react-highcharts/ReactHighstock.src');

import { getMpanHistorical } from '../../../actions/portfolioActions';

interface MpanHistoricalDetailProps extends RouteComponentProps<void> {
}

interface StateProps {
  historical: MpanHistorical;
  working: boolean;
  error: boolean;
  errorMessage: string;
  portfolio: Portfolio;
}

interface DispatchProps {
    getHistorical: (historicalId: string) => void;
}

class MpanHistoricalDetail extends React.Component<MpanHistoricalDetailProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        var historicalId = this.props.location.pathname.split('/')[2];        
        this.props.getHistorical(historicalId);
    }

    returnToPortfolio(){
        if(this.props.portfolio){
            this.props.history.push(`/portfolio/${this.props.portfolio.id}`);            
        }
        else {
            this.props.history.push(`/portfolios`);                        
        }
    }

    renderChart(){
        var config = ChartConfig;
        
        var values = [].concat.apply([], this.props.historical.entries.map(entry => {
            var hour = 0;
            var minute = "00";

            return entry.data.map((data, index) => {
                if(index != 0){
                    if(minute == "30"){
                        hour++;
                        minute = "00";
                    }
                    else {
                        minute = "30";
                    }
                }
                
                var fullDateString = `${entry.date} ${hour}:${minute}`;
                var date = moment(fullDateString);
                var unixDate = date.format('x');
                return [Number(unixDate), data];
            });
        }));

        config.series[0].data = values;
        return (<ReactHighstock config={config} />);
    }

    render() {
        if(this.props.working || this.props.historical == null){
            return (<Spinner />);
        }
        
        var headerTitle = `MPAN Historical: ${this.props.historical.mpanCore}`;
        var chart = this.renderChart();
        return (
            <div className="content-inner-portfolio">
                <Header title={headerTitle} />
                <ul>
                {chart}
                </ul>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, MpanHistoricalDetailProps> = (dispatch) => {
    return {
        getHistorical: (historicalId: string) => dispatch(getMpanHistorical(historicalId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, MpanHistoricalDetailProps> = (state: ApplicationState) => {
    return {
        historical: state.portfolio.historical.value,
        working: state.portfolio.historical.working,
        error: state.portfolio.historical.error,
        errorMessage: state.portfolio.historical.errorMessage,
        portfolio: state.portfolio.selected.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(MpanHistoricalDetail);