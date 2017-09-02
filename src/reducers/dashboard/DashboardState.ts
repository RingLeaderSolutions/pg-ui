import { DashboardStatusState } from './dashboardStatusReducer';
import { DashboardSummaryState } from './dashboardSummaryReducer';
import { DashboardTimelineState } from './dashboardTimelineReducer';

export interface DashboardState {
    summary: DashboardSummaryState;
    status: DashboardStatusState;
    timeline: DashboardTimelineState;
}