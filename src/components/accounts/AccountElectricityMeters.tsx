import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { SiteDetail } from '../../model/HierarchyObjects';
import { Link } from "react-router-dom";
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer } from "../common/TableHelpers";

interface AccountElectricityMeterTableProps {
    sites: SiteDetail[];
    portfolios: any;
}

interface StateProps {
}

interface DispatchProps {
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
    stringProperties: string[] = ["siteId", "site", "meter", "type", "topline", "serialNumber", "da", "dc", "mo", "voltage", "connection", "postcode" ];
    numberProperties: string[] = ["rec", "eac", "capacity"];
    
    constructor(props: AccountElectricityMeterTableProps & StateProps & DispatchProps) {
        super();
        var tableData: AccountElectricityMeterTableEntry[]  = [];
        if(props.sites != null){
            tableData = this.filterElectricityMeters(props.sites, '');
        }

        this.state = {
            searchText: '',
            tableData: tableData
        };
    }

    componentWillReceiveProps(nextProps: AccountElectricityMeterTableProps & StateProps & DispatchProps){
        if(nextProps.sites == null){
            return;
        }

        var tableData: AccountElectricityMeterTableEntry[] = this.filterElectricityMeters(nextProps.sites, this.state.searchText);
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

        var tableData: AccountElectricityMeterTableEntry[] = this.filterElectricityMeters(this.props.sites, raw);

        this.setState({
            ...this.state,
            searchText: raw,
            tableData
        });
    }

    filterElectricityMeters(sites: SiteDetail[], searchText: string): AccountElectricityMeterTableEntry[] {
        var tableData : AccountElectricityMeterTableEntry[] = this.createTableData(sites);
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

    createTableData(sites: SiteDetail[]): AccountElectricityMeterTableEntry[]{
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
                        return {
                            siteId,
                            site: siteCode,
                            meter: electricityMeter.mpanCore,
                            type: electricityMeter.meterType,
                            topline: `${electricityMeter.profileClass} ${electricityMeter.meterTimeSwitchCode} ${electricityMeter.llf}`,
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
            return (<Link to={portfolioLink} key={portfolioId}><button className='uk-button uk-button-default uk-button-small uk-margin-small-right' data-uk-tooltip="title: Jump to portfolio"><span data-uk-icon='icon: link' /> {p}</button></Link>)
        })
    }

    render() {
        if(this.props.sites.length === 0){
            return (<div>No meter data has been uploaded yet.</div>);
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
                    <div className="actions-accounts">
                        <button className='uk-button uk-button-primary uk-margin-small-right' data-uk-toggle="target: #modal-upload-supply-data-elec"><span data-uk-icon='icon: upload' /> Upload Supply Data</button>    
                    </div>
                </div>
                
                <ReactTable 
                    showPagination={false}
                    columns={this.columns}
                    data={this.state.tableData}/>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountElectricityMeterTableProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountElectricityMeterTableProps> = (state: ApplicationState) => {
    return {
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountElectricityMeterTable);