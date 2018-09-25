import * as React from "react";
import { HubConnection } from "@aspnet/signalr-client";
import { NotificationMessage } from '../model/NotificationMessage';
import Notification from '../components/common/Notification';
import { getPortfolioDetails, fetchPortfolioUploads, getAllPortfolios, getSinglePortfolio } from '../actions/portfolioActions';
import { getPortfolioTenders, fetchTenderOffers, fetchTenderRecommendations, getAccountContracts } from '../actions/tenderActions';
import { retrieveAccountDetail, fetchAccountDocumentation, fetchAccountUploads, retrieveAccounts } from '../actions/hierarchyActions';
import { fetchMeterConsumption } from '../actions/meterActions';
import { ApplicationState } from "../applicationState";
import { Store, Dispatch } from "redux";
import { push } from 'connected-react-router';
import { toast, ToastType } from 'react-toastify';

const NotifyMethodName = 'Notify';

export default class SignalRController {
    connection: HubConnection;
    store: Store<ApplicationState>;

    constructor(store: Store<ApplicationState>){
        this.store = store;
        this.connection = new HubConnection(appConfig.signalRUri)
        
        this.onNotification = this.onNotification.bind(this);
    }

    start() {
        this.connection.on(NotifyMethodName, this.onNotification)
        this.connection.start()
            .then(() => console.log('SignalR hub connected'));
    }

    stop() {
        this.connection.off(NotifyMethodName, this.onNotification)
        this.connection.stop();
        console.log('SignalR hub disconnected');
    }

    onNotification(data: NotificationMessage) {
        const store = this.store;

        console.log(data);
        var currentState: ApplicationState = store.getState();

        var currentPortfolio = currentState.portfolio.selected.value;
        var currentAccount = currentState.hierarchy.selected.value;

        switch(data.EntityType.toLowerCase()){
            case "portfolio":
            case "portfoliometers":
                if(currentPortfolio && data.PortfolioId == currentPortfolio.id){
                    if(data.Category == "deleted"){
                        store.dispatch((dispatch: Dispatch<any>) => {
                            dispatch(push('/portfolios'));
                        });
                    }
                    else {
                        store.dispatch(getSinglePortfolio(currentPortfolio.id));
                        store.dispatch(getPortfolioDetails(currentPortfolio.id));
                        store.dispatch(fetchMeterConsumption(currentPortfolio.id));
                        store.dispatch(fetchPortfolioUploads(currentPortfolio.id));
                    }
                }
                if(data.Category == "created" || data.Category == "deleted" || data.Category == "edited"){
                    store.dispatch(getAllPortfolios())
                }
                break;
            case "tender":
                if(currentPortfolio && data.PortfolioId == currentPortfolio.id){
                    switch(data.Category){
                        case "tenderpack_issue_successful":
                            showNotification(data.Description, true);
                            return;
                        case "tenderpack_generated":
                            showNotification('Tender requirements successfully generated.', true);
                            break;
                        case "tenderpack_issue_failed":
                            showNotification(data.Description, false);
                            break;
                        case "contract_upload_successful":
                            showNotification("Successfully uploaded existing contract", true);
                            break;
                        case "contract_upload_failed":
                            showNotification("Failed to upload existing contract", false);
                            break;
                        case "quote_upload_successful":
                            showNotification(`Successfully uploaded existing contract: ${data.Description}`, true);
                            break;
                        case "quote_upload_failed":
                            showNotification(`Failed to upload quote: ${data.Description}`, false);
                            break;
                        case "historical_upload_successful":
                            showNotification(`Successfully uploaded HH data: ${data.Description}`, true);
                            break;
                        case "historical_upload_failed":
                            showNotification(`Failed to upload HH data: ${data.Description}`, false);
                            break;
                        case "recommendation_generate_successful":
                            showNotification(`Successfully generated recommendation`, true);
                            break;
                        case "recommendation_generate_failed":
                            showNotification(`Failed to generate recommendation`, false);
                            break;
                    }
                    store.dispatch(getPortfolioTenders(currentPortfolio.id));
                    store.dispatch(fetchTenderOffers(currentPortfolio.id));
                    store.dispatch(fetchTenderRecommendations(currentPortfolio.id));
                    store.dispatch(fetchPortfolioUploads(currentPortfolio.id));
                }
                break;
            case "account":
                if(currentAccount && data.EntityId == currentAccount.id){
                    if(data.Category == "contract"){
                        store.dispatch(getAccountContracts(currentAccount.id));
                        return;
                    }
                    store.dispatch(retrieveAccountDetail(currentAccount.id));
                    store.dispatch(fetchAccountDocumentation(currentAccount.id));
                    store.dispatch(fetchAccountUploads(currentAccount.id));
                }
                switch(data.Category){
                    case "created":
                    case "deleted":
                    case "updated":
                        store.dispatch(retrieveAccounts());
                        break;
                    case "supplydata_upload_failed":
                        showNotification(`Failed to upload ${data.Description} supply data.`, false);
                        break;
                    case "supplydata_upload_successful":
                        showNotification(`Successfully uploaded ${data.Description} supply data`, true);
                        break;
                }
                break;
        }
    }
}

function showNotification(message: string, success: boolean){
    var icon = success ? 'check-circle' : 'times-circle';
    toast(
        <Notification message={message} icon={icon} />,
        {
            bodyClassName: "notification-body",
            type: success ? ToastType.SUCCESS : ToastType.ERROR,
            autoClose: success ? 5000 : 15000
        }
    );
}