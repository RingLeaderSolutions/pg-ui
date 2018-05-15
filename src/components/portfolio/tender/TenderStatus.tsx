import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { format } from 'currency-formatter';

import { Tender, TenderSupplier } from "../../../model/Tender";

interface TenderStatusProps {
    tender: Tender;
    utility: UtilityType;
    details: PortfolioDetails;
}

interface StateProps {
  suppliers: TenderSupplier[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
}

class TenderStatus extends React.Component<TenderStatusProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }



    getMeterCount(){
        var { meterGroups } = this.props.details;
        if (meterGroups == null || meterGroups.length == 0){
            return 0;
        }

        var utilityName = this.props.utility == UtilityType.Gas ? "GAS" : this.props.tender.halfHourly ? "HH" : "NHH";
        var foundGroup = meterGroups.find(mg => mg.groupName == utilityName);

        return foundGroup ? foundGroup.meterCount : 0;
    }

    getSupplierCount(){
        if(this.props.utility == UtilityType.Gas){
            return this.props.suppliers.filter(s => s.gasSupplier).length;
        }

        return this.props.suppliers.filter(s => s.electricitySupplier).length;
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.suppliers == null || this.props.details == null){
            return (<Spinner />);
        }
        
        var { tender } = this.props;

        var meterCount = this.getMeterCount();
        var eligibleSupplierCount = this.getSupplierCount();

        var totalCommission = (tender.commission / 100) * tender.annualConsumption;

        var supplierModalId = "modal-select-suppliers-" + tender.tenderId;
        var toggleSupplierModalClass = "target: #" + supplierModalId;

        // return (
        //     <div className="uk-card uk-card-small uk-card-default uk-card-body">
        //         <div className="uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
        //             <p>Assigned suppliers: <strong>{tender.assignedSuppliers.length}/{eligibleSupplierCount}</strong></p>
        //             {/* <p>Meter count: <strong>{meterCount}</strong></p> */}
        //             <p>Consumption: <strong>{tender.annualConsumption.toLocaleString()} {tender.acuom}</strong></p>
        //             <p>Commission Rate: <strong>{tender.commission}p/{tender.acuom}</strong></p>
        //             <p>Commission: <strong>{format(totalCommission, { locale: 'en-GB'})}</strong></p>
        //         </div>
        //         <div className="uk-margin-top uk-margin-bottom">
        //             <p style={{textAlign:"center"}}><strong>Status:</strong> {tender.packStatusMessage}</p>
        //         </div>
        //     </div>)

        return (
        <div>
            <div className="uk-margin-top uk-margin-bottom">
                <p style={{textAlign:"center"}}><strong>Status:</strong> {tender.packStatusMessage}</p>
            </div>
            <div className="uk-grid uk-margin-small-left uk-margin-small-right uk-grid-match" data-uk-grid>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{tender.assignedSuppliers.length}/{eligibleSupplierCount}</p>
                    <p className="uk-text-meta uk-margin-small">Assigned Suppliers</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{tender.annualConsumption.toLocaleString()} {tender.acuom}</p>
                    <p className="uk-text-meta uk-margin-small">Consumption</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{tender.commission}p/{tender.acuom}</p>
                    <p className="uk-text-meta uk-margin-small">Commission Rate</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{format(totalCommission, { locale: 'en-GB'})}</p>
                    <p className="uk-text-meta uk-margin-small">Commission</p>
                </div>
            </div>
        </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderStatusProps> = (dispatch) => {
    return {    
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderStatusProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working,
        error: state.portfolio.tender.tenders.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderStatus);