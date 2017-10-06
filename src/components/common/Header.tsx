import * as React from "react";
import NotificationContainer from './NotificationContainer';

interface HeaderProps {
  title: string;
}

export default class Header extends React.Component<HeaderProps, {}> {
  render() {

    return (
      <div className="header">
        <NotificationContainer />
        <div className="header-content">
          <h3>{this.props.title}</h3>
          <img className="avatar avatar-large" src={require('../../images/avatar.jpg')} />
        </div>
        <hr />
      </div>);
  }
}