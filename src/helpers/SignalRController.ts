import * as types from "../actions/actionTypes";
import { HubConnection } from "@aspnet/signalr-client";
import { NotificationMessage } from '../model/NotificationMessage';
import { getPortfolioDetails } from '../actions/portfolioActions';
import { getPortfolioTenders } from '../actions/tenderActions';
import { retrieveAccountDetail } from '../actions/hierarchyActions';
import { fetchMeterConsumption } from '../actions/meterActions';
import { ApplicationState } from "../applicationState";

export default function connectSignalR(store: any) {
    let connection = new HubConnection(appConfig.signalRUri);

    connection.on('Notify', (data: NotificationMessage) => {
        console.log(data);
        var currentState: ApplicationState = store.getState();

        var currentPortfolio = currentState.portfolio.selected.value;
        var currentAccount = currentState.hierarchy.selected.value;
        if(!currentPortfolio || !currentAccount){
            return;
        }

        var currentPortfolioId = currentPortfolio.id;
        switch(data.EntityType.toLowerCase()){
            case "portfolio":
                if(data.EntityId == currentPortfolioId){
                    store.dispatch(getPortfolioDetails(currentPortfolioId));
                }
            case "portfoliometers":
                if(data.EntityId == currentPortfolioId){
                    store.dispatch(getPortfolioDetails(currentPortfolioId));
                    store.dispatch(fetchMeterConsumption(currentPortfolioId));
                }
                break;
            case "tender":
                if(data.PortfolioId == currentPortfolioId){
                    store.dispatch(getPortfolioTenders(currentPortfolioId));
                }
                break;
            case "account":
                if(data.EntityId == currentAccount.id){
                    store.dispatch(retrieveAccountDetail(currentAccount.id))
                }
                break;
        }
    });

    connection.start()
        .then(() => console.log('SignalR hub connected'));
}

