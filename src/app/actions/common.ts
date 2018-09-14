import { Dispatch, Action } from 'redux';
import { AxiosPromise } from 'axios';

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
      console.error(error);
      
      var message = error.message;
      // if this is an api error, and data is provided, then display it
      if(error.response != null && error.response.data != null && error.response.data != ''){
        message = `${error.message}: ${error.response.data}`
      }
      
      dispatch(failureAction(message));
      return undefined;
    });
}
