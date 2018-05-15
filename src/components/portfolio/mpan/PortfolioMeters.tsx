import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterPortfolio, Mpan, MeterType, MeterConsumptionSummary } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';
import UploadHistoricDialog from './UploadHistoricDialog';
import UploadSupplyDataDialog from './UploadSupplyDataDialog';

import { fetchMeterConsumption, excludeMeters, exportMeterConsumption } from '../../../actions/meterActions';
import IncludeMetersDialog from "./IncludeMetersDialog";
import ExcludeAllMetersDialog from "./ExcludeAllMetersDialog";

interface PortfolioMetersProps {
    portfolio: Portfolio;
}

interface StateProps {
    details: PortfolioDetails;
    working: boolean;
    error: boolean;
    errorMessage: string;
    consumption: MeterConsumptionSummary;
}

interface DispatchProps {
    fetchMeterConsumption: (portfolioId: string) => void;
    excludeMeters: (portfolioId: string, meters: string[]) => void;    
    exportMeterConsumption: (portfolioId: string) => void;
}

interface State {
    tab: string
}

class PortfolioMeters extends React.Component<PortfolioMetersProps & StateProps & DispatchProps, State> {
    constructor() {
        super();

        this.state = {
            tab: 'electricity'
        };
    }

    componentDidMount(){
        if(this.props.portfolio != null){
            this.props.fetchMeterConsumption(this.props.portfolio.id);      
        }
    }

    selectTab(tab:string){
        this.setState({
            tab: tab
        });
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
        var includedMeters = values.map(r => r[1]);
        var includeDialogName = `modal-include-meters-${utilityType}`;
        var showIncludeDialogClass = `target: #${includeDialogName}`;

        var excludeAllDialogName = `modal-exclude-all-meters-${utilityType}`;
        var showExcludeAllDialogClass = `target: #${excludeAllDialogName}`;

        var rows = values
        .sort(
            (rowA, rowB) => {
                if (rowA[0] < rowB[0]) return -1;
                if (rowA[0] > rowB[0]) return 1;
                return 0;
            })
        .map((row, rowIndex) => {
           return (
               <tr key={rowIndex}>
                   {row.map((cellValue, cellIndex) => {
                       var key = `${rowIndex},${cellIndex}`;
                       return (<td key={key}>{cellValue}</td>);
                   })}
                   <td>
                        <button className='uk-button uk-button-default uk-button-small' onClick={(ev) => this.excludeMeter(ev, row[1])}><span data-uk-icon='icon: close' data-uk-tooltip="title: Exclude" /></button>
                    </td>
               </tr>);
        });

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
                                <div data-uk-dropdown="pos:bottom-justify;mode:click">
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
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            {columns.map(c => {
                                return (<th key={c}>{c}</th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <div id={includeDialogName} data-uk-modal="center: true">
                    <IncludeMetersDialog portfolio={this.props.details} includedMeters={includedMeters} utility={utilityType}/>
                </div>
                <div id={excludeAllDialogName} data-uk-modal="center: true">
                    <ExcludeAllMetersDialog portfolio={this.props.details} includedMeters={includedMeters} />
                </div>
            </div>);
    }

    render() {
        if(this.props.working || this.props.consumption == null){
            return (<Spinner />);
        }

        return (
            <div className="restrict-height-hack">
                <div className='uk-flex uk-flex-column portfolio-meters restrict-height-hack'>
                    <div className="uk-overflow-auto restrict-height-hack">
                        <ul data-uk-tab>
                            <li><a href="#">Electricity</a></li>
                            <li><a href="#">Gas</a></li>
                        </ul>
                        <ul className="uk-switcher">
                            <li>{this.renderDynamicTable(this.props.consumption.electricityHeaders, this.props.consumption.electrictyConsumptionEntries, UtilityType.Electricity)}</li>
                            <li>{this.renderDynamicTable(this.props.consumption.gasHeaders, this.props.consumption.gasConsumptionEntries, UtilityType.Gas)}</li>
                        </ul>
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
        exportMeterConsumption: (portfolioId: string) => dispatch(exportMeterConsumption(portfolioId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMetersProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        
        consumption: state.meters.consumption.value,
        working: state.meters.consumption.working,
        error: state.meters.consumption.error,
        errorMessage: state.meters.consumption.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters);