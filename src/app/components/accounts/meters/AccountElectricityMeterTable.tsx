import * as React from "react";
import { MapDispatchToPropsFunction, connect } from 'react-redux';
import { SiteDetail } from '../../../model/HierarchyObjects';
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer, ReactTablePagination, NoMatchesComponent, SortFirstColumn } from "../../common/TableHelpers";
import { openDialog } from "../../../actions/viewActions";
import { Tariff } from "../../../model/Tender";
import { Alert, Card, CardBody, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import UploadSupplyDataDialog, { UploadSupplyDataDialogData } from "./UploadSupplyDataDialog";
import { UtilityType } from "../../../model/Models";

interface AccountElectricityMeterTableProps {
    accountId: string;
    sites: SiteDetail[];
    tariffs: Tariff[];
}

interface DispatchProps {
    openUploadSupplyDataDialog: (data: UploadSupplyDataDialogData) => void;
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

class AccountElectricityMeterTable extends React.Component<AccountElectricityMeterTableProps & DispatchProps, AccountElectricityMeterTableState> {
    columns: Column[] = [{
        Header: 'Site',
        accessor: 'site'
    },{
        Header: 'Meter',
        accessor: 'meter',
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
    
    constructor(props: AccountElectricityMeterTableProps & DispatchProps) {
        super(props);

        this.state = {
            searchText: '',
            tableData: this.createTableData(props.sites, props.tariffs)
        };
    }

    componentWillReceiveProps(nextProps: AccountElectricityMeterTableProps & DispatchProps){
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

    render() {
        let tableContent = null;

        if(this.props.sites.length == 0){
            tableContent = (
                <Alert color="light">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        No electricity meters have been uploaded to this account yet.
                    </div>
                </Alert>);
        }    
        else {
            tableContent = (
                <ReactTable 
                    NoDataComponent={NoMatchesComponent}
                    PaginationComponent={ReactTablePagination}
                    showPagination={true}
                    columns={this.columns}
                    data={this.state.tableData}
                    defaultSorted={SortFirstColumn(this.columns)}
                    minRows={0}/>);
        }    

        return (
            <Card className="w-100">
                <CardBody className="p-0">
                    <div className="d-flex p-2 justify-content-between">
                        <div className="d-flex">
                            <Button color="accent" outline className="btn-grey-outline"
                                    onClick={() => this.props.openUploadSupplyDataDialog({ accountId: this.props.accountId, type : UtilityType.Electricity })}>
                                <i className="fas fa-file-upload mr-2"></i>
                                Upload Supply Data
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
                <UploadSupplyDataDialog />
            </Card>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountElectricityMeterTableProps> = (dispatch) => {
    return {
        openUploadSupplyDataDialog: (data: UploadSupplyDataDialogData) => dispatch(openDialog(ModalDialogNames.UploadSupplyData, data))
    };
};
  
export default connect(null, mapDispatchToProps)(AccountElectricityMeterTable);