import * as types from "../actions/actionTypes";
import { HubConnection } from "@aspnet/signalr-client";
import { NotificationMessage } from '../model/NotificationMessage';
import { getPortfolioDetails } from '../actions/portfolioActions';
import { getPortfolioTenders } from '../actions/tenderActions';
import { ApplicationState } from "../applicationState";

export default function connectSignalR(store: any) {
    let connection = new HubConnection(appConfig.signalRUri);

    connection.on('Notify', (data: NotificationMessage) => {
        console.log(data);
        var currentState: ApplicationState = store.getState();

        var currentPortfolio = currentState.portfolio.selected.value;
        if(!currentPortfolio){
            return;
        }

        var currentPortfolioId = currentPortfolio.id;
        if(data.EntityType.toLowerCase() == "portfolio" && data.EntityId == currentPortfolioId){
            store.dispatch(getPortfolioDetails(currentPortfolioId));
            return;
        }
        else if (data.EntityType.toLowerCase() == "tender") {
            store.dispatch(getPortfolioTenders(currentPortfolioId));
        }

        // let messageType = types.NOTIFICATION_PORTFOLIO_CREATED;
        // switch (data.Description) {
        //     case 'portfolio created':
        //         messageType = types.NOTIFICATION_PORTFOLIO_CREATED;
        //         break;
        //     case 'portfolio deleted':
        //         messageType = types.NOTIFICATION_PORTFOLIO_DELETED;
        //         break;
        //     case 'mpans included':
        //         messageType = types.NOTIFICATION_MPANS_INCLUDED;
        //         break;
        //     case 'mpans excluded':
        //         messageType = types.NOTIFICATION_MPANS_EXCLUDED;
        //         break;
        //     default:
        //         return;
        // }

        // store.dispatch({
        //     type: types.NOTIFICATION_PORTFOLIO_CREATED,
        //     message: data
        // });
    });

    connection.start()
        .then(() => console.log('SignalR hub connected'));
}

