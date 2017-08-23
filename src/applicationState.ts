import { PortfolioState } from './reducers/portfolioReducer';
import { DashboardState } from './reducers/dashboardReducer';

export interface ApplicationState {    
    portfolio: PortfolioState;
    dashboard: DashboardState;
}