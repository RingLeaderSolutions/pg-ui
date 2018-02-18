import * as React from "react";
import Header from "../../common/Header";
import CounterCard from "../../common/CounterCard";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterPortfolio, Mprn, MeterType } from '../../../model/Meter';
import MeterDetails from './MeterDetails';
import UploadSupplyDataDialog from './UploadSupplyDataDialog';

import Spinner from '../../common/Spinner';
import * as moment from 'moment';

interface GasMeterTableProps {
    meterPortfolio: MeterPortfolio;
    portfolio: Portfolio;
    details: PortfolioDetails;
}

interface StateProps {
}

interface DispatchProps {
}

class GasMeterTable extends React.Component<GasMeterTableProps & StateProps & DispatchProps, {}> {
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
                        <th>Utility</th>
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
        var sites = this.props.meterPortfolio.sites;
        return sites.map((site, index) => {
                if(site.siteCode == null || site.mprns == null || site.mprns.length == 0){
                    return;
                }
                return (
                        <tbody key={site.siteCode}>
                            <tr>
                                <td colSpan={21}>{site.siteCode}</td>
                            </tr>
                            {this.renderMeters(site.mprns)}
                        </tbody>
                    
                )
            });
    }

    renderMeters(meters: Mprn[]){
        return meters.map((meter, index) =>{
            var supplyData = meter.meterSupplyData;
            if(supplyData == null){
                return;
            }
            
            return (
                <tr key={index}>
                    <td></td>
                    <td>{supplyData.mprnCore}</td>
                    <td>{supplyData.serialNumber}</td>
                    <td>{supplyData.currentContractEnd}</td>
                    <td>{supplyData.make}</td>
                    <td>{supplyData.model}</td>
                    <td>{supplyData.size}</td>
                    <td>{supplyData.utility}</td>
                    <td>{supplyData.aQ}</td>
                    <td>{supplyData.changeOfUse}</td>
                    <td>{supplyData.imperial}</td>
                    <td>{supplyData.address}</td>
                    <td>{supplyData.postcode}</td>
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
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, GasMeterTableProps> = (state: ApplicationState) => {
    return {
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(GasMeterTable);