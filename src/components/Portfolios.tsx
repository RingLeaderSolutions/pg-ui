import * as React from "react";
import Header from "./Header";

const Portfolios : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <Header title="Portfolios" />
            <div className="content-dashboard">
                Hi, I'm the portfolios page!
            </div>
        </div>)
}

export default Portfolios;