import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterConsumptionSummary } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import UploadHistoricDialog, { UploadHistoricDialogData } from './UploadHistoricDialog';

import { fetchMeterConsumption, excludeMeters, exportMeterConsumption } from '../../../actions/meterActions';
import IncludeMetersDialog, { IncludeMetersDialogData } from "./IncludeMetersDialog";
import ExcludeAllMetersDialog, { ExcludeAllMetersDialogData } from "./ExcludeAllMetersDialog";
import ReactTable, { Column } from "react-table";
import { selectPortfolioMeterTab, openDialog, openAlertConfirmDialog } from "../../../actions/viewActions";
import * as cn from "classnames";
import { ButtonGroup, InputGroup, InputGroupAddon, Input, Button, Row, InputGroupText, Card, CardBody, UncontrolledTooltip, Alert } from "reactstrap";
import { ReactTablePagination, NoMatchesComponent, SortFirstColumn } from "../../common/TableHelpers";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { AlertConfirmDialogData } from "../../common/modal/AlertConfirmDialog";
import { LoadingIndicator } from "../../common/LoadingIndicator";

interface PortfolioMetersProps {
    portfolio: Portfolio;
}

interface StateProps {
    details: PortfolioDetails;
    working: boolean;
    error: boolean;
    errorMessage: string;
    consumption: MeterConsumptionSummary;
    selectedTab: number;
}

interface DispatchProps {
    fetchMeterConsumption: (portfolioId: string, utility: UtilityType) => void;
    excludeMeters: (portfolioId: string, meters: string[]) => void;    
    exportMeterConsumption: (portfolioId: string, utility: UtilityType) => void;
    selectPortfolioMeterTab: (index: number) => void;

    openAlertConfirmDialog: (data: AlertConfirmDialogData) => void;
    openIncludeMetersDialog: (data: IncludeMetersDialogData) => void;
    openExcludeAllMetersDialog: (data: ExcludeAllMetersDialogData) => void;
    openUploadHistoricDialog: (data: UploadHistoricDialogData) => void;
}

interface MeterTableEntry {
    [key: string]: any;
}

interface PortfolioMetersState{
    searchText: string;
    utility: UtilityType;
    tableData: MeterTableEntry[];
    tableColumns: Column[];
}

class PortfolioMeters extends React.Component<PortfolioMetersProps & StateProps & DispatchProps, PortfolioMetersState> {
    constructor(props: PortfolioMetersProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            searchText: '',
            utility: UtilityType.Electricity,
            tableData: [],
            tableColumns: []
        }
    }

    componentDidMount(){
        if(this.props.portfolio != null){
            const utility = this.props.selectedTab === 0 ? UtilityType.Electricity : UtilityType.Gas;
            this.props.fetchMeterConsumption(this.props.portfolio.id, utility);      
        }
    }

    exportMeterConsumption(){
        const utility = this.props.selectedTab === 0 ? UtilityType.Electricity : UtilityType.Gas;
        this.props.exportMeterConsumption(this.props.portfolio.id, utility);
    }

    static getDerivedStateFromProps(props: PortfolioMetersProps & StateProps & DispatchProps, state: PortfolioMetersState) : PortfolioMetersState {
        if(props.working || !props.consumption){
            return state;
        }

        let utility = props.selectedTab === 0 ? UtilityType.Electricity : UtilityType.Gas;

        let tableColumns = PortfolioMeters.createTableColumns(props, utility);
        let tableData = PortfolioMeters.filterMeters(props.consumption, state.searchText)

        return {
            ...state,
            utility,
            tableColumns,
            tableData
        };
    }

    static filterMeters(consumption: MeterConsumptionSummary, searchText: string){
        var tableData : MeterTableEntry[] = PortfolioMeters.createTableData(consumption.entries);
        if(searchText == null || searchText == ""){
            return tableData;
        }

        var lowerSearchText = searchText.trim().toLocaleLowerCase();
        var filtered = tableData.filter(meterEntry => {
            var match = false;

            var keys = Object.keys(meterEntry);
            keys.forEach(property => {
                var value: string = meterEntry[property] as string;
                if(value && value.toLocaleLowerCase().includes(lowerSearchText)){
                    match = true;
                }
            });
            return match;
        });

        return filtered;
    }

    static createTableColumns(props: PortfolioMetersProps & StateProps & DispatchProps, utility: UtilityType): Column[] {
        let { consumption } = props;
        let columns: Column[] = consumption.headers.map((c, index) => {
            return {
                Header: c,
                accessor: String(index)
            }
        });

        columns.push({
            Header: 'Exclude',
            accessor: 'core',
            sortable: false,
            Cell: row => {
                var mpanCore = row.value;

                return (<a href="#" onClick={(ev: any) => PortfolioMeters.excludeMeter(props, ev, mpanCore)} className="d-inline-block h-100 w-100 text-danger">
                    <i className="fas fa-trash-alt" />
                    </a>);
            }
        });

        return columns;
    }

    static createTableData(values: string[][]): MeterTableEntry[] {
        return values.map(rowArray => {
            var rowObject: MeterTableEntry = {};
            for(var i = 0; i < rowArray.length; i++){
                var accessor = String(i);
                rowObject[accessor] = rowArray[i];
            }
            rowObject['core'] = rowArray[1];
            return rowObject;
         });
    }

    handleSearch(ev: any){
        var raw = String(ev.target.value);
        if(this.state.searchText === raw){
            return;
        }

        var tableData: MeterTableEntry[] = PortfolioMeters.filterMeters(this.props.consumption, raw);

        this.setState({
            ...this.state,
            searchText: raw,
            tableData
        });
    }

    static excludeMeter(props: DispatchProps & PortfolioMetersProps, event: any, mpanCore: string){
        event.stopPropagation();

        props.openAlertConfirmDialog({
            title: "Confirm",
            body: `Are you sure you want to exclude the "${mpanCore}" meter from this portfolio?`,
            confirmText: "Yes",
            confirmIcon: "trash-alt",
            headerClass: "modal-header-danger",
            confirmButtonColor: "danger",
            onConfirm: () => props.excludeMeters(props.portfolio.id,  [mpanCore])
        });
    }

    renderDynamicTable(utilityType: UtilityType){
        // Immediate check to see if the server has returned any meters of this type to us at all
        const hasAssignedMeters = this.props.consumption.entries.length > 0;
        
        var tableContent;
        if(!hasAssignedMeters){
            tableContent = (
                <Alert color="light" className="mt-2">
                    <div className="d-flex align-items-center flex-column">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        <p className="m-0 pt-2">No meters of this type have been included in this portfolio yet.</p>
                        <p className="m-0 pt-1">Click on the button above to include some!</p>
                    </div>
                </Alert>);
        }
        else {
            tableContent = (
                <ReactTable 
                    NoDataComponent={NoMatchesComponent}
                    PaginationComponent={ReactTablePagination}
                    showPagination={true}
                    columns={this.state.tableColumns}
                    data={this.state.tableData}
                    defaultSorted={SortFirstColumn(this.state.tableColumns)}
                    minRows={0}/>);
        }

        var hasHHMeters = hasAssignedMeters && this.props.consumption.entries.filter(arr => arr[2] == "HH").length > 0;
        let includedMeters = this.props.consumption.entries.map(r => r[1]);

        return (
            <Card className="w-100">
                <CardBody className="p-0">
                    <div className="d-flex p-2 justify-content-between">
                        <div className="d-flex">
                        <Button color="accent" outline className="btn-grey-outline"
                                onClick={() => this.props.openIncludeMetersDialog({ includedMeters, utility: utilityType, portfolio: this.props.details})}>
                            <i className="fas fa-folder-plus mr-2"></i>
                            Include
                        </Button>
                        <div className="d-flex">
                            <Button color="danger" outline className="ml-1 btn-grey-outline"
                                    onClick={() => this.props.openExcludeAllMetersDialog({includedMeters, portfolio: this.props.details})} disabled={!hasAssignedMeters}>
                                <i className="fas fa-minus-circle mr-2"></i>
                                Exclude all
                            </Button>
                        </div>
                        </div>
                        { utilityType == UtilityType.Electricity &&
                            (<Button color="accent"
                                        disabled={!hasHHMeters}
                                        onClick={() => this.props.openUploadHistoricDialog({ details: this.props.details})} >
                                        <i className="fas fa-file-upload mr-2"></i>Upload Historic Consumption
                                </Button>)}
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
                            <Button color="success" outline className="ml-1 btn-grey-outline"
                                        onClick={() => this.exportMeterConsumption()}
                                        id="export-meter-data-button">
                                <i className="fas fa-file-excel"></i>
                            </Button>
                            <UncontrolledTooltip target="export-meter-data-button" placement="top">
                                Export (.XLS)
                            </UncontrolledTooltip>
                        </div>
                    </div>
                    {tableContent}
                </CardBody>
            </Card>
        )
    }
    
    selectTab(index: number, utility: UtilityType){
        this.props.fetchMeterConsumption(this.props.portfolio.id, utility);  
        this.props.selectPortfolioMeterTab

        this.props.selectPortfolioMeterTab(index);
        this.setState({
            ...this.state,
            searchText: ""
        });
    }

    renderSelectedTable(){
        switch(this.props.selectedTab){
            case 0:
                return this.renderDynamicTable(UtilityType.Electricity);
            case 1:
                return this.renderDynamicTable(UtilityType.Gas);
            default:
                return (<p>No tab selected</p>);
        }
    }

    render() {
        let content = (<LoadingIndicator />);
        if(!this.props.working && this.props.consumption){
            content = this.renderSelectedTable();
        }

        return (
            <div className="w-100 p-3">
                <Row className="d-flex justify-content-center" noGutters>
                    <ButtonGroup>
                        <Button color="white active-warning" className={cn({ active: this.props.selectedTab == 0})}
                                onClick={() => this.selectTab(0, UtilityType.Electricity)}>
                            <i className="fa fa-bolt mr-2" />
                            Electricity
                        </Button>
                        <Button color="white active-orange" className={cn({ active: this.props.selectedTab == 1})}
                                onClick={() => this.selectTab(1, UtilityType.Gas)}>
                            <i className="fas fa-fire mr-2" />
                            Gas
                        </Button>
                    </ButtonGroup>
                </Row>
                <Row noGutters className="mt-3">
                    {content}
                </Row>
                <IncludeMetersDialog />
                <ExcludeAllMetersDialog />
                <UploadHistoricDialog />
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMetersProps> = (dispatch) => {
    return {
        fetchMeterConsumption: (portfolioId: string, utility: UtilityType) => dispatch(fetchMeterConsumption(portfolioId, utility)),
        excludeMeters: (portfolioId: string, meters: string[]) => dispatch(excludeMeters(portfolioId, meters)),
        exportMeterConsumption: (portfolioId: string, utility: UtilityType) => dispatch(exportMeterConsumption(portfolioId, utility)),
        selectPortfolioMeterTab: (index: number) => dispatch(selectPortfolioMeterTab(index)),

        openAlertConfirmDialog: (data: AlertConfirmDialogData) => dispatch(openAlertConfirmDialog(data)),
        openIncludeMetersDialog: (data: IncludeMetersDialogData) => dispatch(openDialog(ModalDialogNames.IncludeMeters, data)),
        openExcludeAllMetersDialog: (data: ExcludeAllMetersDialogData) => dispatch(openDialog(ModalDialogNames.ExcludeAllMeters, data)),
        openUploadHistoricDialog: (data: UploadHistoricDialogData) => dispatch(openDialog(ModalDialogNames.UploadHistoric, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMetersProps, ApplicationState> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        
        consumption: state.meters.consumption.value,
        working: state.meters.consumption.working,
        error: state.meters.consumption.error,
        errorMessage: state.meters.consumption.errorMessage,

        selectedTab: state.view.portfolio.selectedMeterUtilityIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters);