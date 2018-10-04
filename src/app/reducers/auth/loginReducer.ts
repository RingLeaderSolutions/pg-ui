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
            errorMessage: mapErrorTypeToMessage(action.ex.errorType)
        }
      default:
        return state;
    }
  }

function mapErrorTypeToMessage(errorType: string): string {
    switch(errorType.toLowerCase()){
        case "access_denied":
            return "Sorry! You provided an invalid email address or password.";
        default:
            return "Sorry, we seem to be having a problem logging you in. Please contact TPI Flow support."
    }
}