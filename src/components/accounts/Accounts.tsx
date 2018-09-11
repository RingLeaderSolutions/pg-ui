import * as React from "react";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { retrieveAccounts, clearAccountCreation } from '../../actions/hierarchyActions';
import { ApplicationState } from '../../applicationState';
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { Account, ApplicationTab } from '../../model/Models';
import Spinner from '../common/Spinner';
import NewAccountDialog from "./NewAccountDialog";
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer } from "../common/TableHelpers";
import { openModalDialog, selectApplicationTab } from "../../actions/viewActions";
import ModalDialog from "../common/ModalDialog";

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
    postcode: string;
    incorporationDate: string;
    status: string;
    creditRating: string;
    registeredCharity: boolean;
    cclException: boolean;
    vatEligible: boolean;
    fitException: boolean;
}

class Accounts extends React.Component<AccountsProps & StateProps & DispatchProps, AccountsState> {
    columns: Column[] = [{
        Header: 'Name',
        accessor: 'name'
    },{
        Header: 'Reg No.',
        accessor: 'regNumber'
    },{
        Header: 'Country',
        accessor: 'country'
    },{
        Header: 'Postcode',
        accessor: "postcode",
    },{
        Header: 'Incorporation Date',
        accessor: 'incorporationDate'
    },{
        Header: 'Status',
        accessor: 'status'
    },{
        Header: 'Credit Rating',
        accessor: 'creditRating'
    },{
        Header: 'Reg Charity',
        accessor: 'registeredCharity',
        Cell: BooleanCellRenderer
    },{
        Header: 'CCL Exception',
        accessor: 'cclException',
        Cell: BooleanCellRenderer
    },{
        Header: 'VAT Eligible',
        accessor: 'vatEligible',
        Cell: BooleanCellRenderer
    },{
        Header: 'FIT Exception',
        accessor: 'fitException',
        Cell: BooleanCellRenderer
    }];
    stringProperties: string[] = ["accountId", "name", "country", "postcode", "incorporationDate", "status", "creditRating"];

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
                incorporationDate: account.incorporationDate,
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
            tableContent =  (<p className="table-warning">There are no accounts. Create one using the button above!</p>)
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
                      minRows={0}/>
            )
        }

        return (
            <div className="content-inner">
                <Header title="Accounts" />
                <div className="content-accounts">
                    <div className="table-accounts">
                        <div className="search-accounts">
                            <form className="uk-search uk-search-default">
                                <span data-uk-search-icon="search"></span>
                                <input className="uk-search-input" type="search" placeholder="Search..." value={this.state.searchText} onChange={(e) => this.handleSearch(e)}/>
                            </form>
                            <div className="actions-accounts">
                                <button className="uk-button uk-button-primary" onClick={() => this.props.openModalDialog('new_account')}>
                                    <i className="fa fa-plus-circle uk-margin-small-right fa-lg"></i>
                                    New account
                                </button>
                            </div>
                        </div>
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

const mapStateToProps: MapStateToProps<StateProps, AccountsProps> = (state: ApplicationState) => {
  return {
    accounts: state.hierarchy.accounts.value,
    working: state.hierarchy.accounts.working,
    error: state.hierarchy.accounts.error,
    errorMessage: state.hierarchy.accounts.errorMessage
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);