import { PortfolioState } from './reducers/portfolio/PortfolioState';
import { PortfoliosState } from './reducers/portfolios/PortfoliosState';
import { DashboardState } from './reducers/dashboard/DashboardState';
import { NotificationState } from './reducers/notifications/NotificationState';
import { AuthState } from './reducers/auth/AuthState';
import { MeterState } from './reducers/meters/MeterState';
import { RequestState } from './reducers/RequestState';
import { HierarchyState } from './reducers/hierarchy/HierarchyState';

export interface ApplicationState {    
    portfolio: PortfolioState;
    dashboard: DashboardState;
    portfolios: PortfoliosState;
    notifications: NotificationState;
    auth: AuthState;
    meters: MeterState;
    backend_version: RequestState;
    hierarchy: HierarchyState;
}