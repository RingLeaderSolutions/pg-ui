import * as React from "react";
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';

interface CounterCardProps {
  title?: string;
  content?: any;
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
      return (
        <div>
          <div className="uk-card uk-card-default uk-card-body">
            <ErrorMessage content={this.props.errorMessage} />
          </div>
        </div>
      )
    }
    else if(this.props.loaded != null && !this.props.loaded){
      return (
        <div>
          <div className="uk-card uk-card-default uk-card-body">
            <Spinner />
          </div>
        </div>
      )
    }

    var label = (<p>{this.props.label}</p>);
    if(this.props.small){
      label = (<p className="uk-text-meta">{this.props.label}</p>);
    }

    var cardContent = null;
    if(this.props.title != null){
      cardContent = (<h1><strong>{this.props.title}</strong></h1>);
      if(this.props.small){
        cardContent = (<h4><strong>{this.props.title}</strong></h4>);
      }      
    }
    else if(this.props.content != null){
      cardContent = this.props.content;
    }

    var cardClass = this.props.small ? "uk-card uk-card-default uk-card-body uk-card-small" : "uk-card uk-card-default uk-card-body";
    return (
      <div>
        <div className={cardClass}>
          {cardContent}
          {label}
        </div>
      </div>
    )
  }
}