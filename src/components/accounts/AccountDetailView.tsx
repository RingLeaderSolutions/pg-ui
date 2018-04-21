import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio, AccountDetail, SiteDetail, HierarchyMpan, HierarchyMprn } from '../../model/Models';
import Spinner from '../common/Spinner';


import { retrieveAccountDetail } from '../../actions/hierarchyActions';

interface AccountDetailViewProps extends RouteComponentProps<void> {
}

interface StateProps {
  account: AccountDetail;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    retrieveAccountDetail: (accountId: string) => void;
}

class AccountDetailView extends React.Component<AccountDetailViewProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    renderGasTable() {
        if(this.props.account.sites.length === 0){
            return (<div>No meter data uploaded yet.</div>);
        }

        return (
            <table className='uk-table uk-table-divider meter-table'>
                <thead>
                    <tr>
                        <th>Site</th>
                        <th>Meter</th>
                        <th>Serial Number</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Size</th>
                        <th>AQ</th>
                        <th>Change of Use</th>
                        <th>Is Imperial</th>
                    </tr>
                </thead>
                {this.renderSitesAndMeters()}
            </table>
        );
    }

    renderSitesAndMeters()
    {
        var orderedSites = this.props.account.sites.sort(
            (site1: SiteDetail, site2: SiteDetail) => {
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

    renderMeters(siteCode: string, meters: HierarchyMprn[]){
        return meters.map((meter, index) =>{
            return (
                <tr key={index}>
                    <td>{index == 0 ? siteCode : null}</td>
                    <td>{meter.mprnCore}</td>
                    <td>{meter.serialNumber}</td>
                    <td>{meter.make}</td>
                    <td>{meter.model}</td>
                    <td>{meter.size}</td>
                    <td>{meter.aq}</td>
                    <td>{meter.changeOfUse  ? "Yes" : "No"}</td>
                    <td>{meter.isImperial  ? "Yes" : "No"}</td>
                </tr>
            );
        })
    }


    renderElectricityTable() {
        if(this.props.account.sites.length === 0){
            return (<div>No meter data uploaded yet.</div>);
        }

        return (
            <table className='uk-table uk-table-divider meter-table'>
                <thead>
                    <tr>
                        <th>Site</th>
                        <th>Meter</th>
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
                {this.renderSitesAndMpans()}
            </table>
        );
    }

    renderSitesAndMpans()
    {
        var orderedSites = this.props.account.sites.sort(
            (site1: SiteDetail, site2: SiteDetail) => {
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
                            {this.renderMpans(site.siteCode, site.mpans)}
                        </tbody>
                    
                )
            });
    }

    renderMpans(siteCode: string, meters: HierarchyMpan[]){
        return meters.map((meter, index) =>{
            var toplineTooltip = `title: Profile: ${meter.profileClass} / MTC: ${meter.meterTimeSwitchCode} / LLF: ${meter.llf}`;
            return (
                <tr key={index}>
                    <td>{index == 0 ? siteCode : null}</td>
                    <td>{meter.mpanCore}</td>
                    <td>{meter.meterType}</td>
                    <td className="uk-text-nowrap" data-uk-tooltip={toplineTooltip} >{meter.profileClass} {meter.meterTimeSwitchCode} {meter.llf}</td>
                    <td>{meter.retrievalMethod}</td>
                    <td>{meter.gspGroup}</td>
                    <td>{meter.measurementClass}</td>
                    <td>{meter.serialNumber}</td>
                    <td>{meter.daAgent}</td>
                    <td>{meter.dcAgent}</td>
                    <td>{meter.moAgent}</td>
                    <td>{meter.voltage}</td>
                    <td>{meter.connection}</td>
                    <td>{meter.postcode}</td>
                    <td>{meter.rec}</td>
                    <td>{meter.eac}</td>
                    <td>{meter.capacity}</td>
                    <td>{meter.isEnergized ? "Yes" : "No"}</td>
                    <td>{meter.isNewConnection ? "Yes" : "No"}</td>
                </tr>
            );
        })
    }

    componentDidMount(){
        var accountId = this.props.location.pathname.split('/')[2];        
        this.props.retrieveAccountDetail(accountId);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<Spinner />);
        }
        var selectedAccount = this.props.account;
        var headerTitle = `Account: ${selectedAccount.companyName}`;
        return (
            <div className="content-inner">
                <Header title={headerTitle} />
                <ul data-uk-tab>
                    <li className="uk-active"><a href="#">Electricity</a></li>
                    <li><a href="#">Gas</a></li>
                </ul>
                <ul className="uk-switcher restrict-height-hack">
                    <li>{this.renderElectricityTable()}</li>
                    <li>{this.renderGasTable()}</li>
                </ul>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDetailViewProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDetailViewProps> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailView);