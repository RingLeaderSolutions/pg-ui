import * as React from "react";
import Header from "../../common/Header";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';

interface PortfolioMeterStatusProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  working: boolean;
}

interface DispatchProps {
}

class PortfolioMeterStatus extends React.Component<PortfolioMeterStatusProps & StateProps & DispatchProps, {}> {
    createSummaryTable(){
        var rows = this.props.details.meterGroups.map(mg => {
            return (
                <tr key={mg.groupName}>
                    <td>{mg.groupName}</td>
                    <td>{mg.consumption.toLocaleString()} kWh</td>
                    <td>{mg.meterCount}</td>
                    <td>{mg.supplyDataCount}</td>
                    <td>{mg.historicalCount}</td>
                    <td>{mg.forecastCount}</td>
                </tr>
            )
        })
        return (
            <table className="uk-table uk-table-divider">
            <thead>
                <tr>
                    <th>Meter Type</th>
                    <th>Consumption</th>
                    <th>Count</th>
                    <th>Supply Data Provided</th>
                    <th>Historical Provided</th>
                    <th>Forecast Generated</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        )
    }

    render() {
        var content = (<Spinner hasMargin={true}/>);
        if(!this.props.working && this.props.details.meterGroups != null){
            if(this.props.details.meterGroups.length == 0){
                content = (<p>There are no meters uploaded for this portfolio yet</p>);    
            }
            content = this.createSummaryTable();
        }

        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h4><span className="uk-margin-small-right" data-uk-icon="icon: list"></span>Meter Status</h4>
                    {content}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMeterStatusProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMeterStatusProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        working: state.portfolio.details.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeterStatus);