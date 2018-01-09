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
        var utilityName = this.props.utility == UtilityType.Gas ? "GAS" : "ELECTRICITY";
        return this.props.details.meterGroups.find(mg => mg.groupName == utilityName)
            .meterCount;
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
        var modalId = "modal-select-suppliers-" + this.props.utility;
        var toggleModalClass = "target: #" + modalId;

        return (
            <div className="uk-card uk-card-default uk-card-body">
                <h3>Status</h3>
                <div className="uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
                    <p>Meter count: <strong>{meterCount}</strong></p>
                    <p>Consumption: <strong>0 GWh</strong></p>
                </div>
                <div className="tender-actions uk-margin">
                    <div className="uk-grid uk-child-width-expand@s" data-uk-grid>
                        <div className="uk-margin uk-grid uk-width-expand@s uk-grid-match" data-uk-grid>
                            <p>Eligible suppliers: <strong>{eligibleSupplierCount}</strong></p>
                            <div className="uk-margin">
                                <button className="uk-button uk-button-default" type="button"  data-uk-toggle={toggleModalClass}>
                                    <span className="uk-margin-small-right" data-uk-icon="icon: database" />
                                    Suppliers
                                </button>
                            </div>
                        </div>
                        <div className="uk-margin uk-width-1-5">
                            <button className="uk-button uk-button-primary" type="button">
                                <span className="uk-margin-small-right" data-uk-icon="icon: copy" />
                                Pack
                            </button>
                        </div>
                        <div className="uk-margin uk-width-1-5">
                            <button className="uk-button uk-button-primary" type="button">
                                <span className="uk-margin-small-right" data-uk-icon="icon: forward" />
                                Issue
                            </button>
                        </div>
                    </div>
                </div>

                <div id={modalId} data-uk-modal="center: true">
                    <TenderSupplierSelectDialog suppliers={this.props.suppliers} />
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