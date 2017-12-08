import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { Portfolio } from '../../../model/Models';
import { 
    MeterPortfolio, 
    Meter,
    MeterSupplyData, 
    AggregatorCollectors,
    MeterOperators, 
    MeterTimeSwitchCodes,
    RetrievalMethods,
    GspGroups,
    MeasurementClasses
} from '../../../model/Meter';

import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';

import { cancelEditMeter, editMeter } from '../../../actions/meterActions';

interface MeterDetailsProps {
    portfolio: Portfolio;
}

interface StateProps {
    meter: Meter
}

interface DispatchProps {
    updateMeter: (meter: Meter) => void;
    cancelEditMeter: () => void;
}


interface State {
    tab: string
}

class MeterDetails extends React.Component<MeterDetailsProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    close(){
        this.props.cancelEditMeter();
    }

    updateMeter(meterSupplyData: MeterSupplyData){
        this.props.updateMeter({
            ...this.props.meter,
            meterSupplyData: { ...meterSupplyData}
        });
    }

    render() {
        const meter = this.props.meter;
        if(meter == null){
            return (<div className="uk-modal-dialog uk-modal-body"><Spinner /></div>);
        }

        const supplyData = meter.meterSupplyData;

        return (
            <div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical meter-details-modal'>
                <h2 className='uk-modal-title'>Meter: {supplyData.mpanCore}</h2>
                <form>
                    
                    <div className='uk-flex'>
                        <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
                            <fieldset className='uk-fieldset'>
                                <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                                    <label className='uk-form-label'>Meter Type</label>
                                    <label>
                                        <input 
                                            className='uk-radio' 
                                            type='radio' 
                                            name='meter-type' 
                                            checked={supplyData.meterType === 'HH'}
                                            onClick={()=> this.updateMeter({
                                                    ...supplyData,
                                                    meterType: 'HH'
                                            }) }/> HH
                                    </label>
                                    <label>
                                        <input 
                                            className='uk-radio' 
                                            type='radio' 
                                            name='meter-type' 
                                            checked={supplyData.meterType === 'NHH'}
                                            onClick={()=> this.updateMeter({
                                                    ...supplyData,
                                                    meterType: 'NHH'
                                            }) }/> NHH
                                    </label>
                                </div>

                                <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                                    <label>
                                        <input 
                                            className='uk-checkbox'
                                            type='checkbox' 
                                            checked={supplyData.newConnection}
                                            onClick={() => this.updateMeter({
                                                    ...supplyData,
                                                    newConnection: !supplyData.newConnection
                                            })}/> New Connection
                                    </label>
                                </div>

                                <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                                    <label>
                                        <input 
                                            className='uk-checkbox' 
                                            type='checkbox' 
                                            checked={supplyData.energized}
                                            onClick={() => this.updateMeter({
                                                    ...supplyData,
                                                    energized: !supplyData.energized
                                            })}/> Is Energised
                                    </label>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Meter Time Switch Code</label>
                                    <select className='uk-select' 
                                        value={supplyData.meterTimeSwitchCode}
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            meterTimeSwitchCode: e.target.value
                                        }))}>
                                        { MeterTimeSwitchCodes.map(m => {
                                            return <option key={m} value={m}>{m}</option>
                                        })}
                                    </select>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>LLF</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={supplyData.llf} 
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            llf: e.target.value
                                        }))}/>
                                </div>
                                
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Profile Class</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={supplyData.profileClass} 
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            profileClass: e.target.value
                                        }))}/>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Retrieval Method</label>
                                    <select className='uk-select' 
                                        value={supplyData.retrievalMethod}
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            retrievalMethod: e.target.value
                                        }))}>
                                        { RetrievalMethods.map(m => {
                                            return <option key={m} value={m}>{m}</option>
                                        })}
                                    </select>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>GSP Group</label>
                                    <select className='uk-select' 
                                        value={supplyData.gspGroup}
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            gspGroup: e.target.value
                                        }))}>
                                        { GspGroups.map(m => {
                                            return <option key={m} value={m}>{m}</option>
                                        })}
                                    </select>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Measurement Class</label>
                                    <select className='uk-select' 
                                        value={supplyData.measurementClass}
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            measurementClass: e.target.value
                                        }))}>
                                        { MeasurementClasses.map(m => {
                                            return <option key={m} value={m}>{m}</option>
                                        })}
                                    </select>                                    
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Serial Number</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={supplyData.serialNumber} 
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            serialNumber: e.target.value
                                        }))}/>
                                </div>
                            </fieldset>
                        </div>

                        <div className='uk-card uk-card-default uk-card-body uk-margin-left uk-flex-1'>
                            <fieldset className='uk-fieldset'>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>DA Agent</label>
                                    <select className='uk-select' 
                                        value={supplyData.daAgent}
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            daAgent: e.target.value
                                        }))}>
                                        { AggregatorCollectors.map(m => {
                                            return <option key={m} value={m}>{m}</option>
                                        })}
                                    </select>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>DC Agent</label>
                                    <select className='uk-select' 
                                        value={supplyData.dcAgent}
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            dcAgent: e.target.value
                                        }))}>
                                        { AggregatorCollectors.map(m => {
                                            return <option  key={m} value={m}>{m}</option>
                                        })}
                                    </select>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>MO Agent</label>
                                    <select className='uk-select' 
                                        value={supplyData.moAgent}
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            moAgent: e.target.value
                                        }))}>
                                        { MeterOperators.map(m => {
                                            return <option key={m} value={m}>{m}</option>
                                        })}
                                    </select>
                                </div>

                                <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                                    <label className='uk-form-label'>Voltage</label>
                                    <label>
                                        <input 
                                            className='uk-radio' 
                                            type='radio' 
                                            name='voltage' 
                                            checked={supplyData.voltage === 'High'}
                                            onClick={()=> this.updateMeter({
                                                    ...supplyData,
                                                    voltage: 'High'
                                            }) }/> High
                                    </label>
                                    <label>
                                        <input 
                                            className='uk-radio' 
                                            type='radio' 
                                            name='voltage' 
                                            checked={supplyData.voltage === 'Low'}
                                            onClick={()=> this.updateMeter({
                                                    ...supplyData,
                                                    voltage: 'Low'
                                            }) }/> Low
                                    </label>
                                </div>

                                <div className='uk-margin uk-grid-small uk-child-width-auto uk-grid'>
                                    <label className='uk-form-label'>Connection</label>
                                    <label>
                                        <input 
                                            className='uk-radio' 
                                            type='radio' 
                                            name='connection' 
                                            checked={supplyData.connection === 'Network'}
                                            onClick={()=> this.updateMeter({
                                                    ...supplyData,
                                                    connection: 'Network'
                                            }) }/> Network
                                    </label>
                                    <label>
                                        <input 
                                            className='uk-radio' 
                                            type='radio' 
                                            name='connection' 
                                            checked={supplyData.connection === 'Substation'}
                                            onClick={()=> this.updateMeter({
                                                    ...supplyData,
                                                    connection: 'Substation'
                                            }) }/> Substation
                                    </label>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Postcode</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={supplyData.postcode} 
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            postcode: e.target.value
                                        }))}/>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Rec</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={supplyData.rec} 
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            rec: parseInt(e.target.value)
                                        }))}/>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Eac</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={supplyData.eac} 
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            eac: parseFloat(e.target.value)
                                        }))}/>
                                </div>

                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Capacity</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={supplyData.capacity} 
                                        onChange={(e => this.updateMeter({
                                            ...supplyData,
                                            capacity: parseFloat(e.target.value)
                                        }))}/>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    
                </form>
                <p className='uk-text-right'>
                    <button 
                        className='uk-button uk-button-default uk-modal-close' type='button' onClick={() => this.close()}>Close</button>                            
                </p>
            </div>
        );
    }
}


const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, MeterDetailsProps> = (dispatch) => {
    return {
        updateMeter: (meter: Meter) => dispatch(editMeter(meter)),
        cancelEditMeter: () => dispatch(cancelEditMeter())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, MeterDetailsProps> = (state: ApplicationState) => {
    return {
        meter: state.meters.meter
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(MeterDetails);