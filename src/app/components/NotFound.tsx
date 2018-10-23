import * as React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import PreAuthAppContainer from "./common/PreAuthAppContainer";
import { Alert, Button } from "reactstrap";

export default class NotFound extends React.Component<RouteComponentProps<void>, {}> {
    render() {
        return (
            <PreAuthAppContainer centerText>
                <Alert color="danger">
                    <i className="fas fa-info mr-2"></i>Sorry! We couldn't find the page you were looking for.
                </Alert>
                <p><Link to='/'><i className="fas fa-link mx-1"></i>Click here</Link> to go back to TPI Flow.</p>
                <hr />
                <p>If you continue to receive this message, please contact our support team using the button below.</p>
                <Button color="accent" href={`mailto:support@tpiflow.com?subject=HTTP%20404at%20${window.location.href}`}>
                    <i className="fas fa-envelope mx-1"></i>
                    Contact us
                </Button>
            </PreAuthAppContainer>)
    }
}