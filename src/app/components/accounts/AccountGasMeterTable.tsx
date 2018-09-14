import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { SiteDetail } from '../../model/HierarchyObjects';
import { Link } from "react-router-dom";
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer } from "../common/TableHelpers";
import { openModalDialog } from "../../actions/viewActions";
import { fetchTariffs } from "../../actions/portfolioActions";
import { Tariff } from "../../model/Tender";
import ErrorMessage from "../common/ErrorMessage";
import Spinner from "../common/Spinner";

interface AccountGasMeterTableProps {
    sites: SiteDetail[];
    portfolios: any;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    tariffs: Tariff[];
}

interface DispatchProps {
    openModalDialog: (dialogId: string) => void;
    fetchTariffs: () => void;
}

interface AccountGasMeterTableState {
    searchText: string;
    tableData: AccountGasMeterTableEntry[];
}

interface AccountGasMeterTableEntry {
    [key: string]: any;
    site: string;
    meter: string;
    serialNumber: string;
    make: string;
    model: string;
    size: number;
    aq: number;
    changeOfUse: boolean;
    isImperial: boolean;
}

class AccountGasMeterTable extends React.Component<AccountGasMeterTableProps & StateProps & DispatchProps, AccountGasMeterTableState> {
    columns: Column[] = [{
        Header: 'Site',
        accessor: 'site'
    },{
        Header: 'Meter',
        accessor: 'meter'
    },{
        Header: 'Tariff',
        accessor: 'tariff'
    },{
        Header: 'Serial Number',
        accessor: 'serialNumber'
    },{
        Header: 'Make',
        accessor: "make",
    },{
        Header: 'Model',
        accessor: 'model'
    },{
        Header: 'Size',
        accessor: 'size'
    },{
        Header: 'AQ',
        accessor: 'aq'
    },{
        Header: 'Change of Use',
        accessor: 'changeOfUse',
        Cell: BooleanCellRenderer
    },{
        Header: 'Is Imperial',
        accessor: 'isImperial',
        Cell: BooleanCellRenderer
    }];
    stringProperties: string[] = ["siteId", "site", "meter", "serialNumber", "tariff", "make", "model"];
    numberProperties: string[] = ["size", "aq"];
    
    constructor() {
        super();
        this.state = {
            searchText: '',
            tableData: []
        };
    }

    componentDidMount(){
        this.props.fetchTariffs();
    }

    componentWillReceiveProps(nextProps: AccountGasMeterTableProps & StateProps & DispatchProps){
        if(nextProps.sites == null || nextProps.tariffs == null){
            return;
        }

        var tableData: AccountGasMeterTableEntry[] = this.filterGasMeters(nextProps.sites, nextProps.tariffs, this.state.searchText);
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

        var tableData: AccountGasMeterTableEntry[] = this.filterGasMeters(this.props.sites, this.props.tariffs, raw);

        this.setState({
            ...this.state,
            searchText: raw,
            tableData
        });
    }

    filterGasMeters(sites: SiteDetail[], tariffs: Tariff[], searchText: string): AccountGasMeterTableEntry[] {
        var tableData : AccountGasMeterTableEntry[] = this.createTableData(sites, tariffs);
        if(searchText == null || searchText == ""){
            return tableData;
        }
        
        var lowerSearchText = searchText.trim().toLocaleLowerCase();
        var filtered = tableData.filter(gasMeter => {
            var match = false;
            this.stringProperties.forEach(property => {
                var value: string = gasMeter[property] as string;
                if(value && value.toLocaleLowerCase().includes(lowerSearchText)){
                    match = true;
                }
            });

            this.numberProperties.forEach(property => {
                var value: string = String(gasMeter[property] as number);
                if(value && value.includes(lowerSearchText)){
                    match = true;
                }
            })
            return match;
        });

        return filtered;
    }

    createTableData(sites: SiteDetail[], tariffs: Tariff[]): AccountGasMeterTableEntry[]{
        var metersBySites = sites
            .sort(
                (site1: SiteDetail, site2: SiteDetail) => {
                    let lowerFirst = site1.siteCode.toLowerCase();
                    let lowerSecond = site2.siteCode.toLowerCase();
            
                    if (lowerFirst < lowerSecond) return -1;
                    if (lowerFirst > lowerSecond) return 1;
                    return 0;
                })
            .map(site => {
                    var siteId = site.id;
                    var siteCode = site.siteCode;
                    return site.mprns.map(gasMeter => {
                        var tariff = tariffs.find(t => t.id == gasMeter.tariffId);
                        return {
                            siteId,
                            site: siteCode,
                            meter: gasMeter.mprnCore,
                            tariff: tariff == null ? "Unknown" : tariff.name,
                            serialNumber: gasMeter.serialNumber,
                            make: gasMeter.make,
                            model: gasMeter.model,
                            size: gasMeter.size,
                            aq: gasMeter.aq,
                            changeOfUse: gasMeter.changeOfUse,
                            isImperial: gasMeter.isImperial
                        }
                    })
                });
        return [].concat.apply([], metersBySites);
    }

    renderPortfolioButtons(){
        return Object.keys(this.props.portfolios).map(p => {
            var portfolioId = this.props.portfolios[p];
            var portfolioLink = `/portfolio/${portfolioId}`;
            return (<Link to={portfolioLink} key={portfolioId}><button className='uk-button uk-button-default uk-button-small uk-margin-small-right' data-uk-tooltip="title: Jump to portfolio"><i className="fa fa-external-link-alt uk-margin-small-right"></i>  {p}</button></Link>)
        })
    }

    render() {
        if(this.props.working){
            return (<Spinner hasMargin={true} />);
        }
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage}/>);
        }

        var actions = (
            <div className="actions-accounts">
                <button className='uk-button uk-button-primary uk-margin-small-right' onClick={() => this.props.openModalDialog('upload-supply-data-gas')}><i className="fa fa-file-upload uk-margin-small-right fa-lg"></i> Upload Supply Data</button>    
            </div>
        );

        var hasData = this.state.tableData.length > 0;
        if(!hasData && this.state.searchText == ""){
            var missingDataMessage = "No gas meters have been uploaded to this account yet.";
            if(this.props.sites.length == 0){
                missingDataMessage = "No site or meter data has been uploaded to this account yet."
            }

            return (
                <div>
                    <div className="search-accounts">
                        <form className="uk-search uk-search-default">
                            <span data-uk-search-icon="search"></span>
                            <input className="uk-search-input" type="search" placeholder="Search..." disabled/>
                        </form>
                        {actions}
                    </div>
                    <hr />
                    <div className="uk-alert-default uk-margin-right uk-alert" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <i className="fas fa-info-circle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <p>{missingDataMessage} Click on the button above to get started.</p>    
                            </div>
                        </div>
                    </div>
                </div>);
        }        

        var portfolioButtons = this.renderPortfolioButtons();
        return (
            <div>
                <p className="uk-text-right">
                    {portfolioButtons}
                </p>
                <div className="search-accounts">
                    <form className="uk-search uk-search-default">
                        <span data-uk-search-icon="search"></span>
                        <input className="uk-search-input" type="search" placeholder="Search..." value={this.state.searchText} onChange={(e) => this.handleSearch(e)}/>
                    </form>
                    {actions}
                </div>
                <hr />
                <div>
                {!hasData ? (
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
                : (<ReactTable 
                    showPagination={false}
                    columns={this.columns}
                    data={this.state.tableData}
                    style={{maxHeight: `${window.innerHeight - 320}px`}}
                    minRows={0}/>)}
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountGasMeterTableProps> = (dispatch) => {
    return {
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
        fetchTariffs: () => dispatch(fetchTariffs())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountGasMeterTableProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.tariffs.working,
        error:  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.tariffs.errorMessage,
        tariffs: state.portfolio.tender.tariffs.value        
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountGasMeterTable);