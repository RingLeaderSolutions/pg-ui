import * as React from "react";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { retrieveAccounts, clearAccountCreation } from '../../actions/hierarchyActions';
import { ApplicationState } from '../../applicationState';
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { Account, ApplicationTab } from '../../model/Models';
import Spinner from '../common/Spinner';
import NewAccountDialog from "./creation/NewAccountDialog";
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer } from "../common/TableHelpers";
import { openModalDialog, selectApplicationTab } from "../../actions/viewActions";
import ModalDialog from "../common/ModalDialog";
import * as moment from 'moment';

interface AccountsProps extends RouteComponentProps<void> {
}

interface StateProps {
  accounts: Account[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
  retrieveAccounts: () => void;
  openModalDialog: (dialogId: string) => void;
  clearAccountCreation: () => void;
  selectApplicationTab: (tab: ApplicationTab) => void;
}

interface AccountsState {
    searchText: string;
    tableData: AccountTableEntry[];
}

interface AccountTableEntry {
    [key: string]: any;
    accountId: string;
    name: string;
    regNumber: string;
    country: string;
    status: string;
}

class Accounts extends React.Component<AccountsProps & StateProps & DispatchProps, AccountsState> {
    columns: Column[] = [{
        Header: 'Name',
        accessor: 'name',
    },{
        Header: 'Reg No.',
        accessor: 'regNumber'
    },{
        Header: 'Country',
        accessor: 'country'
    },{
        Header: 'Status',
        accessor: 'status'
    }];
    stringProperties: string[] = ["accountId", "name", "country", "regNumber", "status"];

    constructor() {
        super();
        this.state = {
            searchText: '',
            tableData: []
        };
    }

    componentDidMount() {
        this.props.selectApplicationTab(ApplicationTab.Accounts);
        this.props.retrieveAccounts();
    }

    componentWillReceiveProps(nextProps: AccountsProps & StateProps & DispatchProps){
        if(nextProps.accounts == null){
            return;
        }

        var tableData: AccountTableEntry[] = this.filterAccounts(nextProps.accounts, this.state.searchText);
        this.setState({
            ...this.state,
            tableData
        })
    }

    handleSearch(ev: any){
        var raw = String(ev.target.value);
        if(this.state.searchText === raw){
            return;
        }

        var tableData: AccountTableEntry[] = this.filterAccounts(this.props.accounts, raw);

        this.setState({
            ...this.state,
            searchText: raw,
            tableData
        });
    }

    filterAccounts(accounts: Account[], searchText: string): AccountTableEntry[] {
        var tableData : AccountTableEntry[] = this.createTableData(accounts);
        if(searchText == null || searchText == ""){
            return tableData;
        }
        
        var lowerSearchText = searchText.trim().toLocaleLowerCase();
        var filtered = tableData.filter(account => {
            var match = false;
            this.stringProperties.forEach(property => {
                var value: string = account[property] as string;
                if(value && value.toLocaleLowerCase().includes(lowerSearchText)){
                    match = true;
                }
            });
            return match;
        });

        return filtered;
    }

    createTableData(accounts: Account[]): AccountTableEntry[]{
        return accounts.map(account => {
            return {
                accountId: account.id,
                name: account.companyName,
                regNumber: account.companyRegistrationNumber,
                country: account.countryOfOrigin,
                postcode: account.postcode,
                incorporationDate: moment(account.incorporationDate).format("DD/MM/YYYY"),
                status: account.companyStatus,
                creditRating: account.creditRating,
                registeredCharity: account.isRegisteredCharity,
                cclException: account.hasCCLException,
                vatEligible: account.isVATEligible,
                fitException: account.hasFiTException
            }
        });
    }

    render() {
        var tableContent;
        
        if(this.props.error){
            tableContent = (<ErrorMessage content={this.props.errorMessage}/>);
        }
        else if(this.props.working){
            tableContent =  (<Spinner />);
        }
        else if(this.props.accounts == null || this.props.accounts.length == 0){
            tableContent = (
                <div className="uk-alert-default uk-margin-right uk-alert" data-uk-alert>
                    <div className="uk-grid uk-grid-small" data-uk-grid>
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <i className="fas fa-info-circle uk-margin-small-right"></i>
                        </div>
                        <div className="uk-width-expand uk-flex uk-flex-middle">
                            <p>No accounts have been created or loaded yet. Get started with the button above!</p>    
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.searchText != "" && this.state.tableData.length == 0){
            tableContent = (
                <div className="uk-alert-default uk-margin-right uk-alert" data-uk-alert>
                    <div className="uk-grid uk-grid-small" data-uk-grid>
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <i className="fas fa-info-circle uk-margin-small-right"></i>
                        </div>
                        <div className="uk-width-expand uk-flex uk-flex-middle">
                            <p>No results for search term: <i>{this.state.searchText}</i></p>    
                        </div>
                    </div>
                </div>)
        }
        else {
            tableContent = (
                <ReactTable 
                    showPagination={false}
                    columns={this.columns}
                    data={this.state.tableData}
                    style={{maxHeight: `${window.innerHeight - 180}px`}}
                    getTrProps={(state: any, rowInfo: any, column: any, instance: any) => ({
                        onClick: (e: any) => {
                            this.props.history.push(`/account/${rowInfo.original.accountId}`);
                        },
                        style: {
                            cursor: 'pointer'
                        } 
                      })}
                      minRows={0}/>);
        }

        return (
            <div className="content-inner">
                <Header title="Accounts" icon="fa fa-building"/>
                <div className="content-accounts">
                    <div className="table-accounts">
                        <div className="uk-grid uk-grid-collapse">
                            <div className="uk-width-expand">
                                <div className="icon-input-container uk-grid uk-grid-collapse icon-left">
                                    <div tabIndex={-1} className="uk-width-auto uk-flex uk-flex-middle">
                                        <i className="fas fa-search"></i>
                                    </div>
                                    <input className="uk-input uk-width-expand" type="search" placeholder="Search..." value={this.state.searchText} onChange={(e) => this.handleSearch(e)}/>
                                </div> 
                            </div>
                            <div className="uk-width-auto uk-margin-left uk-margin-right">
                                <button className="uk-button uk-button-primary" onClick={() => this.props.openModalDialog('new_account')}>
                                    <i className="fa fa-plus-circle uk-margin-small-right fa-lg"></i>
                                    New account
                                </button>
                            </div>
                        </div>
                        <hr />
                        <div className="container-table-accounts">
                            {tableContent}
                        </div>
                    </div>
                </div>
                <ModalDialog dialogId="new_account" onClose={() => this.props.clearAccountCreation()}>
                    <NewAccountDialog />
                </ModalDialog>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountsProps> = (dispatch) => {
  return {
    retrieveAccounts: () => dispatch(retrieveAccounts()),
    openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
    clearAccountCreation: () => dispatch(clearAccountCreation()),
    selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab))
  };
};

const mapStateToProps: MapStateToProps<StateProps, AccountsProps, ApplicationState> = (state: ApplicationState) => {
  return {
    accounts: state.hierarchy.accounts.value,
    working: state.hierarchy.accounts.working,
    error: state.hierarchy.accounts.error,
    errorMessage: state.hierarchy.accounts.errorMessage
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);