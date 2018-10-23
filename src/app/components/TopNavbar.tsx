import * as React from "react";
import { Navbar, Form, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink } from "reactstrap";
import AuthenticationService from "../services/AuthenticationService";
import { LocalStorageRepository } from "../services/LocalStorageRepository";
import { toggleSidebarOpen } from "../actions/viewActions";
import { MapDispatchToPropsFunction, connect } from "react-redux";

interface DispatchProps {
    toggleSidebarOpen: () => void;
}

class TopNavbar extends React.Component<DispatchProps, {}> {
    logout() {
        AuthenticationService.logout();
    }
    render(){
        let { picture, firstName, lastName } = new LocalStorageRepository().fetchProfile();
        return (
            <div className="main-navbar sticky-top bg-white">
                <Navbar light className="align-items-stretch flex-md-nowrap p-0">
                    <Form action="#" className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
                        {/* <InputGroup className="input-group input-group-seamless ml-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-search"></i>    
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input className="navbar-search" type="text" placeholder="Search for something..." aria-label="Search" />
                        </InputGroup> */}
                    </Form>

                    <Nav navbar className="border-left flex-row">
                        {/* Notifications */}
                        {/* <UncontrolledDropdown nav inNavbar className="border-right notifications">
                            <DropdownToggle nav className="nav-link-icon text-center">
                                <div className="nav-link-icon__wrapper">
                                    <i className="material-icons">notifications</i>
                                    <span className="badge badge-pill badge-danger">2</span>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-small">
                                <DropdownItem href="#">
                                    <div className="notification__icon-wrapper">
                                        <div className="notification__icon">
                                        <i className="material-icons">show_chart</i>
                                        </div>
                                    </div>
                                    <div className="notification__content">
                                        <span className="notification__category">Analytics</span>
                                        <p>Your website’s active users count increased by
                                        <span className="text-success text-semibold">28%</span> in the last week. Great job!</p>
                                    </div>
                                </DropdownItem>
                                <DropdownItem href="#">
                                    <div className="notification__icon-wrapper">
                                        <div className="notification__icon">
                                        <i className="material-icons">store</i>
                                        </div>
                                    </div>
                                    <div className="notification__content">
                                        <span className="notification__category">Sales</span>
                                        <p>Last week your store’s sales count decreased by
                                        <span className="text-danger text-semibold">5.52%</span>. It could have been worse!</p>
                                    </div>
                                </DropdownItem>
                                <DropdownItem href="#" className="notification__all text-center">View all Notifications</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret className="text-nowrap px-3 mx-1">
                                <img className="user-avatar rounded-circle mr-2" src={picture} alt="User Avatar" />
                                <span className="d-none d-md-inline-block">{firstName} {lastName}</span>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-small">
                                {/* <DropdownItem href="#">
                                    <i className="material-icons">person</i> Profile
                                </DropdownItem>
                                <DropdownItem href="#">
                                    <i className="material-icons">settings</i> Settings
                                </DropdownItem>
                                <DropdownItem href="#">
                                    <i className="material-icons">help</i> Help
                                </DropdownItem>
                                <DropdownItem divider /> */}
                                <DropdownItem  href="#" className="text-danger" onClick={this.logout}>
                                    <i className="material-icons text-danger">exit_to_app</i> Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    <Nav>
                        <NavLink href="#" onClick={() => this.props.toggleSidebarOpen()}
                                className="nav-link-icon toggle-sidebar d-sm-inline d-md-none text-center border-left" >
                            <i className="material-icons">menu</i>
                        </NavLink>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        toggleSidebarOpen: () => dispatch(toggleSidebarOpen())
    };
};
  
export default connect(null, mapDispatchToProps)(TopNavbar);