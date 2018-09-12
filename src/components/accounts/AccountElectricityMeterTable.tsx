import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { SiteDetail } from '../../model/HierarchyObjects';
import { Link } from "react-router-dom";
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer } from "../common/TableHelpers";
import { openModalDialog } from "../../actions/viewActions";
import { Tariff } from "../../model/Tender";
import { fetchTariffs } from "../../actions/portfolioActions";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";

interface AccountElectricityMeterTableProps {
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

interface AccountElectricityMeterTableState {
    searchText: string;
    tableData: AccountElectricityMeterTableEntry[];
}

interface AccountElectricityMeterTableEntry {
    [key: string]: any;
    site: string;
    meter: string;
    type: string;
    topline: string;
    serialNumber: string;
    da: string;
    dc: string;
    mo: string;
    voltage: string;
    connection: string;
    postcode: string;
    rec: number;
    eac: number;
    capacity: number;
    energised: boolean;
    newConnection: boolean;
}

class AccountElectricityMeterTable extends React.Component<AccountElectricityMeterTableProps & StateProps & DispatchProps, AccountElectricityMeterTableState> {
    columns: Column[] = [{
        Header: 'Site',
        accessor: 'site'
    },{
        Header: 'Meter',
        accessor: 'meter'
    },{
        Header: 'Type',
        accessor: 'type'
    },{
        Header: 'Tariff',
        accessor: "tariff",
    },{
        Header: 'Topline',
        accessor: "topline",
    },{
        Header: 'S/N',
        accessor: 'serialNumber'
    },{
        Header: 'DA',
        accessor: 'da'
    },{
        Header: 'DC',
        accessor: 'dc'
    },{
        Header: 'MO',
        accessor: 'mo'
    },{
        Header: 'Voltage',
        accessor: 'voltage'
    },{
        Header: 'Connection',
        accessor: 'connection'
    },{
        Header: 'Postcode',
        accessor: 'postcode'
    },{
        Header: 'REC',
        accessor: 'rec'
    },{
        Header: 'EAC',
        accessor: 'eac'
    },{
        Header: 'Capacity',
        accessor: 'capacity'
    },{
        Header: 'Energised',
        accessor: 'energised',
        Cell: BooleanCellRenderer
    },{
        Header: 'New Connection',
        accessor: 'newConnection',
        Cell: BooleanCellRenderer
    }];
    stringProperties: string[] = ["siteId", "site", "meter", "type", "topline", "tariff", "serialNumber", "da", "dc", "mo", "voltage", "connection", "postcode" ];
    numberProperties: string[] = ["rec", "eac", "capacity"];
    
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

    componentWillReceiveProps(nextProps: AccountElectricityMeterTableProps & StateProps & DispatchProps){
        if(nextProps.sites == null || nextProps.tariffs == null){
            return;
        }

        var tableData: AccountElectricityMeterTableEntry[] = this.filterElectricityMeters(nextProps.sites, nextProps.tariffs, this.state.searchText);
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

        var tableData: AccountElectricityMeterTableEntry[] = this.filterElectricityMeters(this.props.sites, this.props.tariffs, raw);

        this.setState({
            ...this.state,
            searchText: raw,
            tableData
        });
    }

    filterElectricityMeters(sites: SiteDetail[], tariffs: Tariff[], searchText: string): AccountElectricityMeterTableEntry[] {
        var tableData : AccountElectricityMeterTableEntry[] = this.createTableData(sites, tariffs);
        if(searchText == null || searchText == ""){
            return tableData;
        }
        
        var lowerSearchText = searchText.trim().toLocaleLowerCase();
        var filtered = tableData.filter(electricityMeter => {
            var match = false;
            this.stringProperties.forEach(property => {
                var value: string = electricityMeter[property] as string;
                if(value && value.toLocaleLowerCase().includes(lowerSearchText)){
                    match = true;
                }
            });

            this.numberProperties.forEach(property => {
                var value: string = String(electricityMeter[property] as number);
                if(value && value.includes(lowerSearchText)){
                    match = true;
                }
            })
            return match;
        });

        return filtered;
    }

    parseValue(value: string){
        if(value == null){
            return "-";
        }

        return value;
    }

    createTableData(sites: SiteDetail[], tariffs: Tariff[]): AccountElectricityMeterTableEntry[]{
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
                    return site.mpans.map(electricityMeter => {
                        var tariff = tariffs.find(t => t.id == electricityMeter.tariffId);
                        return {
                            siteId,
                            site: siteCode,
                            meter: electricityMeter.mpanCore,
                            type: electricityMeter.meterType,
                            tariff: tariff == null ? "Unknown" : tariff.name,
                            topline: `${this.parseValue(electricityMeter.profileClass)} ${this.parseValue(electricityMeter.meterTimeSwitchCode)} ${this.parseValue(electricityMeter.llf)}`,
                            serialNumber: electricityMeter.serialNumber,
                            da: electricityMeter.daAgent,
                            dc: electricityMeter.dcAgent,
                            mo: electricityMeter.moAgent,
                            voltage: electricityMeter.voltage,
                            connection: electricityMeter.connection,
                            postcode: electricityMeter.postcode,
                            rec: electricityMeter.rec,
                            eac: electricityMeter.eac,
                            capacity: electricityMeter.capacity,
                            energised: electricityMeter.isEnergized,
                            newConnection: electricityMeter.isNewConnection
                        }
                    })
                });
        return [].concat.apply([], metersBySites);
    }

    renderPortfolioButtons(){
        return Object.keys(this.props.portfolios).map(p => {
            var portfolioId = this.props.portfolios[p];
            var portfolioLink = `/portfolio/${portfolioId}`;
            return (<Link to={portfolioLink} key={portfolioId}><button className='uk-button uk-button-default uk-button-small uk-margin-small-right' data-uk-tooltip="title: Jump to portfolio"><i className="fa fa-external-link-alt uk-margin-small-right"></i> {p}</button></Link>)
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
                <button className='uk-button uk-button-primary uk-margin-small-right' onClick={() => this.props.openModalDialog('upload-supply-data-electricity')}><i className="fa fa-file-upload uk-margin-small-right fa-lg"></i> Upload Supply Data</button>    
            </div>
        );

        var hasData = this.state.tableData.length > 0;
        if(!hasData && this.state.searchText == ""){
            var missingDataMessage = "No electricity meters have been uploaded to this account yet.";
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

                    <div >
                {!hasData ? (<p className="uk-text-meta uk-text-center">No results for search term: <i>{this.state.searchText}</i></p>)
                : (<ReactTable 
                    showPagination={false}
                    columns={this.columns}
                    data={this.state.tableData}                    
                    style={{maxHeight: `${window.innerHeight - 320}px`}}
                    minRows={0}/>)}
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountElectricityMeterTableProps> = (dispatch) => {
    return {
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
        fetchTariffs: () => dispatch(fetchTariffs())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountElectricityMeterTableProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.tariffs.working,
        error:  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.tariffs.errorMessage,
        tariffs: state.portfolio.tender.tariffs.value        
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountElectricityMeterTable);