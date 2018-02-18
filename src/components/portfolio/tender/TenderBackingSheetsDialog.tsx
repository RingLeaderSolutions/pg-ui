import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { Tender, BackingSheet } from "../../../model/Tender";

interface TenderBackingSheetsDialogProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    backing_sheets: BackingSheet[];
}
  
interface DispatchProps {
}

class TenderBackingSheetsDialog extends React.Component<TenderBackingSheetsDialogProps & StateProps & DispatchProps, {}> {

    renderBackingSheetCells(){
        return this.props.backing_sheets.map(bs => {
            let totalConsumption = bs.consumption1 + bs.consumption2 + bs.consumption3 + bs.consumption4 + bs.consumption5;
            return (
                <tr key={bs.mpanCore}>
                    <td>{bs.siteCode}</td>
                    <td>{bs.address1}</td>
                    <td>{bs.address2}</td>
                    <td>{bs.town}</td>
                    <td>{bs.postcode}</td>
                    <td>{bs.utility}</td>
                    <td>{bs.product}</td>
                    <td>{bs.contractLength}</td>
                    <td>{bs.billingFrequency}</td>
                    <td>{bs.paymentTerms}</td>
                    <td>{bs.topline}</td>
                    <td>{bs.mpanCore}</td>

                    <td>{bs.consumption1}</td>
                    <td>{bs.consumption2}</td>
                    <td>{bs.consumption3}</td>
                    <td>{bs.consumption4}</td>
                    <td>{bs.consumption5}</td>
                    <td>{totalConsumption}</td>
                    
                    <td>{bs.rate1}</td>
                    <td>{bs.rate2}</td>
                    <td>{bs.rate3}</td>
                    <td>{bs.rate4}</td>
                    <td>{bs.rate5}</td>

                    <td>{bs.duosRedConsumption}</td>
                    <td>{bs.duosAmberConsumption}</td>
                    <td>{bs.duosGreenConsumption}</td>

                    <td>{bs.duosRedRate}</td>
                    <td>{bs.duosAmberRate}</td>
                    <td>{bs.duosGreenRate}</td>

                    <td>{bs.greenPercentage}</td>
                    <td>{bs.greenPremiumRate}</td>

                    <td>{bs.fixedCharge}</td>
                    <td>{bs.fixedChargeUOM}</td>

                    <td>{bs.settlementRate}</td>
                    <td>{bs.kVARate}</td>
                    <td>{bs.availabilityChargeUOM}</td>
                    <td>{bs.kVACapacity}</td>
                    <td>{bs.fITRate}</td>
                    <td>{bs.cCLRate}</td>
                    <td>{bs.commission}</td>
                    <td>{bs.vatPercentage}</td>

                    <td>{bs.rate1Cost}</td>
                    <td>{bs.rate2Cost}</td>
                    <td>{bs.rate3Cost}</td>
                    <td>{bs.rate4Cost}</td>
                    <td>{bs.rate5Cost}</td>
                    <td>{bs.duosRedCost}</td>
                    <td>{bs.duosAmberCost}</td>
                    <td>{bs.duosGreenCost}</td>
                    <td>{bs.greenPremiumCost}</td>
                    <td>{bs.fixedChargesCost}</td>
                    <td>{bs.settlementsCost}</td>
                    <td>{bs.kVACosts}</td>
                    <td>{bs.fITCosts}</td>
                    <td>{bs.cCLCosts}</td>
                    <td>{bs.commissionCost}</td>
                    <td>{bs.totalCostIncCCL}</td>
                    <td>{bs.vATCost}</td>
                    <td>{bs.totalCostIncVAT}</td>
                </tr>
            )
        })
    }

    render() {
        if(this.props.working || this.props.backing_sheets == null){
            return (<div className="uk-modal-dialog backing-sheet-modal uk-modal-body"><Spinner hasMargin={true} /></div>);
        }
        let firstBs = this.props.backing_sheets[0];
        return (
            <div className="uk-modal-dialog backing-sheet-modal">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Contract Rates</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                    <table className='uk-table uk-table-divider'>
                    <thead>
                        <tr>
                            <th className="blue-header">Site Code</th>
                            <th className="blue-header">Address 1</th>
                            <th className="blue-header">Address 2</th>
                            <th className="blue-header">Town</th>
                            <th className="blue-header">Post Code</th>
                            <th className="blue-header">Utility</th>
                            <th className="blue-header">Product</th>
                            <th className="blue-header">Contract Length (mo)</th>
                            <th className="blue-header">Billing Freq</th>
                            <th className="blue-header">Payment Terms (days)</th>
                            <th className="blue-header">Top Line Profile</th>
                            <th className="blue-header">Core MPAN</th>

                            <th className="green-header">{firstBs.rateName1}</th>
                            <th className="green-header">{firstBs.rateName2}</th>
                            <th className="green-header">{firstBs.rateName3}</th>
                            <th className="green-header">{firstBs.rateName4}</th>
                            <th className="green-header">{firstBs.rateName5}</th>
                            <th className="green-header">Total Units</th>
                            <th className="green-header">Unit Rate 1 p/kWh</th>
                            <th className="green-header">Unit Rate 2 p/kWh</th>
                            <th className="green-header">Unit Rate 3 p/kWh</th>
                            <th className="green-header">Unit Rate 4 p/kWh</th>
                            <th className="green-header">Unit Rate 5 p/kWh</th>
                            <th className="green-header">DUoS Red Units</th>
                            <th className="green-header">DUoS Amber Units</th>
                            <th className="green-header">DUoS Green Units</th>
                            <th className="green-header">DUoS Red Rate p/kWh</th>
                            <th className="green-header">DUoS Amber Rate p/kWh</th>
                            <th className="green-header">DUoS Green Rate p/kWh</th>
                            <th className="green-header">Green %</th>
                            <th className="green-header">Green Premium Rate p/kWh</th>
                            <th className="green-header">Standing Charge</th>
                            <th className="green-header">Standing Charge UOM</th>
                            <th className="green-header">Settlements</th>
                            <th className="green-header">Available Capacity</th>
                            <th className="green-header">Availability Charge UOM</th>
                            <th className="green-header">kVA</th>
                            <th className="green-header">FiT Rate p/kWh</th>
                            <th className="green-header">CCL Rate p/kWh</th>
                            <th className="green-header">Commission Rate p/kWh</th>
                            <th className="green-header">Vat Rate %</th>

                            <th className="yellow-header">{firstBs.rateName1}</th>
                            <th className="yellow-header">{firstBs.rateName2}</th>
                            <th className="yellow-header">{firstBs.rateName3}</th>
                            <th className="yellow-header">{firstBs.rateName4}</th>
                            <th className="yellow-header">{firstBs.rateName5}</th>
                            <th className="yellow-header">DUoS Red Band Cost</th>
                            <th className="yellow-header">DUoS Amber Band Cost</th>
                            <th className="yellow-header">DUoS Green Band Cost</th>
                            <th className="yellow-header">Green Premium</th>
                            <th className="yellow-header">Standing Charge</th>
                            <th className="yellow-header">Settlements</th>
                            <th className="yellow-header">Available Capacity</th>
                            <th className="yellow-header">FiT Cost</th>
                            <th className="yellow-header">CCL</th>
                            <th className="yellow-header">Commission</th>
                            <th className="yellow-header">Total inc CCL</th>
                            <th className="yellow-header">VAT</th>
                            <th className="yellow-header">Total inc VAT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderBackingSheetCells()}
                    </tbody>
                </table>
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
        backing_sheets: state.portfolio.tender.backing_sheets.value,
        working: state.portfolio.tender.backing_sheets.working,
        error: state.portfolio.tender.backing_sheets.error,
        errorMessage: state.portfolio.tender.backing_sheets.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderBackingSheetsDialog);