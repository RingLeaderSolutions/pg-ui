import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { sayHello } from '../actions/helloAction';
import { ApplicationState } from '../applicationState';

interface HelloProps {
  name: string;
}

interface StateProps {
  otherName: string;
}

interface DispatchProps {
  sayHello: () => void;
}

class Hello extends React.Component<HelloProps & StateProps & DispatchProps, {}> {

  componentDidMount() {
    setTimeout(() => this.props.sayHello(), 2000);    
  }

  render() {
    const name = this.props.otherName ? this.props.otherName : this.props.name;
    return <div>Hello, {name}!</div>;
  }
}


const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, HelloProps> = (dispatch) => {
  return {
    sayHello: () => dispatch(sayHello('World'))
  };
};

const mapStateToProps: MapStateToProps<StateProps, HelloProps> = (state: ApplicationState) => {
  return {
    otherName: state.hello.name,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Hello);