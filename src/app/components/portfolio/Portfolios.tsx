import * as React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getAllPortfolios } from '../../actions/portfolioActions';
import { ApplicationState } from '../../applicationState';
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { Portfolio, User, ApplicationTab } from '../../model/Models';
import Spinner from '../common/Spinner';
import CreatePortfolioFromAccountDialog from "./creation/CreatePortfolioFromAccountDialog";
import ReactTable, { Column } from "react-table";
import { UserCellRenderer, UserSorter } from "../common/TableHelpers";
import { openModalDialog, selectApplicationTab } from "../../actions/viewActions";
import ModalDialog from "../common/ModalDialog";

interface PortfoliosProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolios: Portfolio[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
  getPortfolios: () => void;
  openModalDialog: (dialogId: string) => void;
  selectApplicationTab: (tab: ApplicationTab) => void;
}

interface PortfoliosState {
    searchText: string;
    tableData: PortfolioTableEntry[];
}

interface PortfolioTableEntry {
    [key: string]: any;
    portfolioId: string;
    name: string;
    status: string;
    tenderAnalyst: User;
    accountMgr: User;
    siteCount: number;
    meterCount: number;
}

class Portfolios extends React.Component<PortfoliosProps & StateProps & DispatchProps, PortfoliosState> {
    columns: Column[] = [{
        Header: 'Name',
        accessor: 'name'
    },{
        Header: 'Status',
        accessor: 'status'
    },{
        id: 'accountMgr',
        Header: 'Account Manager',
        accessor: 'accountMgr',
        Cell: UserCellRenderer,
        sortMethod: UserSorter
    },{
        id: 'tenderAnalyst',
        Header: 'Tender Analyst',
        accessor: "tenderAnalyst",
        Cell: UserCellRenderer,
        sortMethod: UserSorter
    },{
        Header: 'Sites',
        accessor: 'siteCount'
    },{
        Header: 'Meters',
        accessor: 'meterCount'
    }];
    stringProperties: string[] = ["portfolioId", "name", "status"];
    numberProperties: string[] = ["siteCount", "meterCount"];

    constructor() {
        super();
        this.state = {
            searchText: '',
            tableData: []
        };
    }

    componentDidMount() {
        this.props.selectApplicationTab(ApplicationTab.Portfolios)
        this.props.getPortfolios();
    }

    componentWillReceiveProps(nextProps: PortfoliosProps & StateProps & DispatchProps){
        if(nextProps.portfolios == null){
            return;
        }

        var tableData: PortfolioTableEntry[] = this.filterPortfolios(nextProps.portfolios, this.state.searchText);
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

        var tableData: PortfolioTableEntry[] = this.filterPortfolios(this.props.portfolios, raw);

        this.setState({
            ...this.state,
            searchText: raw,
            tableData
        });
    }

    filterPortfolios(portfolios: Portfolio[], searchText: string): PortfolioTableEntry[] {
        var tableData : PortfolioTableEntry[] = this.createTableData(portfolios);
        if(searchText == null || searchText == ""){
            return tableData;
        }
        
        var lowerSearchText = searchText.trim().toLocaleLowerCase();
        var filtered = tableData.filter(portfolio => {
            var match = false;
            this.stringProperties.forEach(property => {
                var value: string = portfolio[property] as string;
                if(value && value.toLocaleLowerCase().includes(lowerSearchText)){
                    match = true;
                }
            });

            this.numberProperties.forEach(property => {
                var value: string = String(portfolio[property] as number);
                if(value && value.includes(lowerSearchText)){
                    match = true;
                }
            })

            if(!match){
                var tenderAnalyst = portfolio.tenderAnalyst ?  `${portfolio.tenderAnalyst.firstName} ${portfolio.tenderAnalyst.lastName}`.toLocaleLowerCase() : '';
                var accountMgr = portfolio.accountMgr ? `${portfolio.accountMgr.firstName} ${portfolio.accountMgr.lastName}`.toLocaleLowerCase() : '';

                if(tenderAnalyst.includes(lowerSearchText) || accountMgr.includes(lowerSearchText)){
                    match = true;
                }    
            }
            return match;
        });

        return filtered;
    }

    toFriendlyPortfolioStatus(value: string){
        switch(value){
            case "onboard":
                return "Onboarding";
            case "tender":
                return "Tender"
            default:
                return value;
        }
    }

    createTableData(portfolios: Portfolio[]): PortfolioTableEntry[]{
        return portfolios
            .filter(p => p.id != null)
            .map(portfolio => {
                return {
                    portfolioId: portfolio.id,
                    name: portfolio.title,
                    status: this.toFriendlyPortfolioStatus(portfolio.status),
                    accountMgr: portfolio.salesLead,
                    tenderAnalyst: portfolio.supportExec,
                    siteCount: portfolio.sites,
                    meterCount: portfolio.mpans
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
        else if(this.props.portfolios == null || this.props.portfolios.length == 0){
            tableContent = (
                <div className="uk-alert-default uk-margin-right uk-alert" data-uk-alert>
                    <div className="uk-grid uk-grid-small" data-uk-grid>
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <i className="fas fa-info-circle uk-margin-small-right"></i>
                        </div>
                        <div className="uk-width-expand uk-flex uk-flex-middle">
                            <p>It's looking rather empty in here... Create a portfolio using the button above!</p>    
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
                            this.props.history.push(`/portfolio/${rowInfo.original.portfolioId}`);
                        },
                        style: {
                            cursor: 'pointer'
                        } 
                        })}
                        minRows={0}/>);
        }
         

        return (
            <div className="content-inner">
                <Header title="Portfolios" icon="fas fa-layer-group"/>
                <div className="content-portfolios">
                    <div className="table-portfolios">
                        <div className="search-portfolios">
                            <form className="uk-search uk-search-default">
                                <span data-uk-search-icon="search"></span>
                                <input className="uk-search-input" type="search" placeholder="Search..." value={this.state.searchText} onChange={(e) => this.handleSearch(e)}/>
                            </form>
                            <div className="actions-portfolios">
                                <button className="uk-button uk-button-primary" onClick={() => this.props.openModalDialog('create_portfolio')}>
                                    <i className="fa fa-plus-circle uk-margin-small-right fa-lg"></i>
                                    New portfolio
                                </button>
                            </div>
                        </div>
                        <div className="container-table-portfolios">
                            {tableContent}
                        </div>
                    </div>
                </div>

                <ModalDialog dialogId="create_portfolio">
                    <CreatePortfolioFromAccountDialog />
                </ModalDialog>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfoliosProps> = (dispatch) => {
  return {
    getPortfolios: () => dispatch(getAllPortfolios()),
    openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
    selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab))
  };
};

const mapStateToProps: MapStateToProps<StateProps, PortfoliosProps> = (state: ApplicationState) => {
  return {
    portfolios: state.portfolios.all.value,
    working: state.portfolios.all.working,
    error: state.portfolios.all.error,
    errorMessage: state.portfolios.all.errorMessage
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolios));