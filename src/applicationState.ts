import { HelloState } from './reducers/helloReducer';
import { PortfolioState } from './reducers/portfolioReducer';

export interface ApplicationState {    
    hello: HelloState;
    portfolio: PortfolioState;
}