import * as React from "react";
import Header from "./Header";
import CounterCard from "./CounterCard";

const Dashboard : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <Header title="Dashboard" />
            <div className="content-dashboard">
                <div className="uk-child-width-expand@s uk-text-center" data-uk-grid>
                    <CounterCard title="6" label="Total Portfolios" />
                    <CounterCard title="56" label="Total Sites" />
                    <CounterCard title="4,583" label="Total MPANs" />
                    <CounterCard title="TPI" label="Your Team" />
                </div>
            </div>
        </div>)
}

export default Dashboard;