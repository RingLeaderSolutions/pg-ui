import * as React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getAllPortfolios } from '../../actions/portfolioActions';
import { ApplicationState } from '../../applicationState';
import ErrorMessage from "../common/ErrorMessage";
import { Portfolio, User, ApplicationTab } from '../../model/Models';
import CreatePortfolioDialog from "./creation/CreatePortfolioDialog";
import ReactTable, { Column } from "react-table";
import { UserCellRenderer, UserSorter, ReactTablePagination, NoMatchesComponent, SortFirstColumn } from "../common/TableHelpers";
import { selectApplicationTab, openDialog } from "../../actions/viewActions";
import { PageHeader } from "../common/PageHeader";
import { Button, CardBody, InputGroup, InputGroupAddon, InputGroupText, Input, Alert } from "reactstrap";
import Card from "reactstrap/lib/Card";
import { LoadingIndicator } from "../common/LoadingIndicator";
import { ModalDialogNames } from "../common/modal/ModalDialogNames";
import { IsNullOrEmpty } from "../../helpers/extensions/ArrayExtensions";

interface PortfoliosProps extends RouteComponentProps<void> { }

interface StateProps {
  portfolios: Portfolio[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    getPortfolios: () => void;
    openCreatePortfolioDialog: () => void;
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
        accessor: 'status',
        className: 'text-capitalize'
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

    constructor(props: PortfoliosProps & StateProps & DispatchProps) {
        super(props);
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

    createTableData(portfolios: Portfolio[]): PortfolioTableEntry[]{
        return portfolios
            .filter(p => p.id != null)
            .map(portfolio => {
                return {
                    portfolioId: portfolio.id,
                    name: portfolio.title,
                    status: portfolio.status,
                    accountMgr: portfolio.salesLead,
                    tenderAnalyst: portfolio.supportExec,
                    siteCount: portfolio.sites,
                    meterCount: portfolio.mpans
                }
            });
    }

    render() {
        let tableContent;
        
        if(this.props.error){
            tableContent = (<ErrorMessage content={this.props.errorMessage}/>);
        }
        else if(this.props.working){
            tableContent =  <LoadingIndicator />;
        }
        else if(IsNullOrEmpty(this.props.portfolios)){
            tableContent = (
                <Alert color="light" className="mt-2">
                    <div className="d-flex align-items-center flex-column">
                        <i className="fas fa-info-circle mr-2"></i>
                        <p className="m-0 pt-2">It's looking rather empty in here...</p>
                        <p className="m-0 pt-1">Create a portfolio using the button above!</p>
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
                            this.props.history.push(`/portfolio/${rowInfo.original.portfolioId}`);
                        },
                        style: {
                            cursor: 'pointer'
                        } 
                        })}
                    />);
        }

        return (
            <div className="w-100 px-4">
                <PageHeader title="All" subtitle="Portfolios" icon="fas fa-layer-group"/>
                <Card>
                    <CardBody className="p-0">
                        <div className="d-flex p-2 justify-content-between">
                            <div className="d-flex">
                                <Button color="accent"
                                            onClick={() => this.props.openCreatePortfolioDialog()}>
                                    <i className="fas fa-plus-circle mr-2"></i>New Portfolio
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
                <CreatePortfolioDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfoliosProps> = (dispatch) => {
    return {
        getPortfolios: () => dispatch(getAllPortfolios()),
        openCreatePortfolioDialog: () => dispatch(openDialog(ModalDialogNames.CreatePortfolio)),
        selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab))
    };
};

const mapStateToProps: MapStateToProps<StateProps, PortfoliosProps, ApplicationState> = (state: ApplicationState) => {
    return {
        portfolios: state.portfolios.all.value,
        working: state.portfolios.all.working,
        error: state.portfolios.all.error,
        errorMessage: state.portfolios.all.errorMessage
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolios));