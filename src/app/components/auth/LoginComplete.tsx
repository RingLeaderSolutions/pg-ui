import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { completeLogin } from "../../actions/authActions";
import { MapDispatchToPropsFunction, connect } from "react-redux";

interface DispatchProps { 
    completeLogin: (hash: string) => void;
}

class LoginComplete extends React.Component<RouteComponentProps<void> & DispatchProps, {}> {
    componentDidMount(){
        var hash = this.props.location.hash;
        this.props.completeLogin(hash);
    }

    render() {    
        return (
            <div>
                <Spinner hasMargin={true}/>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        completeLogin: (hash: string) => dispatch(completeLogin(hash))
    }
}

  
export default connect(null, mapDispatchToProps)(LoginComplete);