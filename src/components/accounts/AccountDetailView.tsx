import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail, SiteDetail, HierarchyMpan, HierarchyMprn, UtilityType } from '../../model/Models';
import Spinner from '../common/Spinner';


import { retrieveAccountDetail, fetchAccountPortfolios } from '../../actions/hierarchyActions';
import UploadSupplyDataDialog from "../portfolio/mpan/UploadSupplyDataDialog";
import UpdateAccountDialog from "./UpdateAccountDialog";
import AccountContactsView from "./AccountContactsView";
import AccountDocumentsView from "./AccountDocumentsView";
import AccountUploadsView from "./AccountUploadsView";
import { Link } from "react-router-dom";
import AccountGasMeterTable from "./AccountGasMeterTable";
import AccountElectricityMeterTable from "./AccountElectricityMeterTable";

interface AccountDetailViewProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolios: any;
  account: AccountDetail;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    retrieveAccountDetail: (accountId: string) => void;
    fetchAccountPortfolios: (accountId: string) => void;
}

class AccountDetailView extends React.Component<AccountDetailViewProps & StateProps & DispatchProps, {}> {

    componentDidMount(){
        var accountId = this.props.location.pathname.split('/')[2];        
        this.props.retrieveAccountDetail(accountId);
        this.props.fetchAccountPortfolios(accountId);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<Spinner />);
        }
        var selectedAccount = this.props.account;
        var headerTitle = `Account: ${selectedAccount.companyName}`;
        return (
            <div className="content-inner">
                <Header title={headerTitle} />
                <div className="uk-text-right">
                    <button className="uk-button uk-button-small uk-button-default uk-margin-small-right uk-margin-small-top" data-uk-toggle="target: #modal-update-account">
                        <span className="uk-margin-small-right" data-uk-icon="icon: pencil"></span>
                        Edit account
                    </button>
                </div>
                <ul data-uk-tab>
                    <li className="uk-active"><a href="#">Electricity</a></li>
                    <li><a href="#">Gas</a></li>
                    <li><a href="#">Contacts</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Uploads</a></li>
                </ul>
                <ul className="uk-switcher restrict-height-hack">
                    <li><AccountElectricityMeterTable sites={this.props.account.sites} portfolios={this.props.portfolios} /></li>
                    <li><AccountGasMeterTable sites={this.props.account.sites} portfolios={this.props.portfolios} /></li>
                    <li><AccountContactsView /></li>
                    <li><AccountDocumentsView account={this.props.account}/></li>
                    <li><AccountUploadsView accountId={this.props.account.id}/></li>
                </ul>

                <div id="modal-upload-supply-data-elec" data-uk-modal="center: true">
                    <UploadSupplyDataDialog accountId={this.props.account.id} type={UtilityType.Electricity} />
                </div>

                <div id="modal-upload-supply-data-gas" data-uk-modal="center: true">
                    <UploadSupplyDataDialog accountId={this.props.account.id} type={UtilityType.Gas} />
                </div>

                <div id="modal-update-account" data-uk-modal="center: true">
                    <UpdateAccountDialog account={selectedAccount} />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDetailViewProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),
        fetchAccountPortfolios: (accountId: string) => dispatch(fetchAccountPortfolios(accountId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDetailViewProps> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        portfolios: state.hierarchy.selected_portfolios.value,
        working: state.hierarchy.selected.working || state.hierarchy.selected_portfolios.working,
        error: state.hierarchy.selected.error || state.hierarchy.selected_portfolios.error,
        errorMessage: state.hierarchy.selected.errorMessage || state.hierarchy.selected_portfolios.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailView);