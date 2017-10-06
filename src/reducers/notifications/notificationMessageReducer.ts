import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { NotificationMessage } from '../../model/NotificationMessage';

import { NotificationState } from './NotificationState';


const initialState: NotificationState = {
    lastMessage: null
}

const notificationMessageReducer = (state: NotificationState, action: any): NotificationState => {    
    switch (action.type) {
        case types.NOTIFICATION_PORTFOLIO_CREATED:        
            return {
                lastMessage: action.message
            }
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, notificationMessageReducer);