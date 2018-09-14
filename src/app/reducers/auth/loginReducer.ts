import * as types from '../../actions/actionTypes';
import { RequestState, initialRequestState } from '../RequestState';

export interface LoginState extends RequestState {
}

export default function loginReducer(state = initialRequestState, action: any) {
    switch(action.type){
      case types.USER_LOGIN_WORKING:
        return {
            ...state,
            working: true,
            error: false,
            errorMessage: null
        }
      case types.USER_LOGIN_FAILED:
        return {
            ...state,
            working: false,
            error: true,
            errorMessage: action.error.error_description
        }
      default:
        return state;
    }
  }