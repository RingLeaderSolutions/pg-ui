import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { getPortfolioTenders, getTenderSuppliers } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import TenderSupplierSelectDialog from "./TenderSupplierSelectDialog";
import TenderPackDialog from "./TenderPackDialog";
import IssueTenderPackDialog from "./IssueTenderPackDialog";

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
    getTenderSuppliers: () => void;
}

class TenderStatus extends React.Component<TenderStatusProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){ 
        this.props.getTenderSuppliers();
    }

    getMeterCount(){
        var { meterGroups } = this.props.details;
        if (meterGroups == null || meterGroups.length == 0){
            return 0;
        }

        var utilityName = this.props.utility == UtilityType.Gas ? "GAS" : "ELECTRICITY";
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
        
        var meterCount = this.getMeterCount();
        var eligibleSupplierCount = this.getSupplierCount();

        var supplierModalId = "modal-select-suppliers-" + this.props.tender.tenderId;
        var toggleSupplierModalClass = "target: #" + supplierModalId;

        var packModalId = "modal-generate-packs-" + this.props.tender.tenderId;
        var togglePackModalClass = "target: #" + packModalId;

        var issuePackModalId = "modal-generate-issue-pack-" + this.props.tender.tenderId;
        var toggleIssuePackModalClass = "target: #" + issuePackModalId;

        var { tender } = this.props;
        return (
            <div className="uk-card uk-card-default uk-card-body">
                <h3>Status</h3>
                <div className="uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
                    <p>Meter count: <strong>{meterCount}</strong></p>
                    <p>Consumption: <strong>{tender.annualConsumption.toLocaleString()} {tender.acuom}</strong></p>
                </div>
                <div className=" uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
                    <p>Eligible suppliers: <strong>{eligibleSupplierCount}</strong></p>
                    <p>Commission: <strong>{this.props.tender.commission}p/{tender.acuom}</strong></p>
                </div>
                <div className="tender-actions uk-margin-top">
                    <div className="uk-grid uk-child-width-expand@s" data-uk-grid>
                        <div className="uk-margin-small">
                            <button className="uk-button uk-button-default" type="button"  data-uk-toggle={toggleSupplierModalClass}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: database" />
                                Select Suppliers
                            </button>
                        </div>
                        <div className="uk-margin-small uk-width-1-4">
                            <button className="uk-button uk-button-primary" type="button" data-uk-toggle={togglePackModalClass}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: copy" />
                                View Packs
                            </button>
                        </div>
                        <div className="uk-margin-small uk-width-1-4">
                            <button className="uk-button uk-button-primary" type="button" data-uk-toggle={toggleIssuePackModalClass}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: forward" />
                                Issue Pack
                            </button>
                        </div>
                        </div>
                </div>

                <div id={supplierModalId} data-uk-modal="center: true">
                    <TenderSupplierSelectDialog suppliers={this.props.suppliers} assignedSuppliers={this.props.tender.assignedSuppliers} tenderId={this.props.tender.tenderId}/>
                </div>

                <div id={packModalId} data-uk-modal="center: true">
                    <TenderPackDialog tender={this.props.tender} portfolioId={this.props.details.portfolio.id} />
                </div>

                <div id={issuePackModalId} data-uk-modal="center: true">
                    <IssueTenderPackDialog tender={this.props.tender} portfolioId={this.props.details.portfolio.id} />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderStatusProps> = (dispatch) => {
    return {
        getTenderSuppliers: () => dispatch(getTenderSuppliers())        
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