import * as React from "react";
import Header from "./Header";

const Dashboard : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <Header title="Dashboard" />
            <div className="content-dashboard">
                Hi, I'm the dashboard!
            </div>
        </div>)
}

export default Dashboard;