import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import * as moment from 'moment';

import { format } from 'currency-formatter';

import { Tender, TenderSupplier, TenderOfferType } from "../../../model/Tender";
import { openModalDialog } from "../../../actions/viewActions";
import CounterCard from "../../common/CounterCard";

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
    openModalDialog: (dialogId: string) => void;
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

    renderStringIfNotNull(value: string){
        if(value == null || value == ""){
            return "-";
        }
        return value;
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.suppliers == null || this.props.details == null){
            return (<Spinner />);
        }
        
        var { tender } = this.props;
        
        var eligibleSupplierCount = this.getSupplierCount();
        var totalCommission = (tender.commission / 100) * tender.annualConsumption;

        var durationsString = tender.offerTypes
        .sort(
            (o1: TenderOfferType, o2: TenderOfferType) => {        
                if (o1.duration < o2.duration) return -1;
                if (o1.duration > o2.duration) return 1;
                return 0;
            })
        .map(o => {
            if(o.duration == 0){
                return "Flexi";
            }
            return String(o.duration)
        })
        .join(', ');

        var deadline = moment(this.props.tender.deadline);
        var deadlineHasPassed = moment().diff(deadline, 'hours') > 0;
        return (
        <div>
            {deadlineHasPassed ? (
                <div className="uk-alert uk-alert-warning" data-uk-alert>
                    <div className="uk-grid uk-grid-small" data-uk-grid>
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                        </div>
                        <div className="uk-width-expand uk-flex uk-flex-middle">
                            <div>
                                <p>This tender's deadline ({deadline.format("DD/MM/YYYY")}) has now passed.</p>
                                <p>You won't be able to generate new or issue existing requirements packs to suppliers until this has been set to a date in the future.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            
            <div className="uk-margin-top uk-margin-bottom">
                <p style={{textAlign:"center"}}><strong>Status:</strong> {tender.packStatusMessage}</p>
            </div>
  
            <div className="uk-grid uk-margin-small-left uk-margin-small-right uk-grid-match" data-uk-grid>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <div className="uk-grid uk-grid-collapse">
                        <div className="uk-width-expand" />
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <p className="uk-text-bold">{tender.assignedSuppliers.length}/{eligibleSupplierCount}</p>
                        </div>
                        <div className="uk-width-expand uk-flex uk-flex-middle">
                            <button className="uk-button uk-button-default borderless-button uk-button-small uk-margin-left" type="button"  onClick={() => this.props.openModalDialog("select_tender_suppliers")}>
                                <i className="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                    <p className="uk-text-meta uk-margin-small">Assigned Suppliers</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{tender.meterCount}</p>
                    <p className="uk-text-meta uk-margin-small">Meter #</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{tender.annualConsumption.toLocaleString()} {tender.acuom}</p>
                    <p className="uk-text-meta uk-margin-small">Consumption</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{tender.commission}p/{tender.acuom}</p>
                    <p className="uk-text-meta uk-margin-small">Commission Rate</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{format(totalCommission, { locale: 'en-GB'})}</p>
                    <p className="uk-text-meta uk-margin-small">Commission</p>
                </div>
            </div>

            <div className="uk-grid uk-margin-small-left uk-margin-small-right uk-grid-match" data-uk-grid>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{this.renderStringIfNotNull(tender.billingMethod)}</p>
                    <p className="uk-text-meta uk-margin-small">Billing Method</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{moment.utc(tender.deadline).local().format("DD/MM/YYYY")}</p>
                    <p className="uk-text-meta uk-margin-small">Deadline</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{tender.requirements.paymentTerms != 0 ? `${tender.requirements.paymentTerms} days` : "-"}</p>
                    <p className="uk-text-meta uk-margin-small">Payment Terms</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{durationsString} months</p>
                    <p className="uk-text-meta uk-margin-small">Requested Duration{tender.offerTypes.length > 1 ? "s" : null}</p>
                </div>
            </div>
        </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderStatusProps> = (dispatch) => {
    return {
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderStatusProps> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.suppliers.working,
        error: state.portfolio.tender.tenders.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderStatus);