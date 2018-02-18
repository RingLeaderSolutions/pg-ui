import * as types from "../actions/actionTypes";
import { HubConnection } from "@aspnet/signalr-client";
import { NotificationMessage } from '../model/NotificationMessage';

export default function connectSignalR(store: any) {
    let connection = new HubConnection(appConfig.signalRUri);

    connection.on('Notify', (data: NotificationMessage) => {
        console.log('notif received');
        console.log(data);
        let messageType = types.NOTIFICATION_PORTFOLIO_CREATED
        switch (data.Description) {
            case 'portfolio created':
                messageType = types.NOTIFICATION_PORTFOLIO_CREATED;
                break;
            case 'portfolio deleted':
                messageType = types.NOTIFICATION_PORTFOLIO_DELETED;
                break;
            case 'mpans included':
                messageType = types.NOTIFICATION_MPANS_INCLUDED;
                break;
            case 'mpans excluded':
                messageType = types.NOTIFICATION_MPANS_EXCLUDED;
                break;
            default:
                return;
        }

        store.dispatch({
            type: types.NOTIFICATION_PORTFOLIO_CREATED,
            message: data
        });

        console.log(data);
    });

    connection.start()
        .then(() => console.log('SignalR hub connected'));
}

