import * as React from "react";
import { MapDispatchToPropsFunction, connect } from 'react-redux';

import DashboardSummary from "./DashboardSummary";
import DashboardStatus from "./DashboardStatus";
import DashboardTimeline from "./DashboardTimeline";
import { ApplicationTab } from "../../model/Models";
import { selectApplicationTab } from "../../actions/viewActions";
import { Row, Col } from "reactstrap";
import { PageHeader } from "../common/PageHeader";

interface DispatchProps {
    selectApplicationTab: (tab: ApplicationTab) => void;
}

class Dashboard extends React.Component<DispatchProps, {}> {
    componentDidMount(){
        this.props.selectApplicationTab(ApplicationTab.Dashboard);
    }
    
    render(){
        return(
            <div className="w-100 px-4">
                <PageHeader subtitle="Dashboard" icon="fas fa-chart-line"/>
                <DashboardSummary />
                <Row>
                    <Col lg={6} md={12} className="mb-4 d-flex flex-column">
                        <DashboardStatus />
                    </Col>
                    <Col lg={6} md={12} className="mb-4 d-flex flex-column">
                        <DashboardTimeline />
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab))
    };
};
  
  
export default connect(null, mapDispatchToProps)(Dashboard);