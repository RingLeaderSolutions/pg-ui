import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

interface HelloProps {
  title: string;
  label: string;
}

export default class Hello extends React.Component<HelloProps, {}> {
  render() {
    return (
        <div>
            <div className="uk-card uk-card-default uk-card-body">
                <h1>{this.props.title}</h1>
                <p>{this.props.label}</p>
            </div>
        </div>);
  }
}