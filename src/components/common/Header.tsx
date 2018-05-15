import * as React from "react";
import NotificationContainer from './NotificationContainer';
import { Link } from 'react-router-dom';

import AuthService from '../../services/AuthService';

interface HeaderProps {
  title: string;
}

export default class Header extends React.Component<HeaderProps, {}> {
  logOut() {
    AuthService.logout();
  }
  render() {

    return (
      <div className="header">
        <NotificationContainer />
        <div className="header-content">
          <h3>{this.props.title}</h3>
          <span data-uk-icon="icon: sign-out; ratio: 2" title="Log out" data-uk-tooltip onClick={this.logOut}/>
          {/* <img className="avatar avatar-large" src={require('../../images/avatar.jpg')} title="Log out" data-uk-tooltip onClick={this.logOut}/> */}
        </div>
        <hr />
      </div>);
  }
}