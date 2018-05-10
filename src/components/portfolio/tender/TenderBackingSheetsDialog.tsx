import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { Tender, BackingSheet, ContractRatesResponse } from "../../../model/Tender";

interface TenderBackingSheetsDialogProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    contract_rates: ContractRatesResponse;
}
  
interface DispatchProps {
}

class TenderBackingSheetsDialog extends React.Component<TenderBackingSheetsDialogProps & StateProps & DispatchProps, {}> {

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
        if(this.props.working || this.props.contract_rates == null){
            return (<div className="uk-modal-dialog backing-sheet-modal uk-modal-body"><Spinner hasMargin={true} /></div>);
        }

        return (
            <div className="uk-modal-dialog backing-sheet-modal">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Contract Rates</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                    {this.renderDynamicTable(this.props.contract_rates.headers, this.props.contract_rates.entries)}
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderBackingSheetsDialogProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderBackingSheetsDialogProps> = (state: ApplicationState) => {
    return {
        contract_rates: state.portfolio.tender.backing_sheets.value,
        working: state.portfolio.tender.backing_sheets.working,
        error: state.portfolio.tender.backing_sheets.error,
        errorMessage: state.portfolio.tender.backing_sheets.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderBackingSheetsDialog);