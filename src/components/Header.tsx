import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

interface HeaderProps {
  title: string;
}

export default class Hello extends React.Component<HeaderProps, {}> {
  render() {
    return (
        <div className="header">
            <h3>{this.props.title}</h3>
            <hr />
        </div>);
  }
}