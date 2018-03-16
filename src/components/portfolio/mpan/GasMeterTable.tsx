import * as React from "react";
import Header from "../../common/Header";
import CounterCard from "../../common/CounterCard";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterPortfolio, Mprn, MeterType, MeterSite } from '../../../model/Meter';
import MeterDetails from './MeterDetails';
import UploadSupplyDataDialog from './UploadSupplyDataDialog';

import Spinner from '../../common/Spinner';
import * as moment from 'moment';
import { excludeMeters } from '../../../actions/meterActions';

interface GasMeterTableProps {
    meterPortfolio: MeterPortfolio;
    portfolio: Portfolio;
    details: PortfolioDetails;
}

interface StateProps {
}

interface DispatchProps {
    excludeMeters: (portfolioId: string, meters: string[]) => void;    
}

class GasMeterTable extends React.Component<GasMeterTableProps & StateProps & DispatchProps, {}> {
    
    excludeMeter(event: any, meter: Mprn){
        event.preventDefault();
        var meters: string[] = [meter.meterSupplyData.mprnCore]
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
                        <th>Serial Number</th>
                        <th>Current Contract Ends</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Size</th>
                        <th>AQ</th>
                        <th>Change of Use</th>
                        <th>Is Imperial</th>
                        <th>Address</th>
                        <th>Postcode</th>
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
                if(site.siteCode == null || site.mprns == null || site.mprns.length == 0){
                    return;
                }
                return (
                        <tbody key={site.siteCode}>
                            {this.renderMeters(site.siteCode, site.mprns)}
                        </tbody>
                    
                )
            });
    }

    renderMeters(siteCode: string, meters: Mprn[]){
        return meters.map((meter, index) =>{
            var supplyData = meter.meterSupplyData;
            if(supplyData == null){
                return;
            }
            
            return (
                <tr key={index}>
                    <td>{index == 0 ? siteCode : null}</td>
                    <td>{supplyData.mprnCore}</td>
                    <td>{supplyData.serialNumber}</td>
                    <td>{supplyData.currentContractEnd}</td>
                    <td>{supplyData.make}</td>
                    <td>{supplyData.model}</td>
                    <td>{supplyData.size}</td>
                    <td>{supplyData.aQ}</td>
                    <td>{supplyData.changeOfUse  ? "Yes" : "No"}</td>
                    <td>{supplyData.imperial  ? "Yes" : "No"}</td>
                    <td>{supplyData.address}</td>
                    <td>{supplyData.postcode}</td>
                    <td>
                        <button className='uk-button uk-button-default uk-button-small' data-uk-toggle="target: #modal-upload-supply-data" onClick={(ev) => this.excludeMeter(ev, meter)}><span data-uk-icon='icon: close' data-uk-tooltip="title: Exclude" /></button>
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
                    <button className='uk-button uk-button-primary uk-button-small uk-margin-small-right' data-uk-toggle="target: #modal-upload-supply-data"><span data-uk-icon='icon: upload' />Upload Supply Data</button>
                </p>
            </div>
            {this.renderTable()}
            
            <div id='meter-modal' className='uk-flex-top' data-uk-modal>
                <MeterDetails portfolio={this.props.portfolio}/>
            </div>

            <div id="modal-upload-supply-data" data-uk-modal="center: true">
                <UploadSupplyDataDialog details={this.props.details} type={UtilityType.Gas} />
            </div>
        </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, GasMeterTableProps> = (dispatch) => {
    return {
        excludeMeters: (portfolioId: string, meters: string[]) => dispatch(excludeMeters(portfolioId, meters))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, GasMeterTableProps> = (state: ApplicationState) => {
    return {
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(GasMeterTable);