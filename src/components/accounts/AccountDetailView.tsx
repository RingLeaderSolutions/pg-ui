import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail, SiteDetail, HierarchyMpan, HierarchyMprn, UtilityType } from '../../model/Models';
import Spinner from '../common/Spinner';


import { retrieveAccountDetail, fetchAccountPortfolios } from '../../actions/hierarchyActions';
import UploadSupplyDataDialog from "../portfolio/mpan/UploadSupplyDataDialog";
import UpdateAccountDialog from "./UpdateAccountDialog";
import AccountContactsView from "./AccountContactsView";
import AccountDocumentsView from "./AccountDocumentsView";
import AccountUploadsView from "./AccountUploadsView";
import { Link } from "react-router-dom";

interface AccountDetailViewProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolios: any;
  account: AccountDetail;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    retrieveAccountDetail: (accountId: string) => void;
    fetchAccountPortfolios: (accountId: string) => void;
}

class AccountDetailView extends React.Component<AccountDetailViewProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    renderGasTable() {
        var portfolioButtons = this.renderPortfolioButtons();
        var content;
        if(this.props.account.sites.length === 0){
            content = (<div>No meter data has been uploaded yet.</div>);
        }
        else {
            content = (
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
                </table>)
        }

        return (
            <div>
                <p className="uk-text-right">
                {portfolioButtons}
                    <button className='uk-button uk-button-primary uk-button-small uk-margin-small-right' data-uk-toggle="target: #modal-upload-supply-data-elec"><span data-uk-icon='icon: upload' /> Upload Supply Data</button>
                </p>
                {content}
            </div>
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


    renderPortfolioButtons(){
        return Object.keys(this.props.portfolios).map(p => {
            var portfolioId = this.props.portfolios[p];
            var portfolioLink = `/portfolio/${portfolioId}`;
            return (<Link to={portfolioLink} key={portfolioId}><button className='uk-button uk-button-default uk-button-small uk-margin-small-right' data-uk-tooltip="title: Jump to portfolio"><span data-uk-icon='icon: link' /> {p}</button></Link>)
        })
    }

    renderElectricityTable() {
        var portfolioButtons = this.renderPortfolioButtons();
        var content;
        if(this.props.account.sites.length === 0){
            content = (<div>No meter data has been uploaded yet.</div>);
        }
        else {
            content = (
                <table className='uk-table uk-table-divider meter-table'>
                    <thead>
                        <tr>
                            <th>Site</th>
                            <th>Meter</th>
                            <th>Type</th>
                            <th>Topline</th>
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
                </table>)
        }

        return (
            <div>
                <p className="uk-text-right">
                    {portfolioButtons}
                    <button className='uk-button uk-button-primary uk-button-small uk-margin-small-right' data-uk-toggle="target: #modal-upload-supply-data-elec"><span data-uk-icon='icon: upload' /> Upload Supply Data</button>
                </p>
                {content}
            </div>
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
        this.props.fetchAccountPortfolios(accountId);
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
                <div className="uk-text-right">
                    <button className="uk-button uk-button-small uk-button-default uk-margin-small-right uk-margin-small-top" data-uk-toggle="target: #modal-update-account">
                        <span className="uk-margin-small-right" data-uk-icon="icon: pencil"></span>
                        Edit account
                    </button>
                </div>
                <ul data-uk-tab>
                    <li className="uk-active"><a href="#">Electricity</a></li>
                    <li><a href="#">Gas</a></li>
                    <li><a href="#">Contacts</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Uploads</a></li>
                </ul>
                <ul className="uk-switcher restrict-height-hack">
                    <li>{this.renderElectricityTable()}</li>
                    <li>{this.renderGasTable()}</li>
                    <li><AccountContactsView /></li>
                    <li><AccountDocumentsView account={this.props.account}/></li>
                    <li><AccountUploadsView accountId={this.props.account.id}/></li>
                </ul>

                <div id="modal-upload-supply-data-elec" data-uk-modal="center: true">
                    <UploadSupplyDataDialog accountId={this.props.account.id} type={UtilityType.Electricity} />
                </div>

                <div id="modal-upload-supply-data-gas" data-uk-modal="center: true">
                    <UploadSupplyDataDialog accountId={this.props.account.id} type={UtilityType.Gas} />
                </div>

                <div id="modal-update-account" data-uk-modal="center: true">
                    <UpdateAccountDialog account={selectedAccount} />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDetailViewProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),
        fetchAccountPortfolios: (accountId: string) => dispatch(fetchAccountPortfolios(accountId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDetailViewProps> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        portfolios: state.hierarchy.selected_portfolios.value,
        working: state.hierarchy.selected.working || state.hierarchy.selected_portfolios.working,
        error: state.hierarchy.selected.error || state.hierarchy.selected_portfolios.error,
        errorMessage: state.hierarchy.selected.errorMessage || state.hierarchy.selected_portfolios.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailView);