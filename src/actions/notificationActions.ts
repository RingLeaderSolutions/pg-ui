import * as types from "./actionTypes";
import { NotificationMessage } from '../model/NotificationMessage'

export function notifyMessage(message: NotificationMessage) {
    return (dispatch: any) => {
        dispatch({
            type: types.NOTIFICATION_PORTFOLIO_CREATED,
            message: message
        });
    };
}