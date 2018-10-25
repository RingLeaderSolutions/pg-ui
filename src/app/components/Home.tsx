import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { Route} from 'react-router-dom';

import { ApplicationState } from '../applicationState';
import { fetchBackendVersion, fetchInstanceDetails } from '../actions/authActions';

import { InstanceDetail } from "../model/Models";
import Dashboard from "./dashboard/Dashboard";
import Portfolios from "./portfolio/Portfolios";
import Accounts from "./accounts/Accounts";
import PortfolioDetail from "./portfolio/PortfolioDetail";
import AccountDetailView from "./accounts/AccountDetailView";
import { Container, Alert, Row, Badge, Button } from "reactstrap";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import PreAuthAppContainer from "./common/PreAuthAppContainer";
import AlertDialog from "./common/modal/AlertDialog";
import AlertConfirmDialog from "./common/modal/AlertConfirmDialog";
import { ToastContainer, ToastPosition } from "react-toastify";

interface StateProps {
    backendVersion: string;
    instance_detail: InstanceDetail;
    working: boolean;
    error: boolean;
    errorMessage: string;
}
  
interface DispatchProps {
    fetchBackendVersion: () => void;
    fetchInstanceDetails: () => void;
}

class Home extends React.Component<StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.fetchBackendVersion();
        this.props.fetchInstanceDetails();
    }

    render(){            
        if(this.props.working){
            return (
                <PreAuthAppContainer centerText>
                    <div className="loading"></div>
                    <h4 className="mt-2">Initialising... </h4>
                </PreAuthAppContainer>);
        }
        if(this.props.error){
            return (
                <PreAuthAppContainer centerText>
                    <Alert color="danger">
                        <i className="fas fa-exclamation-triangle mr-2"></i>Sorry! We seem to be having some trouble loading TPI Flow right now.
                    </Alert>
                    <hr />
                    <p>If you continue to receive this message, please contact our support team using the button below.</p>
                    <Button color="accent" href={`mailto:support@tpiflow.com?subject=Error%20Loading%20TPI%20Flow%20at%20${window.location.origin}`}>
                        <i className="fas fa-envelope mx-1"></i>
                        Contact us
                    </Button>
                </PreAuthAppContainer>)
        }

        let { backendVersion, instance_detail } = this.props;

        return (
            <Container fluid>
                <Row>
                    <Sidebar instanceDetail={instance_detail} />
                    <main className="main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3">
                        <TopNavbar />
                       
                       {/* Alert */}
                       {/* <Container fluid className="px-0">
                            <UncontrolledAlert color="warning" className="m-0">
                                <strong>Oh no!</strong> You should check out this thing, right now!
                            </UncontrolledAlert>
                       </Container> */}

                        <Container fluid className="main-content-container p-0">                            
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/portfolios" component={Portfolios} />
                            <Route path="/accounts" component={Accounts} />
                            <Route path="/account" component={AccountDetailView} />
                            <Route path="/portfolio" component={PortfolioDetail} />
                        </Container>

                        <footer className="main-footer d-flex p-2 px-3 bg-white border-top align-items-center justify-content-between">
                            <div className="d-flex justify-content-center">
                                <Badge className="badge-outline-light"><i className="fas fa-desktop mr-1"></i>UI: ({appConfig.environment_name}) v{appConfig.version}</Badge>
                                <Badge className="badge-outline-light"><i className="fas fa-server mr-1"></i>Server: v{backendVersion}</Badge>
                            </div>
                            <span className="copyright">
                                <span className="mr-2">Copyright © 2018</span>
                                <a className="ml-1" href="https://ringleadersolutions.com" rel="nofollow">Ring Leader Solutions</a>
                            </span>
                        </footer>
                        </main>
                </Row>
                <AlertConfirmDialog />
                <AlertDialog />
                <ToastContainer 
                    newestOnTop={true}
                    className="notification-container"
                    closeButton={false}
                    position={ToastPosition.BOTTOM_LEFT} />
            </Container>
        );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        fetchBackendVersion: () => dispatch(fetchBackendVersion()),
        fetchInstanceDetails: () => dispatch(fetchInstanceDetails())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        backendVersion: state.backend_version.value,
        instance_detail: state.instance_detail.value,
        working: state.backend_version.working || state.instance_detail.working,
        error: state.backend_version.error || state.instance_detail.error,
        errorMessage: state.backend_version.errorMessage || state.backend_version.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);