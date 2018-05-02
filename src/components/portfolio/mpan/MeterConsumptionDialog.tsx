import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';
import { MeterConsumptionSummary } from "../../../model/Meter";

interface MeterConsumptionDialogProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    consumption: MeterConsumptionSummary;
}
  
interface DispatchProps {
}

class MeterConsumptionDialog extends React.Component<MeterConsumptionDialogProps & StateProps & DispatchProps, {}> {
    renderDynamicTable(columns: string[], values: string[][]){
        var rows = values.map((row, index) => {
           return (
               <tr key={index}>
                   {row.map((cellValue) => {
                       return (<td>{cellValue}</td>);
                   })}
               </tr>);
        });
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        {columns.map(c => {
                            return (<th key={c}>{c}</th>)
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>);
    }


    render() {
        if(this.props.working || this.props.consumption == null){
            return (<div className="uk-modal-dialog upload-report-modal uk-modal-body"><Spinner hasMargin={true} /></div>);
        }
        return (
            <div className="uk-modal-dialog upload-report-modal">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Meter Consumption Report</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                        <ul data-uk-tab>
                            <li><a href="#">Electricity</a></li>
                            <li><a href="#">Gas</a></li>
                        </ul>
                        <ul className="uk-switcher restrict-height-hack">
                            <li>{this.renderDynamicTable(this.props.consumption.electricityHeaders, this.props.consumption.electrictyConsumptionEntries)}</li>
                            <li>{this.renderDynamicTable(this.props.consumption.gasHeaders, this.props.consumption.gasConsumptionEntries)}</li>
                        </ul>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, MeterConsumptionDialogProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, MeterConsumptionDialogProps> = (state: ApplicationState) => {
    return {
        consumption: state.meters.consumption.value,
        working: state.meters.consumption.working,
        error: state.meters.consumption.error,
        errorMessage: state.meters.consumption.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(MeterConsumptionDialog);