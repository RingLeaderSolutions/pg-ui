import * as React from "react";
import { RouteComponentProps } from 'react-router';
import { Link } from "react-router-dom";
import PreAuthAppContainer from "../common/PreAuthAppContainer";
import { Button } from "reactstrap";

class Logout extends React.Component<RouteComponentProps<void>, {}> {
    render() {
        return (
            <PreAuthAppContainer centerText>
                <h5>You have successfully logged out of the system.</h5>
                <Link to="/login">
                    <Button color="accent" className="d-table mx-auto mt-2">
                        <i className="fas fa-sign-in-alt mx-1"></i>
                        Log back in
                    </Button>
                </Link>
            </PreAuthAppContainer>
        )
    }
}

export default Logout;