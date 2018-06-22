import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail, UtilityType } from '../../model/Models';
import Spinner from '../common/Spinner';
import { selectAccountTab } from "../../actions/viewActions";

import { retrieveAccountDetail, fetchAccountPortfolios } from '../../actions/hierarchyActions';
import UploadSupplyDataDialog from "../portfolio/mpan/UploadSupplyDataDialog";
import UpdateAccountDialog from "./UpdateAccountDialog";
import AccountContactsView from "./AccountContactsView";
import AccountDocumentsView from "./AccountDocumentsView";
import AccountUploadsView from "./AccountUploadsView";
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
  selectedTab: number;
}

interface DispatchProps {
    retrieveAccountDetail: (accountId: string) => void;
    fetchAccountPortfolios: (accountId: string) => void;
    selectAccountTab: (index: number) => void;
}

class AccountDetailView extends React.Component<AccountDetailViewProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        var accountId = this.props.location.pathname.split('/')[2];        
        this.props.retrieveAccountDetail(accountId);
        this.props.fetchAccountPortfolios(accountId);
    }

    selectTab(index: number){
        this.props.selectAccountTab(index);
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    renderSelectedTab(){
        switch(this.props.selectedTab){
            case 0:
                return (<AccountElectricityMeterTable sites={this.props.account.sites} portfolios={this.props.portfolios} />);
            case 1:
                return (<AccountGasMeterTable sites={this.props.account.sites} portfolios={this.props.portfolios} />);
            case 2:
                return (<AccountContactsView />);
            case 3:
                return (<AccountDocumentsView account={this.props.account}/>);
            case 4:
                return (<AccountUploadsView accountId={this.props.account.id}/>);
        }
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
                <ul className="uk-tab">
                    <li className={this.renderActiveTabStyle(0)} onClick={() => this.selectTab(0)}><a href="#">Electricity</a></li>
                    <li className={this.renderActiveTabStyle(1)} onClick={() => this.selectTab(1)}><a href="#">Gas</a></li>
                    <li className={this.renderActiveTabStyle(2)} onClick={() => this.selectTab(2)}><a href="#">Contacts</a></li>
                    <li className={this.renderActiveTabStyle(3)} onClick={() => this.selectTab(3)}><a href="#">Documentation</a></li>
                    <li className={this.renderActiveTabStyle(4)} onClick={() => this.selectTab(4)}><a href="#">Uploads</a></li>
                </ul>
                <div className="restrict-height-hack">
                    {this.renderSelectedTab()}
                </div>

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
        fetchAccountPortfolios: (accountId: string) => dispatch(fetchAccountPortfolios(accountId)),
        selectAccountTab: (index: number) => dispatch(selectAccountTab(index))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDetailViewProps> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        portfolios: state.hierarchy.selected_portfolios.value,
        working: state.hierarchy.selected.working || state.hierarchy.selected_portfolios.working,
        error: state.hierarchy.selected.error || state.hierarchy.selected_portfolios.error,
        errorMessage: state.hierarchy.selected.errorMessage || state.hierarchy.selected_portfolios.errorMessage,
        selectedTab: state.view.account.selectedIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailView);