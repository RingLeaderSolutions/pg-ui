import * as React from "react";
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

interface CounterCardProps {
  title: string;
  label: string;
  small?: boolean;
  loaded?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export default class CounterCard extends React.Component<CounterCardProps, {}> {
  render() {
    var content = null;
    if(this.props.error){
      content = (
        <div className="uk-card uk-card-default uk-card-body">
          <ErrorMessage content={this.props.errorMessage} />
        </div>
      )
    }
    else if(this.props.loaded != null && !this.props.loaded){
      content = (
        <div className="uk-card uk-card-default uk-card-body">
          <Spinner />
        </div>
      )
    }
    else if(this.props.small){
      content = (
        <div className="uk-card uk-card-default uk-card-body">
          <h4><strong>{this.props.title}</strong></h4>
          <p className="uk-text-meta">{this.props.label}</p>
        </div>
      )
    }
    else {
      content = (
        <div className="uk-card uk-card-default uk-card-body">
          <h1><strong>{this.props.title}</strong></h1>
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