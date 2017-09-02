import { PortfolioState } from './reducers/portfolio/PortfolioState';
import { PortfoliosState } from './reducers/portfolios/PortfoliosState';
import { DashboardState } from './reducers/dashboard/DashboardState';

export interface ApplicationState {    
    portfolio: PortfolioState;
    dashboard: DashboardState;
    portfolios: PortfoliosState;
}