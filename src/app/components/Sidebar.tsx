import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { Link} from 'react-router-dom';
import { ApplicationState } from '../applicationState';
import { InstanceDetail, ApplicationTab } from "../model/Models";
import { NotificationService } from "../App";
import { SignalRConnectionState } from "../services/SignalRService";
import { Navbar, NavbarBrand, Form, InputGroup, Input, InputGroupAddon, InputGroupText, Nav, NavItem } from "reactstrap";
import { RoutedNavLink, RoutedNavbarBrand } from "./common/RoutedLinkHelpers";
import * as cn from 'classnames';
import { toggleSidebarOpen } from "../actions/viewActions";

interface SidebarProps {
    instanceDetail: InstanceDetail;
}
interface StateProps {
    selectedTab: ApplicationTab;
    sidebarOpen: boolean;
}

interface SidebarState {
    connectionState: SignalRConnectionState;
}
  
interface DispatchProps {
    toggleSidebarOpen: () => void;
}

class Sidebar extends React.Component<SidebarProps & StateProps & DispatchProps, SidebarState> {
    constructor(props: SidebarProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            connectionState: NotificationService.state
        };
    }

    componentDidMount(){
        NotificationService.onStateChanged = (state) => {
            this.setState({
                connectionState: state
            });
        };

        this.setState({
            connectionState: NotificationService.state
        })
    }

    renderConnectionState(){
        let divClass = '';
        let icon = '';
        let text = '';
        switch(this.state.connectionState){
            case SignalRConnectionState.Active:
                divClass = 'label-connected';
                icon = 'check-circle';
                text = 'Connected';
                break;
            case SignalRConnectionState.Connecting:
                divClass = 'label-connecting';
                icon = 'sync-alt';
                text = 'Connecting...';
                break;
            case SignalRConnectionState.Recovering:
                divClass = 'label-recovering';
                icon = 'sync-alt';
                text = 'Reconnecting...';
                break;
            case SignalRConnectionState.Errored:
                divClass = 'label-error';
                icon = 'exclamation-triangle';
                text = 'Disconnected...';
                break;
        }

        return (
            <div className="label-connection mt-1 mb-3 d-flex flex-column align-items-center">
                <div className={`tf-label ${divClass} d-inline-flex flex-row align-items-center`}>
                    <i className={`fas fa-${icon}`}></i>
                    <span>{text}</span>
                </div>
            </div>);
    }

    render(){
        const isSelectedTab = (tab: ApplicationTab): boolean => this.props.selectedTab == tab;

        return (
            <aside className={cn("main-sidebar col-12 col-md-3 col-lg-2 px-0", { "open" : this.props.sidebarOpen })}>
                <div className="main-navbar border-bottom">
                    <Navbar className="align-items-stretch navbar-light bg-white flex-md-nowrap p-0">
                        <div className="d-block w-100">
                            <NavbarBrand className="w-100 mr-0" tag={Link} to="/" style={{lineHeight: '25px'}}>
                                <div className="d-table m-auto">
                                    <img id="main-logo" className="d-inline-block align-top mr-1" src={this.props.instanceDetail.logoUri} alt={this.props.instanceDetail.name} />
                                </div>
                            </NavbarBrand>
                            {this.renderConnectionState()}
                        </div>
                        <a className="toggle-sidebar d-sm-inline d-md-none d-lg-none" onClick={() => this.props.toggleSidebarOpen()}> 
                            <i className="material-icons">arrow_back</i>
                        </a>
                    </Navbar>                            
                </div>

                {/* Search form in sidebar, displayed when small width  */}
                {/* <Form action="#" className="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none">
                    <InputGroup className="input-group input-group-seamless ml-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="fas fa-search"></i>    
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input className="navbar-search" type="text" placeholder="Search for something..." aria-label="Search" />
                    </InputGroup>
                </Form> */}

                <div className="nav-wrapper">
                    <Nav vertical>
                        <NavItem>
                            <RoutedNavLink tag={Link} to="/" className={cn({ active: isSelectedTab(ApplicationTab.Dashboard)})}>
                                <i className="fas fa-chart-line"></i>
                                <span>Dashboard</span>
                            </RoutedNavLink>
                        </NavItem>
                        <NavItem>
                            <RoutedNavLink tag={Link} to="/portfolios" className={cn({ active: isSelectedTab(ApplicationTab.Portfolios)})}>
                                <i className="fas fa-layer-group"></i>
                                <span>Portfolios</span>
                            </RoutedNavLink>
                        </NavItem>
                        <NavItem>
                            <RoutedNavLink tag={Link} to="/accounts" className={cn({ active: isSelectedTab(ApplicationTab.Accounts)})}>
                                <i className="fas fa-building"></i>
                                <span>Accounts</span>
                            </RoutedNavLink>
                        </NavItem>
                    </Nav>
                    {/* <h6 className="main-sidebar__nav-title mt-5">Recent</h6>
                    <Nav vertical>
                        <NavItem>
                            <RoutedNavLink tag={Link} to="/#">
                                <i className="fas fa-layer-group"></i>
                                <span>19/20 Sheff. Wed. Renewal</span>
                            </RoutedNavLink>
                        </NavItem>
                        <NavItem>
                            <RoutedNavLink tag={Link} to="/#">
                                <i className="fas fa-layer-group"></i>
                                <span>UK Bio 2020</span>
                            </RoutedNavLink>
                        </NavItem>
                        <NavItem>
                            <RoutedNavLink tag={Link} to="/#">
                                <i className="fas fa-building"></i>
                                <span>Principality</span>
                            </RoutedNavLink>
                        </NavItem>
                    </Nav> */}

                    {/* Example dropdown in menu: */}
                    {/* <Nav vertical className="nav--no-borders">
                        <Dropdown nav isOpen={...} toggle={...}>
                            <DropdownToggle nav caret className="active">
                                <i className="fas fa-building"></i>
                                <span>Dropdown example</span>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-small">
                                <DropdownItem className="active">Example 1</DropdownItem>
                                <DropdownItem className="active">Example 2</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav> */}
                </div>
            </aside>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        toggleSidebarOpen: () => dispatch(toggleSidebarOpen())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        selectedTab: state.view.app.selectedTab,
        sidebarOpen: state.view.app.sidebar_open
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);