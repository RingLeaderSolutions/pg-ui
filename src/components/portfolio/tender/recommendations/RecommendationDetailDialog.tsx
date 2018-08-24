import * as React from "react";
import ErrorMessage from "../../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import Spinner from '../../../common/Spinner';
import { format } from 'currency-formatter';
import * as moment from 'moment';
import { fetchRecommendationsSites } from '../../../../actions/tenderActions';

import { Tender, RecommendationSite, RecommendationSupplier, RecommendationSummary, TenderRecommendation, TenderSupplier } from "../../../../model/Tender";
import { closeModalDialog } from "../../../../actions/viewActions";
import CounterCard from "../../../common/CounterCard";

interface RecommendationDetailDialogProps {
    tender: Tender;
}

interface StateProps {
    selected_recommendation: TenderRecommendation;
    recommendation_summary: RecommendationSummary;
    recommendation_sites: RecommendationSite[];
    recommendation_suppliers: RecommendationSupplier[];
    working: boolean;
    sites_working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}

interface DispatchProps {
    closeModalDialog: () => void;
    getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => void;
}

interface RecommendationDetailDialogState {
    currentSiteStart: number;
    currentSiteEnd: number;
}

class RecommendationDetailDialog extends React.Component<RecommendationDetailDialogProps & StateProps & DispatchProps, RecommendationDetailDialogState> {
    constructor(props: RecommendationDetailDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            currentSiteStart: 0,
            currentSiteEnd: 4
        }
    }

    componentWillReceiveProps(nextProps: RecommendationDetailDialogProps & StateProps & DispatchProps){
        var currentRecommendation = this.props.selected_recommendation;
        var newRecommendation = nextProps.selected_recommendation;

        if(newRecommendation == null){
            this.setState({
                currentSiteStart: 0,
                currentSiteEnd: 4
            });
            return;
        }

        if(currentRecommendation == null || currentRecommendation.summaryId != newRecommendation.summaryId){
            var siteEnd = 4;
            if(newRecommendation.meterCount - 1 < siteEnd){
                siteEnd = newRecommendation.meterCount;
            }

            this.setState({
                currentSiteStart: 0,
                currentSiteEnd: siteEnd
            });
            this.props.getRecommendationSites(nextProps.tender.tenderId, newRecommendation.summaryId, 0, siteEnd);
        }
    }

    canGetNextSites() : boolean{
        var maxSitePosition = this.props.selected_recommendation.meterCount - 1;
        // If we're already at the end, we can't go any further forward
        if(this.state.currentSiteEnd == maxSitePosition){
            return false;
        }
        return true;
    }

    canGetPreviousSites(): boolean {
        // If we're at the beginning, we can't go any further back
        if(this.state.currentSiteStart == 0){
            return false;
        }
        return true;
    }

    getPreviousSites(){
        var siteStart = this.state.currentSiteStart - 5;
        var siteEnd = this.state.currentSiteStart - 1;

        if(siteStart < 0){
            siteStart = 0;
        }

        this.props.getRecommendationSites(this.props.tender.tenderId, this.props.recommendation_summary.summaryId, siteStart, siteEnd);
        
        this.setState({
            currentSiteStart: siteStart,
            currentSiteEnd: siteEnd,
        });
    }

    getNextSites(){
        var siteStart = this.state.currentSiteEnd + 1;
        var siteEnd = this.state.currentSiteEnd + 5;

        var maxSitePosition = this.props.selected_recommendation.meterCount - 1;
        if(siteStart > maxSitePosition){
            siteStart = this.state.currentSiteEnd + 1;
        }
        if(siteEnd > maxSitePosition){
            siteEnd = maxSitePosition;
        }

        this.props.getRecommendationSites(this.props.tender.tenderId, this.props.recommendation_summary.summaryId, siteStart, siteEnd);
        
        this.setState({
            currentSiteStart: siteStart,
            currentSiteEnd: siteEnd,
        });
    }

    renderContent(content: any){
        return (<div>
            <div className="uk-modal-header">
                <h2 className="uk-modal-title">View Recommendation</h2>
            </div>
            <div className="uk-modal-body">
                {content}
            </div>
            <div className="uk-modal-footer uk-text-right">
                <button className="uk-button uk-button-default uk-margin-right" type="button"  onClick={() => this.props.closeModalDialog()}>OK</button>
            </div>
        </div>);
    }

    renderSiteTabContent(recommendationSite: RecommendationSite){
        var receivedOfferRows = recommendationSite.siteOffersList.map(ru => {
            var supplier = this.props.suppliers.find(su => su.supplierId == ru.supplierId);
            var supplierText = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ width: "70px"}}/>);

            var previousDiffPercentage = ru.previousPercentageDifference * 100;
            var adriftPercentage = ru.adriftPercentage * 100;
            var isWinningOffer = ru.winner;
            return (
                <tr key={ru.ranking}>
                    <td>{`#${ru.ranking + 1}`}</td>
                    <td>{isWinningOffer ?  (<div><span className="uk-margin-small-right" data-uk-icon="icon: star" style={{color: 'goldenrod'}} /> {supplierText}</div>) : supplierText}</td>
                    <td>{`${ru.duration} months`}</td>
                    <td>{format(ru.totalIncCCL, { locale: 'en-GB'})}</td>
                    <td>{format(ru.cclCost, { locale: 'en-GB'})}</td>
                    <td>{`${ru.appu.toFixed(4)}p`}</td>
                    {this.renderCostCell(ru.previousAmountDifference, format(ru.previousAmountDifference, { locale: 'en-GB'}))}
                    {this.renderCostCell(previousDiffPercentage, `${previousDiffPercentage.toFixed(2)}%`)}
                    {isWinningOffer ? (<td>-</td>) : this.renderCostCell(ru.adriftAmount, format(ru.adriftAmount, { locale: 'en-GB'}))}
                    {isWinningOffer ? (<td>-</td>) : this.renderCostCell(adriftPercentage, `${adriftPercentage.toFixed(2)}%`)}
                </tr>
            )
        })

        var billingRatesRows = recommendationSite.recommendedBillingRates.yearlyRates.map((yearlyRate, index) => {
            if(yearlyRate.total){
                return (
                    <tr key={index}>
                        <td />
                        <td />
                        <td />
                        <td><strong>Total</strong></td>
                        <td><strong>{yearlyRate.uom}{yearlyRate.formattedAmount}</strong></td>
                        <td></td>
                    </tr>
                )
            }
            var monthlyRate = recommendationSite.recommendedBillingRates.monthlyRates[index];
            return (
                <tr key={index}>
                    <td>{monthlyRate.title}</td>
                    <td>{monthlyRate.formattedAmount}</td>
                    <td>{monthlyRate.uom}</td>
                    <td></td>
                    <td>{yearlyRate.formattedAmount}</td>
                    <td>{yearlyRate.uom}</td>
                </tr>
            )
        })

        var percentageChange = recommendationSite.recommendedSiteOffer.percentageChange * 10;
        var currentSupplier = this.props.suppliers.find(su => su.supplierId == recommendationSite.currentContract.supplierId);
        var currentSupplierText = currentSupplier == null ? (<h4><strong>Unknown</strong></h4>) : (<img src={currentSupplier.logoUri} style={{ width: "70px"}}/>);

        var newSupplier = this.props.suppliers.find(su => su.supplierId == recommendationSite.recommendedSiteOffer.supplierId);
        var newSupplierText = newSupplier == null ? (<h4><strong>Unknown</strong></h4>) : (<img src={newSupplier.logoUri} style={{ width: "70px"}}/>);

        return (
            <div key={recommendationSite.siteCode}>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title={recommendationSite.siteCode} label="Site Code" small/>
                    <CounterCard title={recommendationSite.siteName} label="Site Name" small/>
                    <CounterCard title={recommendationSite.billingAddress} label="Billing Address" small/>
                    <CounterCard title={recommendationSite.supplierAddress} label="Supplier Address" small/>
                </div>
                <h3>Existing Contract</h3>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard content={currentSupplierText} label="Current Supplier" small/>
                    <CounterCard title={format(recommendationSite.currentContract.totalIncCCL, { locale: 'en-GB'})} label="Comparative total cost inc CCL" small/>
                    <CounterCard title={format(recommendationSite.currentContract.ccl, { locale: 'en-GB'})} label="CCL" small/>
                    <CounterCard title={`${recommendationSite.currentContract.appu.toFixed(4)}p`} label="Avg Pence Per Unit" small />
                </div>
                <h3><span className="uk-margin-small-right" data-uk-icon="icon: star" style={{color: 'goldenrod'}}/>Recommended Supplier Offer</h3>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard content={newSupplierText} label="New Supplier" small/>
                    <CounterCard title={format(recommendationSite.recommendedSiteOffer.totalIncCCL, { locale: 'en-GB'})} label="Annual cost inc CCL" small/>
                    <CounterCard title={`${percentageChange.toFixed(2)}%`} label="Percentage change" small />
                    <CounterCard title={recommendationSite.recommendedSiteOffer.startDate} label="Start Date" small/>
                    <CounterCard title={recommendationSite.recommendedSiteOffer.endDate} label="End Date" small/>
                    <CounterCard title={`${recommendationSite.recommendedSiteOffer.paymentTerms} days`} label="Payment Terms" small/>
                    <CounterCard title={recommendationSite.recommendedSiteOffer.fuelType} label="Fuel Type" small/>
                </div>
                <h3><span className="uk-margin-small-right" data-uk-icon="icon: star" style={{color: 'goldenrod'}}/>Recommended Supplier Offer Billing Rates</h3>
                <div className="uk-grid" style={{backgroundColor: '#f8f8f8', marginLeft: '0'}}>
                    <div className="uk-width-expand" />
                    <table className="uk-table uk-table-divider uk-width-auto">
                        <thead>
                            <tr>
                                <th>Monthly / Quarterly Charges</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Annual Charges</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingRatesRows}
                        </tbody>
                    </table>
                    <div className="uk-width-expand" />
                </div>
                <h3>Offers received</h3>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>Supplier</th>
                            <th>Duration</th>
                            <th>Annual Cost inc CCL</th>
                            <th>CCL</th>
                            <th>Average pence per unit</th>
                            <th>£ Increase or Saving (-)</th>
                            <th>% Increase or Saving (-)</th>
                            <th>£ Adrift of Offer Ranked #1</th>
                            <th>% Adrift of Offer Ranked #1</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receivedOfferRows}
                    </tbody>
                </table>
            </div>
        )
    }

    renderSiteTabs(){
        if(this.props.sites_working || this.props.recommendation_sites == null){
            return (<div className="uk-margin-top"><Spinner hasMargin={true}/></div>);
        }
        var tabs: any = [];
        var tabContent: any = [];
        
        this.props.recommendation_sites
            .sort(
                (rs1: RecommendationSite, rs2: RecommendationSite) => {        
                    if (rs1.siteCode < rs2.siteCode) return -1;
                    if (rs1.siteCode > rs2.siteCode) return 1;
                    return 0;
                })
            .map((rs, index) => {
                    var tooltip = `title: ${rs.siteName}`;
                    var tab = (<li key={index} data-uk-tooltip={tooltip}><a href="#">{rs.siteCode}</a></li>);
                    tabs[index] = tab;

                    var content = this.renderSiteTabContent(rs);
                    tabContent[index] = content;
            });

        var previousIsDisabled = !this.canGetPreviousSites();
        var nextIsDisabled = !this.canGetNextSites();
        return (
            <div className="uk-margin-top">
                <div className="uk-text-center uk-margin-top uk-margin-bottom">
                    <p className="uk-text-meta">Viewing sites {this.state.currentSiteStart + 1}-{this.state.currentSiteEnd + 1} of {this.props.selected_recommendation.meterCount}</p>
                </div>
                <div data-uk-grid>
                    <div className="uk-grid-width-1-10">
                        <button className="uk-button uk-button-small uk-button-default" type="button" onClick={() => this.getPreviousSites()} disabled={previousIsDisabled}><span className={previousIsDisabled ? "icon-standard-cursor" : null} data-uk-icon="icon: chevron-left" /></button>
                    </div>
                    <div className="uk-width-expand">
                        <ul data-uk-tab="connect: #sites-tab-switcher">
                            {tabs}
                        </ul>
                    </div>
                    <div className="uk-grid-width-1-10">
                        <button className="uk-button uk-button-small uk-button-default" type="button" onClick={() => this.getNextSites()}  disabled={nextIsDisabled}><span className={nextIsDisabled ? "icon-standard-cursor" : null} data-uk-icon="icon: chevron-right"/></button>
                    </div>
                </div>
                <hr />
                <ul id="sites-tab-switcher" className="uk-switcher uk-margin-top">
                    {tabContent}
                </ul>
            </div>
        )
    }

    renderSupplierTabContent(index: number, recommendationSupplier: RecommendationSupplier){
        var backingSheetsContent = recommendationSupplier.backingsheets.map((bs, index) => {
            var bsFields = bs.map((f,findex) => (<td key={findex}>{f}</td>));
            return (<tr key={index}>{bsFields}</tr>)
        });

        var backingSheetsHeaders = recommendationSupplier.backingsheetTitles.map((bst, index) => {
            return (<th key={index}>{bst}</th>)
        });

        var isIncumbent = recommendationSupplier.incumbentContract;

        var supplier = this.props.suppliers.find(su => su.supplierId == recommendationSupplier.supplierId);
        var supplierText = supplier == null ? (<h4><strong>Unknown</strong></h4>) : (<img src={supplier.logoUri} style={{ width: "70px"}}/>);

        return (
            <div key={index}>
                <div>
                    {!isIncumbent ? (<div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                        <CounterCard content={supplierText} label="Supplier" small/>
                        <CounterCard title={`${recommendationSupplier.duration} months`} label="Duration" small/>
                        <CounterCard title={String(recommendationSupplier.version)} label="Version" small/>
                        <CounterCard title={recommendationSupplier.winner ? "Yes" : "No"} label="Winning Offer" small/>
                    </div>) : null}
                </div>
                <h3>Contract Rates</h3>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            {backingSheetsHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {backingSheetsContent}
                    </tbody>
                </table>
            </div>)
    }

    renderSupplierTab(){
        var tabs: any = [];
        var tabContent: any = [];
        
        this.props.recommendation_suppliers
            .map((rs, index) => {
                var tabTitle;
                if(rs.incumbentContract){
                    tabTitle = `${rs.supplierName} (Incumbent)`;
                }
                else if(rs.winner){
                    tabTitle = (<div><span className="uk-margin-small-right" data-uk-icon="icon: star" style={{color: 'goldenrod'}}/> {`${rs.supplierName} (${rs.duration}m V${rs.version} - Winner)`}</div>);
                }
                else {
                    tabTitle = `${rs.supplierName} (${rs.duration}m V${rs.version})`;
                }

                var tab = (<li key={index}><a href="#">{tabTitle}</a></li>);
                tabs[index] = tab;

                var content = this.renderSupplierTabContent(index, rs);
                tabContent[index] = content;
            });

        return (
            <div className="uk-margin-top">
                <ul data-uk-tab>
                    {tabs}
                </ul>
                <ul className="uk-switcher">
                    {tabContent}
                </ul>
            </div>
        )
    }

    renderCostCell(value: number, formattedValue: string){
        if(value == 0){
            return <td style={{backgroundColor: "#fffef0", color: "burlywood"}}>{formattedValue}</td>
        }
        if(value < 0){
            return <td style={{backgroundColor: "#f0fff0", color: "darkgreen"}}>{formattedValue} <span className="uk-margin-small-left" data-uk-icon="icon: triangle-down" style={{color: 'green'}}/></td>
        }
        return <td style={{backgroundColor: "#fff0f4", color: "darkred"}}>{formattedValue} <span className="uk-margin-small-left" data-uk-icon="icon: triangle-up" style={{color: 'red'}}/></td>
    }

    renderSummaryTab(){
        var summary = this.props.recommendation_summary;
        var created = moment.utc(summary.reportDate).local().fromNow();   

        var offerSummaries = summary.offerSummaries.map(os => {
            var percentageDifference = (os.previousPercentageDifference * 100);
            var adriftPercentage = (os.adriftPercentage * 100);

            var supplier = this.props.suppliers.find(su => su.supplierId == os.supplierId);
            var supplierText = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ width: "70px"}}/>);

            return (
                <tr key={os.ranking}>
                    <td>{`#${os.ranking + 1}`}</td>
                    <td>{os.winner ?  (<div><span className="uk-margin-small-right" data-uk-icon="icon: star" style={{color: 'goldenrod'}}/> {supplierText}</div>) : supplierText}</td>
                    <td>{os.duration} months</td>
                    <td>{os.version}</td>
                    <td>{format(os.totalIncCCL, { locale: 'en-GB'})}</td>
                    <td>{format(os.cclCost, { locale: 'en-GB'})}</td>
                    <td>{`${summary.existingAPPU.toFixed(4)}p`}</td>
                    {this.renderCostCell(os.previousAmountDifference, format(os.previousAmountDifference, { locale: 'en-GB'}))}
                    {this.renderCostCell(percentageDifference, `${percentageDifference.toFixed(2)}%`)}
                    {os.winner ? (<td>-</td>) : this.renderCostCell(os.adriftAmount, format(os.adriftAmount, { locale: 'en-GB'}))}
                    {os.winner ? (<td>-</td>) : this.renderCostCell(adriftPercentage, `${adriftPercentage.toFixed(2)}%`)}
                </tr>)
        })

        var existingSupplier = this.props.suppliers.find(su => su.supplierId == summary.existingSupplierId);
        var existingSupplierText = existingSupplier == null ? (<h4><strong>Unknown</strong></h4>) : (<img src={existingSupplier.logoUri} style={{ width: "70px"}}/>);
        
        return (
            <div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title={summary.tenderTitle} label="Tender Title" small/>
                    <CounterCard title={summary.tenderId.substr(0, 6)} label="Tender Reference" small/>
                    <CounterCard title={summary.clientName} label="Client" small/>
                    <CounterCard title={summary.attentionOf} label="Client Contact" small/>
                    <div data-uk-tooltip={`title: ${summary.reportDate}`}>
                        <CounterCard title={created} label="Report Created" small/>
                    </div>
                </div>
                <h3>Existing Contract</h3>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard content={existingSupplierText} label="Incumbent Supplier" small/>
                    <CounterCard title={format(summary.existingtotalIncCCL, { locale: 'en-GB'})} label="Total Inc CCL" small/>
                    <CounterCard title={`${summary.existingAPPU.toFixed(4)}p`} label="Average Pence Per Unit" small/>
                </div>
                <h3>Offers Received</h3>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>Supplier</th>
                            <th>Duration</th>
                            <th>Version</th>
                            <th>Total Inc CCL</th>
                            <th>CCL</th>
                            <th>Average Pence / kWh</th>
                            <th>£ Increase or Saving</th>
                            <th>% Increase or Saving</th>
                            <th>£ Adrift of Offer Ranked #1</th>
                            <th>% Adrift of Offer Ranked #1</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offerSummaries}
                    </tbody>
                </table>
            </div>)
    }

    renderDialogBody(){
        return (
            <div>
                <div data-uk-grid>
                    <div className="uk-width-expand">
                        <ul data-uk-tab="connect: #reco-tabs-switcher">
                            <li><a href="#">Summary</a></li>
                            <li><a href="#">Offers ({this.props.recommendation_suppliers.length - 1})</a></li>
                            <li><a href="#">Sites ({this.props.selected_recommendation.meterCount})</a></li>
                        </ul>
                    </div>
                    <div className="uk-grid-width-1-10">
                        <a className="uk-button uk-button-default uk-button-small" href={this.props.selected_recommendation.summaryFileName} data-uk-tooltip="title: Download this report as .XLS">
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-download" />
                            Download
                        </a> 
                    </div>
                </div>
                
                <ul id="reco-tabs-switcher" className="uk-switcher uk-margin-top">
                    {this.renderSummaryTab()}
                    {this.renderSupplierTab()}
                    {this.renderSiteTabs()}
                </ul>
            </div>
        )
    }

    render() {
        if(this.props.error){
            var error = (<ErrorMessage content={this.props.errorMessage} />);
            return this.renderContent(error);
        }
        if(this.props.working || this.props.recommendation_suppliers == null || this.props.recommendation_summary == null || this.props.selected_recommendation == null){
            var spinner = (<Spinner />);
            return this.renderContent(spinner);
        }
        
        var body = this.renderDialogBody();
        return this.renderContent(body);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, RecommendationDetailDialogProps> = (dispatch) => {
    return {
        closeModalDialog: () => dispatch(closeModalDialog()),
        getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => dispatch(fetchRecommendationsSites(tenderId, summaryId, siteStart, siteEnd))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, RecommendationDetailDialogProps> = (state: ApplicationState) => {
    return {
        selected_recommendation: state.portfolio.tender.selected_recommendation,
        recommendation_summary: state.portfolio.tender.selected_recommendation_summary.value,
        recommendation_suppliers: state.portfolio.tender.selected_recommendation_suppliers.value,
        recommendation_sites: state.portfolio.tender.selected_recommendation_sites.value,
        sites_working: state.portfolio.tender.selected_recommendation_sites.working,
        working: state.portfolio.tender.selected_recommendation_summary.working || state.portfolio.tender.selected_recommendation_suppliers.working,
        error: state.portfolio.tender.selected_recommendation_summary.error || state.portfolio.tender.selected_recommendation_suppliers.error || state.portfolio.tender.selected_recommendation_sites.error,
        errorMessage: state.portfolio.tender.selected_recommendation_summary.errorMessage || state.portfolio.tender.selected_recommendation_suppliers.errorMessage || state.portfolio.tender.selected_recommendation_sites.errorMessage,
        suppliers: state.portfolio.tender.suppliers.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(RecommendationDetailDialog);