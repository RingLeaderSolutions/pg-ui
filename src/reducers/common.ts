import { RequestState } from './RequestState';

export const reduceReducers = (...reducers : Array<any>) => {
  return (previous: any, current: any) =>
    reducers.reduce(
      (p: any, r: any) => r(p, current),
      previous
    );
}

// DM, note: I wanted to make this a generic method typed to `RequestResponseState`,
// but due to this bug/missing feature in TS, I couldn't get the `...state` spread operator to work.
// should re-review in TS2.6+
// (core issue) https://github.com/Microsoft/TypeScript/issues/10727
// (example) https://github.com/Microsoft/TypeScript/issues/13557
export const requestResponseReducer = (
  workingActionType: string, 
  successActionType: string, 
  failureActionType: string, 
  successCallback: (state: RequestState, action: any) => void) => {
    return (state: RequestState, action: any) => {
      switch (action.type) {

        case workingActionType:
          return {
            ...state,
            working: true,
            error: false
          };

        case failureActionType:
          return {
            ...state,
            working: false,
            error: true,
            errorMessage: action.error
          };

        case successActionType:
          return successCallback(state, action);
        default:
          return state;
      }
    }
}