import * as React from "react";
import Header from "../../common/Header";
import CounterCard from "../../common/CounterCard";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterPortfolio, Mpan, MeterType, MeterSite } from '../../../model/Meter';
import MeterDetails from './MeterDetails';

import Spinner from '../../common/Spinner';
import * as moment from 'moment';
import UploadHistoricDialog from './UploadHistoricDialog';
import UploadSupplyDataDialog from './UploadSupplyDataDialog';
import { getMeters, editMeter, excludeMeters } from '../../../actions/meterActions';

interface ElectricityMeterTableProps {
    meterPortfolio: MeterPortfolio;
    portfolio: Portfolio;
    details: PortfolioDetails;
}

interface StateProps {
}

interface DispatchProps {
    editMeter: (meter: Mpan) => void;
    excludeMeters: (portfolioId: string, meters: string[]) => void;    
}

class ElectricityMeterTable extends React.Component<ElectricityMeterTableProps & StateProps & DispatchProps, {}> {
    editMeter(meter: Mpan){
        this.props.editMeter(meter);
    }

    excludeMeter(event: any,meter: Mpan){
        event.stopPropagation();
        var meters: string[] = [meter.meterSupplyData.mpanCore]
        this.props.excludeMeters(this.props.portfolio.id,  meters);
    }

    renderTable() {
        if(this.props.meterPortfolio.sites.length === 0){
            return (<div>No meter data uploaded yet.</div>);
        }

        return (
            <table className='uk-table uk-table-divider meter-table'>
                <thead>
                    <tr>
                        <th>Site</th>
                        <th>Meter</th>
                        <th>Historical</th>
                        <th>Type</th>
                        <th>Topline</th>
                        <th>Retrieval</th>
                        <th>GSP</th>
                        <th>Measurement</th>
                        <th>S/N</th>
                        <th>DA</th>
                        <th>DC</th>
                        <th>MO</th>
                        <th>Voltage</th>
                        <th>Connection</th>
                        <th>Postcode</th>
                        <th>REC</th>
                        <th>EAC</th>
                        <th>Capacity</th>
                        <th>Energised</th>
                        <th>New Conn.</th>
                    </tr>
                </thead>
                {this.renderSitesAndMeters()}
            </table>
        );
    }

    renderSitesAndMeters()
    {
        var orderedSites = this.props.meterPortfolio.sites.sort(
            (site1: MeterSite, site2: MeterSite) => {
                let lowerFirst = site1.siteCode.toLowerCase();
                let lowerSecond = site2.siteCode.toLowerCase();
        
                if (lowerFirst < lowerSecond) return -1;
                if (lowerFirst > lowerSecond) return 1;
                return 0;
            });

        return orderedSites.map((site, index) => {
                if(site.siteCode == null || site.mprns == null || site.mpans.length == 0){
                    return;
                }
                return (
                        <tbody key={site.siteCode}>
                            {this.renderMeters(site.siteCode, site.mpans)}
                        </tbody>
                    
                )
            });
    }

    renderMeters(siteCode: string, meters: Mpan[]){
        return meters.map((meter, index) =>{
            var supplyData = meter.meterSupplyData;
            if(supplyData == null){
                return;
            }
            var hasHistorical = meter.halfHourly != null;
            var toplineTooltip = `title: Profile: ${supplyData.profileClass} / MTC: ${supplyData.meterTimeSwitchCode} / LLF: ${supplyData.llf}`;
            return (
                <tr key={index}>
                    <td>{index == 0 ? siteCode : null}</td>
                    <td>{supplyData.mpanCore}</td>
                    <td>{hasHistorical ? (
                        <span className="icon-standard-cursor" data-uk-tooltip="title: Uploaded" data-uk-icon="icon: check"></span>
                    ) : 
                    (
                        <span className="icon-standard-cursor" data-uk-tooltip="title: Not processed" data-uk-icon="icon: close"></span>
                    )}</td>
                    <td>{supplyData.meterType}</td>
                    <td className="uk-text-nowrap" data-uk-tooltip={toplineTooltip} >{supplyData.profileClass} {supplyData.meterTimeSwitchCode} {supplyData.llf}</td>
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
                    <td>{supplyData.energized ? "Yes" : "No"}</td>
                    <td>{supplyData.newConnection ? "Yes" : "No"}</td>
                    <td>
                        <button className='uk-button uk-button-default uk-button-small' data-uk-toggle='target: #meter-modal' onClick={()=> this.editMeter(meter)}><span data-uk-icon='icon: settings' data-uk-tooltip="title: Edit" /></button>
                    </td>
                    <td>
                        <button className='uk-button uk-button-default uk-button-small' onClick={(ev) => this.excludeMeter(ev, meter)}><span data-uk-icon='icon: close' data-uk-tooltip="title: Exclude" /></button>
                    </td>
                </tr>
            );
        })
    }

    render() {
        return (
        <div>
            <div>
                <p className='uk-text-right'>
                    <button className='uk-button uk-button-primary uk-button-small' data-uk-toggle="target: #modal-upload-supply-data"><span data-uk-icon='icon: upload' />Upload Supply Data</button>
                    <button className='uk-button uk-button-primary uk-button-small uk-margin-small-left uk-margin-small-right' data-uk-toggle="target: #modal-upload-consumption"><span data-uk-icon='icon: upload' />Upload Historic Consumption</button>
                </p>
            </div>
            {this.renderTable()}

            <div id='meter-modal' className='uk-flex-top' data-uk-modal>
                <MeterDetails portfolio={this.props.portfolio}/>
            </div>

            <div id="modal-upload-supply-data" data-uk-modal="center: true">
                <UploadSupplyDataDialog details={this.props.details} type={UtilityType.Electricity} />
            </div>
            <div id="modal-upload-consumption" data-uk-modal="center: true">
                <UploadHistoricDialog details={this.props.details} />
            </div>
        </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, ElectricityMeterTableProps> = (dispatch) => {
    return {
        editMeter: (meter: Mpan) => dispatch(editMeter(meter)),
        excludeMeters: (portfolioId: string, meters: string[]) => dispatch(excludeMeters(portfolioId, meters))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, ElectricityMeterTableProps> = (state: ApplicationState) => {
    return {
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ElectricityMeterTable);