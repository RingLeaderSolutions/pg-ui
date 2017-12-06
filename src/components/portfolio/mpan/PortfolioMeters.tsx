import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio } from '../../../model/Models';
import { MeterPortfolio, Meter } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';
import MeterDetails from './MeterDetails';

import { getMeters, editMeter, cancelEditMeter } from '../../../actions/meterActions';

interface PortfolioMetersProps {
    portfolio: Portfolio;
}

interface StateProps {
    meterPortfolio: MeterPortfolio
    working: boolean
    error: boolean
    errorMessage: string
}

interface DispatchProps {
    getMeters: (portfolioId: string) => void;
    editMeter: (meter: Meter) => void;
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
            this.props.getMeters(this.props.portfolio.id);
        }
    }

    editMeter(meter: Meter){
        this.props.editMeter(meter);
    }

    renderMeters(meters: Meter[])
    {
        return (
            <tbody>
                {meters.map((meter, index) =>{
                    return (
                        <tr key={index} data-uk-toggle='target: #meter-modal' onClick={()=> this.editMeter(meter)}>
                            <td>{meter.meterSupplyData.mpanCore}</td>
                            <td>{meter.meterSupplyData.meterType}</td>
                            <td>{meter.meterSupplyData.meterTimeSwitchCode}</td>
                            <td>{meter.meterSupplyData.llf}</td>
                            <td>{meter.meterSupplyData.profileClass}</td>
                            <td>{meter.meterSupplyData.retrievalMethod}</td>
                            <td>{meter.meterSupplyData.gspGroup}</td>
                            <td>{meter.meterSupplyData.measurementClass}</td>
                            <td>{meter.meterSupplyData.serialNumber}</td>
                            <td>{meter.meterSupplyData.daAgent}</td>
                            <td>{meter.meterSupplyData.dcAgent}</td>
                            <td>{meter.meterSupplyData.moAgent}</td>
                            <td>{meter.meterSupplyData.voltage}</td>
                            <td>{meter.meterSupplyData.connection}</td>
                            <td>{meter.meterSupplyData.postcode}</td>
                            <td>{meter.meterSupplyData.rec}</td>
                            <td>{meter.meterSupplyData.eac}</td>
                            <td>{meter.meterSupplyData.capacity}</td>
                            <td>{meter.meterSupplyData.energized}</td>
                            <td>{meter.meterSupplyData.newConnection}</td>
                        </tr>
                    );
                })}
            </tbody>
        );
    }

    renderTable(meters: Meter[]) {
        if(meters.length === 0){
            return (<div>No meter data uploaded yet.</div>);
        }

        return (
            <table className='uk-table uk-table-divider meter-table'>
                <thead>
                    <tr>
                        <th>Meter</th>
                        <th>Meter Type</th>
                        <th>Meter Time Switch Code</th>
                        <th>LLF</th>
                        <th>Profile Class</th>
                        <th>Retrieval Method</th>
                        <th>GSP Group</th>
                        <th>Measurement Class</th>
                        <th>Serial Number</th>
                        <th>DA Agent</th>
                        <th>DC Agent</th>
                        <th>MO Agent</th>
                        <th>Voltage</th>
                        <th>Connection</th>
                        <th>Postcode</th>
                        <th>REC</th>
                        <th>EAC</th>
                        <th>Capacity</th>
                        <th>Energised</th>
                        <th>New Connection</th>
                    </tr>
                </thead>
                {this.renderMeters(meters)}
            </table>
        );
    }

    filterByUtility(meters: Meter[], utility: string ){
        return meters            
            .filter(m => m.meterSupplyData 
                && m.meterSupplyData.utility 
                && m.meterSupplyData.utility === utility);
    }

    selectTab(tab:string){
        this.setState({
            tab: tab
        });
    }

    render() {
        if(this.props.working || this.props.meterPortfolio == null){
            return (<Spinner />);
        }
        
        const elec = this.filterByUtility(this.props.meterPortfolio.meters, 'ELECTRICITY' );
        const gas =  this.filterByUtility(this.props.meterPortfolio.meters, 'GAS');

        return (
            <div className='uk-flex uk-flex-column portfolio-meters'>
                <div>
                    <p className='uk-text-right'>
                        <button className='uk-button uk-button-primary uk-button-small'><span data-uk-icon='icon: upload' />Supply Data</button>
                        <button className='uk-button uk-button-primary uk-button-small'><span data-uk-icon='icon: upload' />Consumption</button>
                    </p>
                </div>
                <div id='meter-modal' className='uk-flex-top' data-uk-modal>
                    <MeterDetails portfolio={this.props.portfolio}/>
                </div>
                <div>
                    <ul data-uk-tab>
                        <li className={this.state.tab === 'electricity' ? 'uk-active' : null}>
                            <a href='#' onClick={() =>this.selectTab('electricity')}>Electricity</a>
                        </li>
                        <li className={this.state.tab === 'gas' ? 'uk-active' : null}>
                            <a href='#' onClick={() =>this.selectTab('gas')}>Gas</a>
                        </li>
                    </ul>
                    <ul className='uk-switcher'>
                        <li className={this.state.tab === 'electricity' ? 'uk-active' : null}>
                            {this.renderTable(elec)}
                        </li>
                        <li className={this.state.tab === 'gas' ? 'uk-active' : null}>
                            {this.renderTable(gas)}
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMetersProps> = (dispatch) => {
    return {
        getMeters: (portfolioId: string) => dispatch(getMeters(portfolioId)),
        editMeter: (meter: Meter) => dispatch(editMeter(meter))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMetersProps> = (state: ApplicationState) => {
    return {
        meterPortfolio: state.meters.value,
        working: state.meters.working,
        error: state.meters.error,
        errorMessage: state.meters.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters);