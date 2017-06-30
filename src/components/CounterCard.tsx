import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

interface HelloProps {
  title: string;
  label: string;
  small?: boolean;
}

export default class Hello extends React.Component<HelloProps, {}> {
  render() {
    var content = null;
    if(this.props.small){
      content = (
        <div className="uk-card uk-card-default uk-card-body">
          <h3>{this.props.title}</h3>
          <p className="uk-text-small">{this.props.label}</p>
        </div>
      )
    }
    else {
      content = (
        <div className="uk-card uk-card-default uk-card-body">
          <h1>{this.props.title}</h1>
          <p>{this.props.label}</p>
        </div>
      )
    }
    return (
        <div>
            {content}
        </div>);
  }
}