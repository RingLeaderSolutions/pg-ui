import * as React from "react";
import Header from "./Header";

const Dashboard : React.SFC<{}> = () => {
    return (
        <div className="content-inner">
            <Header title="Dashboard" />
            <div className="content-dashboard">
                <div className="uk-child-width-expand@s uk-text-center" data-uk-grid>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h1>6</h1>
                            <p>Total Portfolios</p>
                        </div>
                    </div>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h1>56</h1>
                            <p>Total Sites</p>
                        </div>
                    </div>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h1>4,583</h1>
                            <p>Total MPANs</p>
                        </div>
                    </div>
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h1>TPI</h1>
                            <p>Your Team</p> 
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Dashboard;