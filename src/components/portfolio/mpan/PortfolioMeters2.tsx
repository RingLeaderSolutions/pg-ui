import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio } from '../../../model/Models';
import { MeterPortfolio, Meter } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';

import { getMeters } from '../../../actions/meterActions';

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
}

class PortfolioMeters2 extends React.Component<PortfolioMetersProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        if(this.props.portfolio != null){
            this.props.getMeters('4d584e81-91c2-47b4-85f9-411db125af51');
        }
    }

    renderMeters(meters: Meter[])
    {
        return (
            <tbody>
                {meters.map((meter, index) =>{
                    return (
                        <tr key={index}>
                            <td></td>
                            <td>{meter.meterSupplyData.mpanCore}</td>
                            <td>{meter.meterSupplyData.meterType}</td>
                            <td>{meter.meterSupplyData.newConnection}</td>
                            <td>{meter.meterSupplyData.MTC}</td>
                            <td>{meter.meterSupplyData.LLF}</td>
                            <td>{meter.meterSupplyData.profileClass}</td>
                            <td>{meter.meterSupplyData.retrievalMethod}</td>
                            <td>{meter.meterSupplyData.GSPGroup}</td>
                            <td>{meter.meterSupplyData.measurementClass}</td>
                            <td>{meter.meterSupplyData.energised}</td>
                            <td>{meter.meterSupplyData.da}</td>
                            <td>{meter.meterSupplyData.dc}</td>
                            <td>{meter.meterSupplyData.mo}</td>
                            <td>{meter.meterSupplyData.voltage}</td>
                            <td>{meter.meterSupplyData.connection}</td>
                            <td>{meter.meterSupplyData.serialNumber}</td>
                            <td>{meter.meterSupplyData.capacity}</td>
                            <td>{meter.meterSupplyData.EAC}</td>
                        </tr>
                    );
                })}
            </tbody>  
        );
    }

    renderTable(meters: Meter[]) {
        return (
            <table className='uk-table uk-table-divider'>
            <thead>
                <tr>
                    <th>Site</th>
                    <th>Meter</th>
                    <th>Meter Type</th>
                    <th>New Connection</th>
                    <th>MTC</th>
                    <th>LLF</th>
                    <th>Profile Class</th>
                    <th>Retrieval Method</th>
                    <th>GSP Group</th>
                    <th>Measurement Class</th>
                    <th>Energised</th>
                    <th>DA</th>
                    <th>DC</th>
                    <th>MO</th>
                    <th>Voltage</th>
                    <th>Connection</th>
                    <th>Serial Number</th>
                    <th>Capacity</th>
                    <th>EAC</th>
                </tr>
            </thead>
               {this.renderMeters(meters)}
        </table>
        );
    }

    render() {
        if(this.props.working || this.props.meterPortfolio == null){
            return (<Spinner />);
        }
        
        const elec = this.props.meterPortfolio.meters
            .filter(m => m.meterSupplyData.utility === 'electricity');

        const gas = this.props.meterPortfolio.meters
            .filter(m => m.meterSupplyData.utility === 'gas');

        return (
            <div className='uk-flex uk-flex-column'>
                <p className='uk-float-right'>
                    <button className='uk-button uk-button-primary uk-button-small'><span data-uk-icon='icon: upload' />Supply Data</button>
                    <button className='uk-button uk-button-primary uk-button-small'><span data-uk-icon='icon: upload' />Consumption</button>
                </p>
                <div>
                    <ul className='uk-subnav uk-subnav-pill'>
                        <li className='uk-active'><a href='#'>Electricity</a></li>
                        <li><a href='#'>Gas</a></li>
                        
                    </ul>
                    <ul className='uk-switcher'>
                        <li className='uk-active'>
                            {this.renderTable(elec)}
                        </li>
                        <li>
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
        getMeters: (portfolioId: string) => dispatch(getMeters(portfolioId))
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
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters2);