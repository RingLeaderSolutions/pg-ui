import * as React from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { retrieveAccounts } from '../../actions/hierarchyActions';
import { ApplicationState } from '../../applicationState';
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { Account } from '../../model/Models';
import Spinner from '../common/Spinner';
import NewAccountDialog from "./NewAccountDialog";
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer } from "../common/TableHelpers";

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
            tableContent = (<tr><td colSpan={9}><ErrorMessage content={this.props.errorMessage}/></td></tr>);
        }
        else if(this.props.working){
            tableContent =  (<tr><td colSpan={9}><Spinner /></td></tr>);
        }
        else if(this.props.accounts == null || this.props.accounts.length == 0){
            tableContent =  (<tr><td colSpan={9}><p className="table-warning">There are no accounts. Create one using the button above!</p></td></tr>)
        }
        else {
            tableContent = (
                <ReactTable 
                    showPagination={false}
                    columns={this.columns}
                    data={this.state.tableData}
                    getTrProps={(state: any, rowInfo: any, column: any, instance: any) => ({
                        onClick: (e: any) => {
                            this.props.history.push(`/account/${rowInfo.original.accountId}`);
                        },
                        style: {
                            cursor: 'pointer'
                        } 
                      })}/>
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
                                <button className="uk-button uk-button-primary" data-uk-toggle="target: #modal-new-account">
                                    <span className="uk-margin-small-right" data-uk-icon="plus-circle"></span>
                                    New account
                                </button>
                            </div>
                        </div>
                        <div className="container-table-accounts">
                            {tableContent}
                        </div>
                    </div>
                </div>
                <div id="modal-new-account" data-uk-modal="center: true">
                    <NewAccountDialog />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountsProps> = (dispatch) => {
  return {
    retrieveAccounts: () => dispatch(retrieveAccounts()),
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