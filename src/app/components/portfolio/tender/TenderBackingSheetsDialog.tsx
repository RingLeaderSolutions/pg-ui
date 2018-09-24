import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';

import { ContractRatesResponse } from "../../../model/Tender";
import { closeModalDialog } from "../../../actions/viewActions";

interface TenderBackingSheetsDialogProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    contract_rates: ContractRatesResponse;
}
  
interface DispatchProps {
    closeModalDialog: () => void;
}

class TenderBackingSheetsDialog extends React.Component<TenderBackingSheetsDialogProps & StateProps & DispatchProps, {}> {

    renderDynamicTable(columns: string[], values: string[][]){
        var rows = values
        .sort(
            (rowA, rowB) => {
                if (rowA[0] < rowB[0]) return -1;
                if (rowA[0] > rowB[0]) return 1;
                return 0;
            })
        .map((row, rowIndex) => {
           return (
               <tr key={rowIndex}>
                   {row.map((cellValue, cellIndex) => {
                       var key = `${rowIndex},${cellIndex}`;
                       return (<td key={key}>{cellValue}</td>);
                   })}
               </tr>);
        });
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        {columns.map((c, colIndex) => {
                            return (<th key={colIndex}>{c}</th>)
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
            return (<div className="uk-modal-body"><Spinner hasMargin={true} /></div>);
        }

        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-pound-sign uk-margin-right"></i>Contract Rates</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                    {this.renderDynamicTable(this.props.contract_rates.headers, this.props.contract_rates.entries)}
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderBackingSheetsDialogProps> = (dispatch) => {
    return {
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderBackingSheetsDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        contract_rates: state.portfolio.tender.backing_sheets.value,
        working: state.portfolio.tender.backing_sheets.working,
        error: state.portfolio.tender.backing_sheets.error,
        errorMessage: state.portfolio.tender.backing_sheets.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderBackingSheetsDialog);