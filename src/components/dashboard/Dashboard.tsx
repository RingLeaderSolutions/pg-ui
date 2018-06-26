import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import Header from "../common/Header";

import DashboardSummary from "./DashboardSummary";
import DashboardStatus from "./DashboardStatus";
import DashboardTimeline from "./DashboardTimeline";
import { ApplicationTab } from "../../model/Models";
import { selectApplicationTab } from "../../actions/viewActions";

interface DispatchProps {
    selectApplicationTab: (tab: ApplicationTab) => void;
}

class Dashboard extends React.Component<DispatchProps, {}> {
    componentDidMount(){
        console.log('dashboard mount');
        this.props.selectApplicationTab(ApplicationTab.Dashboard);
    }
    
    render(){
        return (
            <div className="content-inner">
                <div className="content-dashboard">
                    <Header title="Dashboard" />
                    <div className="content-dashboard">
                        <DashboardSummary />
                        <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid data-uk-height-match="target: > div > .uk-card">
                            <DashboardStatus />
                            <DashboardTimeline />
                        </div>
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab))
    };
};
  
  
export default connect(null, mapDispatchToProps)(Dashboard);