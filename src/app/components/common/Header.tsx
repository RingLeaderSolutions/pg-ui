import * as React from "react";

import AuthService from '../../services/authService';

interface HeaderProps {
  title: string;
  children?: any;
  icon?: string;
}

export default class Header extends React.Component<HeaderProps, {}> {
  logOut() {
    AuthService.logout();
  }
  render() {
    var icon = this.props.icon ? (<i className={`${this.props.icon} uk-margin-right`}></i>) : null;
    return (
      <div className="header">
        <div className="header-content" data-uk-grid>
          <div className="uk-width-expand" data-uk-grid>
            <div className="uk-width-auto">
              <h3>{icon}{this.props.title}</h3>
            </div>
            <div className="uk-width-expand">
              {this.props.children}
            </div>
          </div>

          <div className="uk-width-auto">
            <i className="fa fa-sign-out-alt fa-2x" data-uk-tooltip="title:Log out" onClick={this.logOut} style={{cursor: "pointer"}}></i>
          </div>
        </div>
        <hr />
      </div>);
  }
}