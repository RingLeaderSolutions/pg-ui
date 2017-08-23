import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

export default class Hello extends React.Component<{}, {}> {
  render() {
    return (
        <div className="spinner">
            <div className="cube1"></div>
            <div className="cube2"></div>
        </div>
    )
  }
}