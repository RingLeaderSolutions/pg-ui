import * as React from "react";
import { MapDispatchToPropsFunction, connect } from 'react-redux';
import { SiteDetail } from '../../../model/HierarchyObjects';
import ReactTable, { Column } from "react-table";
import { BooleanCellRenderer, NoMatchesComponent, ReactTablePagination, SortFirstColumn } from "../../common/TableHelpers";
import { openDialog } from "../../../actions/viewActions";
import { Tariff } from "../../../model/Tender";
import { Card, CardBody, Alert, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import UploadSupplyDataDialog, { UploadSupplyDataDialogData } from "./UploadSupplyDataDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { UtilityType } from "../../../model/Models";

interface AccountGasMeterTableProps {
    accountId: string;
    sites: SiteDetail[];
    tariffs: Tariff[];
}

interface DispatchProps {
    openUploadSupplyDataDialog: (data: UploadSupplyDataDialogData) => void;
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

class AccountGasMeterTable extends React.Component<AccountGasMeterTableProps & DispatchProps, AccountGasMeterTableState> {
    columns: Column[] = [{
        Header: 'Site',
        accessor: 'site'
    },{
        Header: 'Meter',
        accessor: 'meter'
    },{
        Header: 'AQ',
        accessor: 'aq'
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
    
    constructor(props: AccountGasMeterTableProps & DispatchProps) {
        super(props);

        this.state = {
            searchText: '',
            tableData: this.createTableData(props.sites, props.tariffs)
        };
    }

    componentWillReceiveProps(nextProps: AccountGasMeterTableProps & DispatchProps){
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

    render() {
        let tableContent = null;

        if(this.props.sites.length == 0){
            tableContent = (
                <Alert color="light">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        No gas meters have been uploaded to this account yet.
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
                                    onClick={() => this.props.openUploadSupplyDataDialog({ accountId: this.props.accountId, type : UtilityType.Gas })}>
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

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountGasMeterTableProps> = (dispatch) => {
    return {
        openUploadSupplyDataDialog: (data: UploadSupplyDataDialogData) => dispatch(openDialog(ModalDialogNames.UploadSupplyData, data))
    };
};
  
  
export default connect(null, mapDispatchToProps)(AccountGasMeterTable);