import * as React from 'react';
import { Alert } from 'reactstrap';

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
            <Alert color="light">
                <div className="d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    {errorMessage}
                </div>
            </Alert>);
        }
}