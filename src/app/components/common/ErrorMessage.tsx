import * as React from 'react';

interface ErrorMessageProps {
  content?: string;
  children?: any;
}

export default class ErrorMessage extends React.Component<ErrorMessageProps, {}> {
  render() {
  var errorMessage = (<p>Sorry! There was an error retrieving data for this component.</p>);
    if(this.props.content != undefined && this.props.content != ""){
      errorMessage = (<p>{this.props.content}</p>);
    }
    else if(this.props.children != null){
      errorMessage = this.props.children;
    }
    return (
      <div className="uk-alert uk-alert-danger uk-margin-small-bottom" data-uk-alert>
          <div className="uk-grid uk-grid-small" data-uk-grid>
              <div className="uk-width-auto uk-flex uk-flex-middle">
                <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
              </div>
              <div className="uk-width-expand uk-flex uk-flex-middle">
                  {errorMessage}
              </div>
          </div>
      </div>
    )
  }
}