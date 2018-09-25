import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { UtilityIcon } from "../../common/UtilityIcon";
import { Router } from "react-router";

interface PortfolioMeterStatusProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  working: boolean;
  router: Router;
}

interface DispatchProps {
}

class PortfolioMeterStatus extends React.Component<PortfolioMeterStatusProps & StateProps & DispatchProps, {}> {
    renderConsumptionValue(value: number){
        if(value > 1000000){
            var gigaValue = value / 1000000;
            return `${gigaValue.toFixed(3).toLocaleString()} GWh`;
        }
        return `${value.toLocaleString()} kWh`;
    }

    createSummaryTable(){
        var rows = this.props.details.meterGroups.map(mg => {
            return (
                <tr key={mg.groupName}>
                    <td><UtilityIcon utility={mg.groupName} /></td>
                    <td>{this.renderConsumptionValue(mg.consumption)}</td>
                    <td>{mg.supplyDataCount}/{mg.meterCount}</td>
                    <td>{mg.groupName == "HH" ? `${mg.historicalCount}/${mg.meterCount}` : "N/A"}</td>
                </tr>
            )
        })
        return (
            <table className="uk-table uk-table-divider">
            <thead>
                <tr>
                    <th>Utility</th>
                    <th>Consumption</th>
                    <th data-uk-tooltip="title: The number of meters that have successfully uploaded supply data records">Supply Data</th>
                    <th data-uk-tooltip="title: The number of meters that have associated historic data provided">Historical</th>
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
                content = (
                    <div className="uk-alert-default uk-margin-small-top uk-margin-small-bottom uk-text-center" data-uk-alert>
                        <p><i className="fas fa-info-circle uk-margin-small-right"></i>No meters have been uploaded to this portfolio yet.</p>
                    </div>);    
            }
            content = this.createSummaryTable();
        }

        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h4 className="uk-text-center"><i className="fas fa-stopwatch uk-margin-small-right"></i>Meter Status</h4>
                    {content}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMeterStatusProps> = () => {
    return {};
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMeterStatusProps, ApplicationState> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        working: state.portfolio.details.working,
        router: state.router
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeterStatus);