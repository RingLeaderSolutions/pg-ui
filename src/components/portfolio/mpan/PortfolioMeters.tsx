import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterPortfolio, Mpan, MeterType, MeterConsumptionSummary } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';
import UploadHistoricDialog from './UploadHistoricDialog';
import UploadSupplyDataDialog from './UploadSupplyDataDialog';

import GasMeterTable from './GasMeterTable';
import ElectricityMeterTable from './ElectricityMeterTable';

import { fetchMeterConsumption, excludeMeters, exportMeterConsumption } from '../../../actions/meterActions';

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
        var supplyDataDialogClass = utilityType == UtilityType.Electricity ? "target: #modal-upload-supply-data-elec" : "target: #modal-upload-supply-data-gas";

        var rows = values.map((row, rowIndex) => {
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
                    <p className='uk-text-right'>
                        <button className='uk-button uk-button-default uk-button-small' onClick={() => this.exportMeterConsumption()} ><span data-uk-icon='icon: cloud-download' /> Export</button>
                        <button className='uk-button uk-button-primary uk-button-small uk-margin-small-left' data-uk-toggle={supplyDataDialogClass}><span data-uk-icon='icon: upload' /> Upload Supply Data</button>
                        { utilityType == UtilityType.Electricity ? (<button className='uk-button uk-button-primary uk-button-small uk-margin-small-left uk-margin-small-right' data-uk-toggle="target: #modal-upload-consumption"><span data-uk-icon='icon: upload' /> Upload Historic Consumption</button>) : null}
                    </p>
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
            </div>);
    }

    render() {
        if(this.props.working || this.props.consumption == null){
            return (<Spinner />);
        }

        return (
            <div>
                <div className='uk-flex uk-flex-column portfolio-meters'>
                    <div className="uk-overflow-auto">
                        <ul data-uk-tab>
                            <li><a href="#">Electricity</a></li>
                            <li><a href="#">Gas</a></li>
                        </ul>
                        <ul className="uk-switcher restrict-height-hack">
                            <li>{this.renderDynamicTable(this.props.consumption.electricityHeaders, this.props.consumption.electrictyConsumptionEntries, UtilityType.Electricity)}</li>
                            <li>{this.renderDynamicTable(this.props.consumption.gasHeaders, this.props.consumption.gasConsumptionEntries, UtilityType.Gas)}</li>
                        </ul>
                    </div>
                </div>

                <div id="modal-upload-supply-data-elec" data-uk-modal="center: true">
                    <UploadSupplyDataDialog details={this.props.details} type={UtilityType.Electricity} />
                </div>

                <div id="modal-upload-supply-data-gas" data-uk-modal="center: true">
                    <UploadSupplyDataDialog details={this.props.details} type={UtilityType.Gas} />
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