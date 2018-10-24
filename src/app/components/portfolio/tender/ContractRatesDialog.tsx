import * as React from "react";
import { MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { ContractRatesResponse } from "../../../model/Tender";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

interface ContractRatesDialogProps extends ModalDialogProps { }

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    contract_rates: ContractRatesResponse;
}
 
class ContractRatesDialog extends React.Component<ContractRatesDialogProps & StateProps, {}> {

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
            <table className="table">
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
            return (<LoadingIndicator />)
        }

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-pound-sign mr-2"></i>Contract Rates</ModalHeader>
                <ModalBody className="p-0" style={{overflow: 'auto'}}>
                    {this.renderDynamicTable(this.props.contract_rates.headers, this.props.contract_rates.entries)}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Close
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapStateToProps: MapStateToProps<StateProps, ContractRatesDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        contract_rates: state.portfolio.tender.backing_sheets.value,
        working: state.portfolio.tender.backing_sheets.working,
        error: state.portfolio.tender.backing_sheets.error,
        errorMessage: state.portfolio.tender.backing_sheets.errorMessage
    };
};
  
export default asModalDialog(
{ 
    name: ModalDialogNames.ContractRates, 
    centered: true, 
    backdrop: true,
    size: "full"
}, mapStateToProps, null)(ContractRatesDialog)