import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterConsumptionSummary } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import UploadHistoricDialog from './UploadHistoricDialog';

import { fetchMeterConsumption, excludeMeters, exportMeterConsumption } from '../../../actions/meterActions';
import IncludeMetersDialog from "./IncludeMetersDialog";
import ExcludeAllMetersDialog from "./ExcludeAllMetersDialog";
import ReactTable, { Column } from "react-table";
import { selectPortfolioMeterTab } from "../../../actions/viewActions";

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
    fetchMeterConsumption: (portfolioId: string) => void;
    excludeMeters: (portfolioId: string, meters: string[]) => void;    
    exportMeterConsumption: (portfolioId: string) => void;
    selectPortfolioMeterTab: (index: number) => void;
}

interface MeterTableEntry {
    [key: string]: any;
}

class PortfolioMeters extends React.Component<PortfolioMetersProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        if(this.props.portfolio != null){
            this.props.fetchMeterConsumption(this.props.portfolio.id);      
        }
    }

    exportMeterConsumption(){
        this.props.exportMeterConsumption(this.props.portfolio.id);
    }

    excludeMeter(event: any, mpanCore: string){
        event.stopPropagation();
        var meters: string[] = [mpanCore]
        this.props.excludeMeters(this.props.portfolio.id,  meters);
    }

    renderDynamicTable(columns: string[], values: string[][], utilityType: UtilityType){
        var tableColumns: Column[] = columns.map((c, index) => {
            return {
                Header: c,
                accessor: String(index)
            }
        });

        tableColumns.push({
            Header: '',
            accessor: 'core',
            sortable: false,
            Cell: row => {
                var mpanCore = row.value;
                return (<button className='uk-button uk-button-default uk-button-small' onClick={(ev) => this.excludeMeter(ev, mpanCore)}><span data-uk-icon='icon: close' data-uk-tooltip="title: Exclude" /></button>)   
            }
        });

        var data: MeterTableEntry[] = values.map(rowArray => {
           var rowObject: MeterTableEntry = {};
           for(var i = 0; i < rowArray.length; i++){
               var accessor = String(i);
               rowObject[accessor] = rowArray[i];
           }
           rowObject['core'] = rowArray[1];
           return rowObject;
        });

        var includedMeters = values.map(r => r[1]);
        var includeDialogName = `modal-include-meters-${utilityType}`;
        var showIncludeDialogClass = `target: #${includeDialogName}`;

        var excludeAllDialogName = `modal-exclude-all-meters-${utilityType}`;
        var showExcludeAllDialogClass = `target: #${excludeAllDialogName}`;

        return (
            <div>
                <div>
                    <div className="uk-grid" data-uk-grid>
                        <div className="uk-width-expand@s">
                        </div>
                        <div className="uk-width-auto@s">
                        { utilityType == UtilityType.Electricity ? (<button className='uk-button uk-button-primary uk-margin-small-left uk-margin-small-right' data-uk-toggle="target: #modal-upload-consumption"><span data-uk-icon='icon: upload' /> Upload Historic Consumption</button>) : null}
                        </div>
                        <div className="uk-width-auto@s">
                            <div className="uk-inline">
                                <button className="uk-button uk-button-default uk-margin-small-right" type="button">
                                    <span data-uk-icon="icon: more" />
                                </button>
                                <div data-uk-dropdown="pos:bottom-justify;mode:hover">
                                    <ul className="uk-nav uk-dropdown-nav">
                                        <li><a href="#" data-uk-toggle={showIncludeDialogClass}>
                                            <span className="uk-margin-small-right" data-uk-icon="icon: plus" />
                                            Include Meters
                                        </a></li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a href="#" data-uk-toggle={showExcludeAllDialogClass}>
                                            <span className="uk-margin-small-right" data-uk-icon="icon: close" />
                                            Exclude All Meters
                                        </a></li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a href="#" onClick={() => this.exportMeterConsumption()}>
                                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-download" />
                                            Export (.XLS)
                                        </a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ReactTable 
                    showPagination={false}
                    columns={tableColumns}
                    data={data}
                    minRows={0}/>

                <div id={includeDialogName} data-uk-modal="center: true">
                    <IncludeMetersDialog portfolio={this.props.details} includedMeters={includedMeters} utility={utilityType}/>
                </div>
                <div id={excludeAllDialogName} data-uk-modal="center: true">
                    <ExcludeAllMetersDialog portfolio={this.props.details} includedMeters={includedMeters} />
                </div>
            </div>);
    }
    
    selectTab(index: number){
        this.props.selectPortfolioMeterTab(index);
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    renderSelectedTable(){
        switch(this.props.selectedTab){
            case 0:
                return this.renderDynamicTable(this.props.consumption.electricityHeaders, this.props.consumption.electrictyConsumptionEntries, UtilityType.Electricity);
            case 1:
                return this.renderDynamicTable(this.props.consumption.gasHeaders, this.props.consumption.gasConsumptionEntries, UtilityType.Gas);
        }
    }

    render() {
        if(this.props.working || this.props.consumption == null){
            return (<Spinner />);
        }

        return (
            <div className="restrict-height-hack">
                <div className='uk-flex uk-flex-column portfolio-meters restrict-height-hack'>
                    <div className="uk-overflow-auto restrict-height-hack">
                        <ul className="uk-tab">
                            <li className={this.renderActiveTabStyle(0)} onClick={() => this.selectTab(0)}><a href="#">Electricity</a></li>
                            <li className={this.renderActiveTabStyle(1)} onClick={() => this.selectTab(1)}><a href="#">Gas</a></li>
                        </ul>
                        <div>
                            {this.renderSelectedTable()}
                        </div>
                    </div>
                </div>

                <div id="modal-upload-consumption" data-uk-modal="center: true">
                    <UploadHistoricDialog details={this.props.details} />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMetersProps> = (dispatch) => {
    return {
        fetchMeterConsumption: (portfolioId: string) => dispatch(fetchMeterConsumption(portfolioId)),
        excludeMeters: (portfolioId: string, meters: string[]) => dispatch(excludeMeters(portfolioId, meters)),
        exportMeterConsumption: (portfolioId: string) => dispatch(exportMeterConsumption(portfolioId)),
        selectPortfolioMeterTab: (index: number) => dispatch(selectPortfolioMeterTab(index))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMetersProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        
        consumption: state.meters.consumption.value,
        working: state.meters.consumption.working,
        error: state.meters.consumption.error,
        errorMessage: state.meters.consumption.errorMessage,

        selectedTab: state.view.portfolio.meter.selectedIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters);