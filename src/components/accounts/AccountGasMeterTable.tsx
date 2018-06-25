import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { SiteDetail } from '../../model/HierarchyObjects';
import { Link } from "react-router-dom";
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer } from "../common/TableHelpers";
import { openModalDialog } from "../../actions/viewActions";

interface AccountGasMeterTableProps {
    sites: SiteDetail[];
    portfolios: any;
}

interface StateProps {
}

interface DispatchProps {
    openModalDialog: (dialogId: string) => void;
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
    stringProperties: string[] = ["siteId", "site", "meter", "serialNumber", "make", "model"];
    numberProperties: string[] = ["size", "aq"];
    
    constructor(props: AccountGasMeterTableProps & StateProps & DispatchProps) {
        super();
        var tableData: AccountGasMeterTableEntry[]  = [];
        if(props.sites != null){
            tableData = this.filterGasMeters(props.sites, '');
        }

        this.state = {
            searchText: '',
            tableData: tableData
        };
    }

    componentWillReceiveProps(nextProps: AccountGasMeterTableProps & StateProps & DispatchProps){
        if(nextProps.sites == null){
            return;
        }

        var tableData: AccountGasMeterTableEntry[] = this.filterGasMeters(nextProps.sites, this.state.searchText);
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

        var tableData: AccountGasMeterTableEntry[] = this.filterGasMeters(this.props.sites, raw);

        this.setState({
            ...this.state,
            searchText: raw,
            tableData
        });
    }

    filterGasMeters(sites: SiteDetail[], searchText: string): AccountGasMeterTableEntry[] {
        var tableData : AccountGasMeterTableEntry[] = this.createTableData(sites);
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

    createTableData(sites: SiteDetail[]): AccountGasMeterTableEntry[]{
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
                        return {
                            siteId,
                            site: siteCode,
                            meter: gasMeter.mprnCore,
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
            return (<Link to={portfolioLink} key={portfolioId}><button className='uk-button uk-button-default uk-button-small uk-margin-small-right' data-uk-tooltip="title: Jump to portfolio"><span data-uk-icon='icon: link' /> {p}</button></Link>)
        })
    }

    render() {
        var actions = (
            <div className="actions-accounts">
                <button className='uk-button uk-button-primary uk-margin-small-right' onClick={() => this.props.openModalDialog('upload-supply-data-gas')}><span data-uk-icon='icon: upload' /> Upload Supply Data</button>    
            </div>
        );
        if(this.props.sites.length === 0){
            return (
                <div>
                    <div className="search-accounts">
                        <form className="uk-search uk-search-default">
                            <span data-uk-search-icon="search"></span>
                            <input className="uk-search-input" type="search" placeholder="Search..." disabled/>
                        </form>
                        {actions}
                    </div>
                    <div>No meter data has been uploaded yet.</div>
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
                
                <ReactTable 
                    showPagination={false}
                    columns={this.columns}
                    data={this.state.tableData}
                    minRows={0}/>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountGasMeterTableProps> = (dispatch) => {
    return {
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountGasMeterTableProps> = (state: ApplicationState) => {
    return {
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountGasMeterTable);