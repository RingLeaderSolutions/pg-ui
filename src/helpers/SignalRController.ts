import * as types from "../actions/actionTypes";
import { HubConnection } from "@aspnet/signalr-client";
import { NotificationMessage } from '../model/NotificationMessage';
import { getPortfolioDetails, fetchPortfolioUploads, getAllPortfolios } from '../actions/portfolioActions';
import { getPortfolioTenders } from '../actions/tenderActions';
import { retrieveAccountDetail, fetchAccountDocumentation, fetchAccountUploads, retrieveAccounts } from '../actions/hierarchyActions';
import { fetchMeterConsumption } from '../actions/meterActions';
import { ApplicationState } from "../applicationState";

export default function connectSignalR(store: any) {
    let connection = new HubConnection(appConfig.signalRUri);

    connection.on('Notify', (data: NotificationMessage) => {
        console.log(data);
        var currentState: ApplicationState = store.getState();

        var currentPortfolio = currentState.portfolio.selected.value;
        var currentAccount = currentState.hierarchy.selected.value;

        switch(data.EntityType.toLowerCase()){
            case "portfolio":
            case "portfoliometers":
                if(currentPortfolio && data.PortfolioId == currentPortfolio.id && data.Category != "deleted"){
                    store.dispatch(getPortfolioDetails(currentPortfolio.id));
                    store.dispatch(fetchMeterConsumption(currentPortfolio.id));
                    store.dispatch(fetchPortfolioUploads(currentPortfolio.id));
                }
                if(data.Category == "created" || data.Category == "deleted"){
                    store.dispatch(getAllPortfolios())
                }
                break;
            case "tender":
                if(currentPortfolio && data.PortfolioId == currentPortfolio.id){
                    store.dispatch(getPortfolioTenders(currentPortfolio.id));
                    store.dispatch(fetchPortfolioUploads(currentPortfolio.id));
                }
                break;
            case "account":
                if(currentAccount && data.EntityId == currentAccount.id){
                    store.dispatch(retrieveAccountDetail(currentAccount.id));
                    store.dispatch(fetchAccountDocumentation(currentAccount.id));
                    store.dispatch(fetchAccountUploads(currentAccount.id));
                }
                if(data.Category == "created" || data.Category == "deleted"){
                    store.dispatch(retrieveAccounts())
                }
                break;
        }
    });

    connection.start()
        .then(() => console.log('SignalR hub connected'));
}

