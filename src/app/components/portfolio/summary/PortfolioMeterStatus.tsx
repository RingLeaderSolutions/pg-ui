import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { UtilityIcon } from "../../common/UtilityIcon";
import { Router } from "react-router";
import { Card, Col, CardHeader, CardBody, CardFooter, Row, Table, UncontrolledTooltip, Alert } from "reactstrap";
import { selectPortfolioTab } from "../../../actions/viewActions";

interface PortfolioMeterStatusProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  working: boolean;
  router: Router;
}

interface DispatchProps {
    selectMetersTab: () => void;
}

class PortfolioMeterStatus extends React.Component<PortfolioMeterStatusProps & StateProps & DispatchProps, {}> {
    renderConsumptionValue(value: number){
        if(value > 1000000){
            var gigaValue = value / 1000000;
            return `${gigaValue.toFixed(3).toLocaleString()} GWh`;
        }
        return `${value.toLocaleString()} kWh`;
    }

    createSummaryTable(){
        var rows = this.props.details.meterGroups.map(mg => {
            return (
                <tr key={mg.groupName}>
                    <td><UtilityIcon utility={mg.groupName} /></td>
                    <td>{this.renderConsumptionValue(mg.consumption)}</td>
                    <td>{mg.supplyDataCount}/{mg.meterCount}</td>
                    <td>{mg.groupName == "HH" ? `${mg.historicalCount}/${mg.meterCount}` : "N/A"}</td>
                </tr>
            )
        })
        return (
            <Table>
                <thead>
                    <tr>
                        <th>Utility</th>
                        <th>Consumption</th>
                        <th id="meter-status-supply-data-header">Supply Data</th>
                        <UncontrolledTooltip target="meter-status-supply-data-header">
                            <strong>The number of meters that have successfully uploaded supply data records.</strong>
                        </UncontrolledTooltip>
                        <th id="meter-status-historic-data-header">Historical</th>
                        <UncontrolledTooltip target="meter-status-historic-data-header">
                            <strong>The number of meters that have associated historic data provided (half-hourly only)</strong>
                        </UncontrolledTooltip>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        )
    }

    render() {
        var content = (<Spinner hasMargin={true}/>);
        if(!this.props.working && this.props.details.meterGroups != null){
            if(this.props.details.meterGroups.length == 0){
                content = (
                    <Alert color="light">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-info-circle mr-2"></i>
                            No meter have been uploaded to this portfolio yet.
                        </div>
                    </Alert>);
            }
            content = this.createSummaryTable();
        }

        return (
            <Col lg={6} md={12} className="mb-4">
                <Card className="card-small h-100">
                    <CardHeader className="border-bottom">
                        <h6 className="m-0"><i className="fas fa-stopwatch mr-1"></i>Meter Status</h6>
                    </CardHeader>
                    <CardBody className="d-flex p-0">
                        {content}
                    </CardBody>
                    <CardFooter className="border-top">
                        <Row>
                            <Col className="text-right view-report">
                                <a href="#" onClick={() => this.props.selectMetersTab()}><i className="fas fa-tachometer-alt mr-1"></i>View meters &rarr;</a>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </Col>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMeterStatusProps> = (dispatch) => {
    return {
        selectMetersTab: () => dispatch(selectPortfolioTab(1))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMeterStatusProps, ApplicationState> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        working: state.portfolio.details.working,
        router: state.router
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeterStatus);