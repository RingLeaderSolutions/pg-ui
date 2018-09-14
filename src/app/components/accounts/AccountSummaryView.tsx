import * as React from "react";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail } from '../../model/Models';
import Spinner from '../common/Spinner';
import { openModalDialog } from "../../actions/viewActions";
import CounterCard from "../common/CounterCard";
import * as moment from 'moment';
import AccountUploadsView from "./AccountUploadsView";


interface AccountSummaryViewProps {
}

interface StateProps {
    account: AccountDetail;
    working: boolean;
    error: boolean;
    errorMessage: string;
    portfolios: any;
}

interface DispatchProps {
    openModalDialog: (dialogId: string) => void;
}

class AccountSummaryView extends React.Component<AccountSummaryViewProps & StateProps & DispatchProps, {}> {
    calculateTotalMeters(){
        if(this.props.account.sites.length == 0){
            return 0;
        }
        var meterCountBySite =  this.props.account.sites.map(s => s.mpans.length + s.mprns.length);
        return meterCountBySite.reduce((pv, cv) => pv + cv);
    }

    renderFriendlyValue(value: string){
        if(value == null || value == ""){
            return "-";
        }
        
        return value;
    }

    renderAddress(value: string){
        var address = this.renderFriendlyValue(value);
        if(address.length >= 13){
            return <h6><strong>{address}</strong></h6>
        }
        return (<h4><strong>{address}</strong></h4>);
    }

    renderBooleanIcon(value: boolean){
        if(value){
            return (<p><i className="fa fa-check-circle fa-2x" style={{color: '#006400'}}></i></p>)
        }
        return (<p><i className="fa fa-times-circle fa-2x" style={{color: '#8B0000'}}></i></p>)
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<Spinner />);
        }

        var { account } = this.props;
        var incorporationDate = moment(account.incorporationDate).format("DD/MM/YYYY");
        var totalMeters = this.calculateTotalMeters();
        var totalPortfolios = Object.keys(this.props.portfolios).length;
        return (
            <div className="uk-margin uk-margin-right uk-margin-large-top">
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title={String(account.sites.length)} label="Total Sites" small/>
                    <CounterCard title={String(totalMeters)} label="Total Meters" small />
                    <CounterCard title={String(totalPortfolios)} label="Total Portfolios" small />
                    <CounterCard title={String(account.contacts.length)} label="Contacts" small />
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title={this.renderFriendlyValue(account.creditRating)} label="Credit Rating" small/>
                    <CounterCard title={incorporationDate} label="Incorporation Date" small />
                    <CounterCard content={this.renderAddress(account.address)} label="Address" small/>
                    <CounterCard title={this.renderFriendlyValue(account.postcode)} label="Postcode" small/>
                    <CounterCard title={this.renderFriendlyValue(account.countryOfOrigin)} label="Country" small/>
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard content={this.renderBooleanIcon(account.isVATEligible)} label="VAT Eligible" small/>
                    <CounterCard content={this.renderBooleanIcon(account.isRegisteredCharity)} label="Registered Charity" small />
                    <CounterCard content={this.renderBooleanIcon(account.hasFiTException)} label="FiT Exception" small/>
                    <CounterCard content={this.renderBooleanIcon(account.hasCCLException)} label="CCL Exception" small/>
                </div>

                    <div className="uk-margin">
                        <div className="uk-card uk-card-default">
                            <div className="uk-card-body">
                                <h4 className="uk-text-center"><i className="fa fa-file-upload uk-margin-small-right"></i>Uploads</h4>
                                <div>
                                    <AccountUploadsView accountId={this.props.account.id}/>
                                </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountSummaryViewProps> = (dispatch) => {
    return {
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountSummaryViewProps> = (state: ApplicationState) => {
    return {
        portfolios: state.hierarchy.selected_portfolios.value,
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountSummaryView);