import * as React from "react";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail, ApplicationTab } from '../../model/Models';
import { selectAccountTab, selectApplicationTab, openDialog } from "../../actions/viewActions";

import { retrieveAccountDetail, fetchAccountPortfolios } from '../../actions/hierarchyActions';
import AccountContactsView from "./contacts/AccountContactsView";
import AccountDocumentsView from "./documents/AccountDocumentsView";
import AccountContractsView from "./contracts/AccountContractsView";
import AccountSummaryView from "./AccountSummaryView";
import * as cn from "classnames";
import { Nav, NavItem, NavLink, Button, UncontrolledTooltip, Navbar } from "reactstrap";
import { PageHeader } from "../common/PageHeader";
import AccountMeters from "./meters/AccountMeters";
import { LoadingIndicator } from "../common/LoadingIndicator";
import UpdateAccountDialog, { UpdateAccountDialogData } from "./creation/UpdateAccountDialog";
import { ModalDialogNames } from "../common/modal/ModalDialogNames";

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
    selectApplicationTab: (tab: ApplicationTab) => void;

    openUpdateAccountDialog: (data: UpdateAccountDialogData) => void;
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

    renderSelectedTab(){
        switch(this.props.selectedTab){
            case 0:
                return (<AccountSummaryView />)
            case 1:
                return (<AccountMeters sites={this.props.account.sites} portfolios={this.props.portfolios} accountId={this.props.account.id} />);
            case 2:
                return (<AccountContractsView />)
            case 3:
                return (<AccountDocumentsView account={this.props.account}/>);
            case 4:
                return (<AccountContactsView />);
            default:
                return (<p>No tab selected</p>);
        }
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<LoadingIndicator />);
        }

        var selectedAccount = this.props.account;

        return (
            <div className="w-100">
                <PageHeader title={selectedAccount.companyName} subtitle="account" icon="fas fa-building" className="px-4">
                    <Button color="accent" outline className="ml-auto btn-grey-outline" id="edit-account-button"
                            onClick={() => this.props.openUpdateAccountDialog({ account: selectedAccount })}>
                        <i className="material-icons">
                            mode_edit
                        </i>
                    </Button>
                    <UncontrolledTooltip target="edit-account-button" placement="bottom">
                        <strong>Edit Account</strong>
                    </UncontrolledTooltip>
                </PageHeader>
                <Navbar className="p-0 bg-white border-top">
                    <Nav tabs className="justify-content-center flex-grow-1">
                        <NavItem>
                            <NavLink className={cn({ active: this.props.selectedTab == 0})}
                                        onClick={() => this.selectTab(0)}
                                        href="#">
                                <i className="fa fa-list"></i>Summary
                            </NavLink>
                        </NavItem>
                        <NavItem className="ml-md-3 ml-sm-1">
                            <NavLink className={cn({ active: this.props.selectedTab == 1})}
                                        onClick={() => this.selectTab(1)}
                                        href="#">
                                <i className="fas fa-tachometer-alt"></i>Meters
                            </NavLink>
                        </NavItem>
                        <NavItem className="ml-md-3 ml-sm-1">
                            <NavLink className={cn({ active: this.props.selectedTab == 2})}
                                        onClick={() => this.selectTab(2)}
                                        href="#">
                                <i className="fas fa-file-signature"></i>Contracts
                            </NavLink>
                        </NavItem>
                        <NavItem className="ml-md-3 ml-sm-1">
                            <NavLink className={cn({ active: this.props.selectedTab == 3})}
                                        onClick={() => this.selectTab(3)}
                                        href="#">
                                <i className="fas fa-file"></i>Documentation
                            </NavLink>
                        </NavItem>
                        <NavItem className="ml-md-3 ml-sm-1">
                            <NavLink className={cn({ active: this.props.selectedTab == 4})}
                                        onClick={() => this.selectTab(4)}
                                        href="#">
                                <i className="fas fa-users"></i>Contacts
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <div>
                    {this.renderSelectedTab()}
                </div>
                <UpdateAccountDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDetailViewProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),
        fetchAccountPortfolios: (accountId: string) => dispatch(fetchAccountPortfolios(accountId)),

        selectAccountTab: (index: number) => dispatch(selectAccountTab(index)),
        selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab)),

        openUpdateAccountDialog: (data: UpdateAccountDialogData) => dispatch(openDialog(ModalDialogNames.UpdateAccount, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDetailViewProps, ApplicationState> = (state: ApplicationState) => {
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