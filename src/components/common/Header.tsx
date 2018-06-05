import * as React from "react";
import NotificationContainer from './NotificationContainer';

import AuthService from '../../services/AuthService';

interface HeaderProps {
  title: string;
  children?: any;
}

export default class Header extends React.Component<HeaderProps, {}> {
  logOut() {
    AuthService.logout();
  }
  render() {

    return (
      <div className="header">
        <NotificationContainer />
        <div className="header-content" data-uk-grid>
          <div className="uk-width-expand" data-uk-grid>
            <div className="uk-width-auto">
              <h3>{this.props.title}</h3>
            </div>
            <div className="uk-width-expand">
              {this.props.children}
            </div>
          </div>

          <div className="uk-width-auto">
            <span data-uk-icon="icon: sign-out; ratio: 2" title="Log out" data-uk-tooltip onClick={this.logOut}/>
          </div>
          
          {/* <img className="avatar avatar-large" src={require('../../images/avatar.jpg')} title="Log out" data-uk-tooltip onClick={this.logOut}/> */}
        </div>
        <hr />
      </div>);
  }
}