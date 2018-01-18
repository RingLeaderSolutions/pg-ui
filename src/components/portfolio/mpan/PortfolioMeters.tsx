import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails } from '../../../model/Models';
import { MeterPortfolio, Mpan, MeterType } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';
import MeterDetails from './MeterDetails';
import UploadHistoricDialog from './UploadHistoricDialog';
import UploadSupplyDataDialog from './UploadSupplyDataDialog';

import { getMeters, editMeter, cancelEditMeter } from '../../../actions/meterActions';

interface PortfolioMetersProps {
    portfolio: Portfolio;
}

interface StateProps {
    details: PortfolioDetails;
    meterPortfolio: MeterPortfolio;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    getMeters: (portfolioId: string) => void;
    editMeter: (meter: Mpan) => void;
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

    editMeter(meter: Mpan){
        this.props.editMeter(meter);
    }

    renderMeters(meters: Mpan[]){
        return meters.map((meter, index) =>{
            var supplyData = meter.meterSupplyData;
            if(supplyData == null){
                return;
            }
            
            return (
                <tr key={index} data-uk-toggle='target: #meter-modal' onClick={()=> this.editMeter(meter)}>
                    <td></td>
                    <td>{supplyData.mpanCore}</td>
                    <td>{supplyData.meterType}</td>
                    <td>{supplyData.meterTimeSwitchCode}</td>
                    <td>{supplyData.llf}</td>
                    <td>{supplyData.profileClass}</td>
                    <td>{supplyData.retrievalMethod}</td>
                    <td>{supplyData.gspGroup}</td>
                    <td>{supplyData.measurementClass}</td>
                    <td>{supplyData.serialNumber}</td>
                    <td>{supplyData.daAgent}</td>
                    <td>{supplyData.dcAgent}</td>
                    <td>{supplyData.moAgent}</td>
                    <td>{supplyData.voltage}</td>
                    <td>{supplyData.connection}</td>
                    <td>{supplyData.postcode}</td>
                    <td>{supplyData.rec}</td>
                    <td>{supplyData.eac}</td>
                    <td>{supplyData.capacity}</td>
                    <td>{supplyData.energized}</td>
                    <td>{supplyData.newConnection}</td>
                </tr>
            );
        })
    }

    renderSitesAndMeters(type: MeterType)
    {
        var sites = this.props.meterPortfolio.sites;
        return sites.map((site, index) => {
                if(site.siteCode == null){
                    return;
                }
                var isElectricity = type == MeterType.Electricity;
                //var meters = isElectricity ? this.renderMeters(site.mpans) : this.renderMeters(site.mprns);
                return (
                        <tbody key={site.siteCode}>
                            <tr>
                                <td colSpan={21}>{site.siteCode}</td>
                            </tr>
                            {this.renderMeters(site.mpans)}
                        </tbody>
                    
                )
            });
    }

    renderTable(type: MeterType) {
        if(this.props.meterPortfolio.sites.length === 0){
            return (<div>No meter data uploaded yet.</div>);
        }

        return (
            <table className='uk-table uk-table-divider meter-table'>
                <thead>
                    <tr>
                        <th>Site</th>
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
                {this.renderSitesAndMeters(type)}
            </table>
        );
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

        return (
            <div>
                <div className='uk-flex uk-flex-column portfolio-meters'>
                    <div>
                        <p className='uk-text-right'>
                            <button className='uk-button uk-button-primary uk-button-small' data-uk-toggle="target: #modal-upload-supply-data"><span data-uk-icon='icon: upload' />Supply Data</button>
                            <button className='uk-button uk-button-primary uk-button-small uk-margin-small-left' data-uk-toggle="target: #modal-upload-consumption"><span data-uk-icon='icon: upload' />Consumption</button>
                        </p>
                    </div>
                    <div id='meter-modal' className='uk-flex-top' data-uk-modal>
                        <MeterDetails portfolio={this.props.portfolio}/>
                    </div>
                    <div className="uk-overflow-auto">
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
                                {this.renderTable(MeterType.Electricity)}
                            </li>
                            <li className={this.state.tab === 'gas' ? 'uk-active' : null}>
                                {/* {this.renderTable(MeterType.Gas)} */}
                                <p>MPRN view coming soon.</p>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div id="modal-upload-supply-data" data-uk-modal="center: true">
                    <UploadSupplyDataDialog details={this.props.details} />
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
        getMeters: (portfolioId: string) => dispatch(getMeters(portfolioId)),
        editMeter: (meter: Mpan) => dispatch(editMeter(meter))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMetersProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        
        meterPortfolio: state.meters.all.value,
        working: state.meters.all.working,
        error: state.meters.all.error,
        errorMessage: state.meters.all.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters);