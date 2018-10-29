import * as React from "react";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { retrieveAccounts, clearAccountCreation } from '../../actions/hierarchyActions';
import { ApplicationState } from '../../applicationState';
import ErrorMessage from "../common/ErrorMessage";
import { Account, ApplicationTab } from '../../model/Models';
import Spinner from '../common/Spinner';
import NewAccountDialog from "./creation/NewAccountDialog";
import ReactTable, { Column } from "react-table";
import { ReactTablePagination, NoMatchesComponent, SortFirstColumn } from "../common/TableHelpers";
import { selectApplicationTab, openDialog } from "../../actions/viewActions";
import * as moment from 'moment';
import { CardBody, Card, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Alert } from "reactstrap";
import { PageHeader } from "../common/PageHeader";
import { ModalDialogNames } from "../common/modal/ModalDialogNames";

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
  clearAccountCreation: () => void;
  selectApplicationTab: (tab: ApplicationTab) => void;

  openCreateAccountDialog: () => void;
}

interface AccountsState {
    searchText: string;
    tableData: AccountTableEntry[];
}

interface AccountTableEntry {
    [key: string]: any;
    accountId: string;
    name: string;
    address: string;
    postcode: string;
    status: string;
}

class Accounts extends React.Component<AccountsProps & StateProps & DispatchProps, AccountsState> {
    columns: Column[] = [{
        Header: 'Name',
        accessor: 'name',
    },{
        Header: 'Address',
        accessor: 'address'
    },{
        Header: 'Postcode',
        accessor: 'postcode'
    },{
        Header: 'Status',
        accessor: 'status'
    }];
    stringProperties: string[] = ["accountId", "name", "postcode", "address", "status"];

    constructor(props: AccountsProps & StateProps & DispatchProps) {
        super(props);
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
                address: account.address,
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
                <Alert color="light">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        No accounts have been created or loaded yet. Get started with the button above!
                    </div>
                </Alert>);
        }
        else {
            tableContent = (
                <ReactTable 
                    className="enable-hover"
                    NoDataComponent={NoMatchesComponent}
                    PaginationComponent={ReactTablePagination}
                    showPagination={true}
                    columns={this.columns}
                    data={this.state.tableData}
                    defaultSorted={SortFirstColumn(this.columns)}
                    minRows={0}
                    getTrProps={(state: any, rowInfo: any) => ({
                        onClick: () => {
                            this.props.history.push(`/account/${rowInfo.original.accountId}`);
                        },
                        style: {
                            cursor: 'pointer'
                        } 
                      })}
                    />);
        }

        return (
            <div className="w-100 px-4">
                <PageHeader title="All" subtitle="Accounts" icon="fas fa-building"/>
                <Card className="mb-4">
                    <CardBody className="p-0">
                        <div className="d-flex p-2 justify-content-between">
                            <div className="d-flex">
                                <Button color="accent"
                                            onClick={() => this.props.openCreateAccountDialog()} >
                                            <i className="fas fa-plus-circle mr-2"></i>New Account
                                    </Button>
                            </div>
                            <div className="d-flex">
                                <InputGroup className="input-group-seamless">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fas fa-search"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="Search..."
                                        value={this.state.searchText} onChange={(e) => this.handleSearch(e)} />
                                </InputGroup>
                            </div>
                        </div>
                        {tableContent}
                    </CardBody>
                </Card>
                <NewAccountDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountsProps> = (dispatch) => {
  return {
    retrieveAccounts: () => dispatch(retrieveAccounts()),
    clearAccountCreation: () => dispatch(clearAccountCreation()),
    selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab)),
    openCreateAccountDialog: () => dispatch(openDialog(ModalDialogNames.CreateAccount))
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