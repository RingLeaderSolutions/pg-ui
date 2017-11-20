import { PortfolioState } from './reducers/portfolio/PortfolioState';
import { PortfoliosState } from './reducers/portfolios/PortfoliosState';
import { DashboardState } from './reducers/dashboard/DashboardState';
import { NotificationState } from './reducers/notifications/NotificationState';
import { AuthState } from './reducers/auth/AuthState';

export interface ApplicationState {    
    portfolio: PortfolioState;
    dashboard: DashboardState;
    portfolios: PortfoliosState;
    notifications: NotificationState;
    auth: AuthState;
}