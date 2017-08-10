import { Dispatch, Action } from 'redux';
import { AxiosPromise } from 'axios';
import axios from 'axios';

export function makeApiRequest<T>(
  dispatch: Dispatch<any>, 
  method: AxiosPromise, 
  expectedStatusCode: number, 
  successAction: (data: T) => Action, 
  failureAction: (error: any, ...args : any[]) => Action): Promise<T> {
  return method
    .then(function (response) {
      if (response.status == expectedStatusCode) {
         dispatch(successAction(response.data));
         return response.data;
      }
      else {
        console.log(`Received [${response.status}] when expecting [${expectedStatusCode}] from API @ [${response.config.url}]`);
        dispatch(failureAction(`${response.status} - ${response.statusText}`));
      }
    })
    .catch(function (error) {
      if (error.data) {
        dispatch(failureAction(error.data));
      }
      else {
        dispatch(failureAction(error.message));
      }
      return undefined;
    });
}
