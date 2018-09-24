import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { getPortfolioTenders } from '../../../actions/tenderActions';
import { Tender } from "../../../model/Tender";
import TenderView from "./TenderView";
import { selectPortfolioTenderTab, openModalDialog } from "../../../actions/viewActions";
import ModalDialog from "../../common/ModalDialog";
import CreateTenderDialog from "./CreateTenderDialog";
import { TenderUtilityIconTabHeader, UtilityIcon } from "../../common/UtilityIcon";
import { fetchMeterConsumption } from "../../../actions/meterActions";
import { MeterConsumptionSummary } from "../../../model/Meter";

interface TenderSummaryProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  consumption: MeterConsumptionSummary;
  tenders: Tender[];
  working: boolean;
  error: boolean;
  errorMessage: string;
  selectedTab: number;
}

interface TenderSummaryState {
    tenderMap: Map<number, Tender>;
}

interface DispatchProps {
    getPortfolioTenders: (portfolioId: string) => void;
    selectPortfolioTenderTab: (index: number) => void;
    openModalDialog: (dialogId: string) => void;
    fetchMeterConsumption: (portfolioId: string) => void;    
}

class TenderSummary extends React.Component<TenderSummaryProps & StateProps & DispatchProps, TenderSummaryState> {
    constructor(){
        super();
        this.state = {
            tenderMap: new Map<number, Tender>()
        }
    }

    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.getPortfolioTenders(portfolioId);
        this.props.fetchMeterConsumption(portfolioId);      
    }

    componentWillReceiveProps(nextProps: TenderSummaryProps & StateProps & DispatchProps){
        if(nextProps.portfolio.id != this.props.portfolio.id){
            this.props.getPortfolioTenders(nextProps.portfolio.id);
            return;
        }

        if(nextProps.tenders == null){
            return;
        }
        
        var hh = nextProps.tenders.find(o => o.halfHourly && o.utility == "ELECTRICITY");
        var nhh = nextProps.tenders.find(o => !o.halfHourly && o.utility == "ELECTRICITY");
        var gas = nextProps.tenders.find(o => o.utility == "GAS");

        var tenderMap = new Map<number, Tender>();
        tenderMap.set(0, hh);
        tenderMap.set(1, nhh);
        tenderMap.set(2, gas);

        this.setState({
            tenderMap
        });

        var intendedTender = tenderMap.get(this.props.selectedTab);
        if(intendedTender == null){
            for (var [key, value] of tenderMap.entries()){
                if(value){
                    // reset the tab to the first one we find
                    this.props.selectPortfolioTenderTab(key);
                    break;
                }
            }
        }
    }

    renderContent(content: any){
        return (
            <div className="content-tenders">
                {this.renderTabStrip()}
                {content}
                <ModalDialog dialogId="create_hh_tender">
                    <CreateTenderDialog portfolioId={this.props.details.portfolio.id} utility={UtilityType.Electricity} utilityDescription="HH Electricity" isHalfHourly={true} />
                </ModalDialog>
                <ModalDialog dialogId="create_nhh_tender">
                    <CreateTenderDialog portfolioId={this.props.details.portfolio.id} utility={UtilityType.Electricity} utilityDescription="NHH Electricity" isHalfHourly={false} />
                </ModalDialog>
                <ModalDialog dialogId="create_gas_tender">
                    <CreateTenderDialog portfolioId={this.props.details.portfolio.id} utility={UtilityType.Gas} utilityDescription="Gas" isHalfHourly={false}/>
                </ModalDialog>
            </div>
        )
    }
    
    selectTab(index: number){
        this.props.selectPortfolioTenderTab(index);
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    renderSelectedTender(){
        var intendedTender = this.state.tenderMap.get(this.props.selectedTab);
        if(intendedTender == null){
            return (<ErrorMessage content="Error rendering this component" />)
        }

        var utility = intendedTender.utility == "ELECTRICITY" ? UtilityType.Electricity : UtilityType.Gas;

        return (<TenderView tender={intendedTender} details={this.props.details} utility={utility} />);
    }
    
    getTenderCreationContent(tenderTypeIndex: number){
        switch(tenderTypeIndex){
            case 0:
                return (
                    <a href="#" onClick={() => this.props.openModalDialog("create_hh_tender")}>
                        <UtilityIcon utility="hh" iconClass="uk-margin-small-right">Add HH Tender</UtilityIcon>
                    </a>);
            case 1:
                return (
                    <a href="#" onClick={() => this.props.openModalDialog("create_nhh_tender")}>
                        <UtilityIcon utility="nhh" iconClass="uk-margin-small-right">Add NHH Tender</UtilityIcon>
                    </a>);
            case 2:
                return (
                    <a href="#" onClick={() => this.props.openModalDialog("create_gas_tender")}>
                        <UtilityIcon utility="gas" iconClass="uk-margin-small-right">Add Gas Tender</UtilityIcon>
                    </a>);
            default:
                throw new RangeError(`No valid tender type for index [${tenderTypeIndex}]`);
        }
    }

    checkHasMeters(tenderTypeIndex: number){
        var meterDetails = this.props.consumption;
        var hasElectricityMeters = meterDetails.electrictyConsumptionEntries.length > 0;
        switch(tenderTypeIndex){
            case 0:
                return hasElectricityMeters && meterDetails.electrictyConsumptionEntries.filter(arr => arr[2] == "HH").length > 0;
            case 1:
                return hasElectricityMeters && meterDetails.electrictyConsumptionEntries.filter(arr => arr[2] == "NHH").length > 0;
            case 2:
                return meterDetails.gasConsumptionEntries.length > 0;
            default:
                throw new RangeError(`No valid tender type for index [${tenderTypeIndex}]`);
        }
    }

    renderTabStrip(){
        var tabs = []
        var creationOptions = [];

        for(let i = 0; i < 3; i++){
            let tender = this.state.tenderMap.get(i);

            if(tender == null) {
                if(!this.checkHasMeters(i)){
                    // if we don't have a tender, but there also isn't any included meters of this type, don't add the creation option or the tab
                    continue;
                }

                if(creationOptions.length > 0){
                    creationOptions.push(<li key={creationOptions.length} className="uk-nav-divider"></li>);
                }
                
                var creationContent = this.getTenderCreationContent(i);
                creationOptions.push(<li key={creationOptions.length}>{creationContent}</li>)
                continue;
            }

            let tab = (<li key={i} className={this.renderActiveTabStyle(i)} onClick={() => this.selectTab(i)}><a href='#'><TenderUtilityIconTabHeader tender={tender} /></a></li>);
            tabs.push(tab);
        }

        var canCreate = creationOptions.length > 0;
        return (
            <div data-uk-grid>
                <div className="uk-width-expand">
                    <ul className="uk-tab" data-uk-tab="connect: #tender-tab-switcher">
                        {tabs}
                    </ul>
                </div>
                {canCreate ? (<div className="uk-grid-1-10 uk-margin-right">
                    <div className="uk-inline">
                        <button className="uk-button uk-button-primary uk-button-small" type="button">
                            <i className="fa fa-plus-circle uk-margin-small-right fa-lg"></i>
                            Add Tender
                        </button>
                        <div data-uk-dropdown="mode:click">
                            <ul className="uk-nav uk-dropdown-nav">
                                {creationOptions}
                            </ul>
                        </div>
                    </div>
                </div>) : null}
            </div>);
    }

    render() {
        if(this.props.error){
            var error = (<ErrorMessage content={this.props.errorMessage} />);
            return this.renderContent(error);
        }
        if(this.props.working || this.props.details == null || this.props.consumption == null){
            return (<div><Spinner hasMargin /></div>)
        }
        if(this.props.details.portfolio.status != "tender"){
            var finishSetup = (
                <div className="uk-alert-default uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p><i className="fas fa-info-circle uk-margin-small-right"></i>This portfolio isn't ready to tender yet. Please upload data for applicable meters and ensure portfolio setup is complete.</p>
                </div>)
            return this.renderContent(finishSetup);
        }
        if(this.props.tenders == null || this.props.tenders.length == 0){
            var noTendersMessage = (
                <div className="uk-alert-default uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p><i className="fas fa-info-circle uk-margin-small-right"></i>Click on the "Add Tender" button above to add your first tender.</p>
                </div>)
            return this.renderContent(noTendersMessage);
        }

        var content = (
            <div>
                <div>
                    {this.renderSelectedTender()}
                </div>
            </div>
        );
        return this.renderContent(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderSummaryProps> = (dispatch) => {
    return {
        getPortfolioTenders: (portfolioId: string) => dispatch(getPortfolioTenders(portfolioId)),
        selectPortfolioTenderTab: (index: number) => dispatch(selectPortfolioTenderTab(index)),
        fetchMeterConsumption: (portfolioId: string) => dispatch(fetchMeterConsumption(portfolioId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderSummaryProps, ApplicationState> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        tenders: state.portfolio.tender.tenders.value,
        working: state.portfolio.tender.tenders.working || state.portfolio.details.working || state.meters.consumption.working,
        error: state.portfolio.tender.tenders.error || state.portfolio.details.error || state.meters.consumption.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage || state.portfolio.details.errorMessage || state.meters.consumption.errorMessage,
        selectedTab: state.view.portfolio.tender.selectedIndex,
        consumption: state.meters.consumption.value,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderSummary);