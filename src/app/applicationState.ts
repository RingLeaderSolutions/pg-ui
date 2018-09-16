import { PortfolioState } from './reducers/portfolio/PortfolioState';
import { PortfoliosState } from './reducers/portfolios/PortfoliosState';
import { DashboardState } from './reducers/dashboard/DashboardState';
import { NotificationState } from './reducers/notifications/NotificationState';
import { AuthState } from './reducers/auth/AuthState';
import { MeterState } from './reducers/meters/MeterState';
import { RequestState } from './reducers/RequestState';
import { HierarchyState } from './reducers/hierarchy/HierarchyState';
import { SelectedUploadReportState } from './reducers/selectedUploadReportReducer';
import { UsersState } from './reducers/fetchUsersReducer';
import { ViewState } from './reducers/view/ViewState';
import { TenderSuppliersState } from './reducers/tender/tenderSuppliersReducer';

export interface ApplicationState {    
    portfolio: PortfolioState;
    dashboard: DashboardState;
    portfolios: PortfoliosState;
    notifications: NotificationState;
    auth: AuthState;
    meters: MeterState;
    backend_version: RequestState;
    instance_detail: RequestState;
    hierarchy: HierarchyState;
    suppliers: TenderSuppliersState;
    selected_upload_report: SelectedUploadReportState;
    users: UsersState;
    view: ViewState;
}