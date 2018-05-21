import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

interface SpinnerProps{
    hasMargin?: boolean;
}

export default class Spinner extends React.Component<SpinnerProps, {}> {
  render() {
    var spinner = (
        <div className="spinner">
        </div>
    );

    if(this.props.hasMargin){
        return (
            <div className="spinner-parent">
                {spinner}
            </div>
        )
    }
    return spinner;
  }
}