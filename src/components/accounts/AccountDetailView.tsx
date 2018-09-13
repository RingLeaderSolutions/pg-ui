import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail, UtilityType, ApplicationTab } from '../../model/Models';
import Spinner from '../common/Spinner';
import { selectAccountTab, openModalDialog, selectApplicationTab } from "../../actions/viewActions";

import { retrieveAccountDetail, fetchAccountPortfolios } from '../../actions/hierarchyActions';
import UploadSupplyDataDialog from "../portfolio/mpan/UploadSupplyDataDialog";
import UpdateAccountDialog from "./UpdateAccountDialog";
import AccountContactsView from "./AccountContactsView";
import AccountDocumentsView from "./AccountDocumentsView";
import AccountUploadsView from "./AccountUploadsView";
import AccountGasMeterTable from "./AccountGasMeterTable";
import AccountElectricityMeterTable from "./AccountElectricityMeterTable";
import ModalDialog from "../common/ModalDialog";
import AccountContractsView from "./AccountContractsView";
import AccountSummaryView from "./AccountSummaryView";

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
    openModalDialog: (dialogId: string) => void;
    selectApplicationTab: (tab: ApplicationTab) => void;
}

class AccountDetailView extends React.Component<AccountDetailViewProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.selectApplicationTab(ApplicationTab.Accounts);
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
                return (<AccountSummaryView />)
            case 1:
                return (<AccountElectricityMeterTable sites={this.props.account.sites} portfolios={this.props.portfolios} />);
            case 2:
                return (<AccountGasMeterTable sites={this.props.account.sites} portfolios={this.props.portfolios} />);
            case 3:
                return (<AccountContractsView />)
            case 4:
                return (<AccountDocumentsView account={this.props.account}/>);
            case 5:
                return (<AccountContactsView />);
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
                <Header title={headerTitle} icon="fa fa-building">
                    <button className='uk-button uk-button-default uk-button-small uk-margin-large-right borderless-button' data-uk-tooltip="title: Edit account" onClick={() => this.props.openModalDialog('update-account')}><i className="fas fa-edit"></i></button>
                </Header>
                <ul className="uk-tab">
                    <li className={this.renderActiveTabStyle(0)} onClick={() => this.selectTab(0)}><a href="#"><i className="fa fa-list uk-margin-small-right fa-lg"></i>Summary</a></li>
                    <li className={this.renderActiveTabStyle(1)} onClick={() => this.selectTab(1)}><a href="#"><i className="fa fa-bolt uk-margin-small-right fa-lg"></i>Electricity</a></li>
                    <li className={this.renderActiveTabStyle(2)} onClick={() => this.selectTab(2)}><a href="#"><i className="fa fa-fire uk-margin-small-right fa-lg"></i>Gas</a></li>
                    <li className={this.renderActiveTabStyle(3)} onClick={() => this.selectTab(3)}><a href="#"><i className="fa fa-file-signature uk-margin-small-right fa-lg"></i>Contracts</a></li>
                    <li className={this.renderActiveTabStyle(4)} onClick={() => this.selectTab(4)}><a href="#"><i className="fa fa-file uk-margin-small-right fa-lg"></i>Documentation</a></li>
                    <li className={this.renderActiveTabStyle(5)} onClick={() => this.selectTab(5)}><a href="#"><i className="fa fa-users uk-margin-small-right fa-lg"></i>Contacts</a></li>
                </ul>
                <div>
                    {this.renderSelectedTab()}
                </div>

                <ModalDialog dialogId="upload-supply-data-electricity">
                    <UploadSupplyDataDialog accountId={this.props.account.id} type={UtilityType.Electricity} />
                </ModalDialog>

                <ModalDialog dialogId="upload-supply-data-gas">
                    <UploadSupplyDataDialog accountId={this.props.account.id} type={UtilityType.Gas} />
                </ModalDialog>

                <ModalDialog dialogId="update-account">
                    <UpdateAccountDialog account={selectedAccount} />
                </ModalDialog>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDetailViewProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),
        fetchAccountPortfolios: (accountId: string) => dispatch(fetchAccountPortfolios(accountId)),
        selectAccountTab: (index: number) => dispatch(selectAccountTab(index)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
        selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab))
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