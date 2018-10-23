import * as React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import * as cn from 'classnames';

interface PreAuthAppContainerProps {
    centerText?: boolean;
    image?: string;
}

export default class PreAuthAppContainer extends React.Component<PreAuthAppContainerProps, {}> {
    render(){
        let imageName = this.props.image || "panels";
        let image = require(`../../images/${imageName}.png`);
        
        return (
            <Container fluid className="h-100 w-100" style={{backgroundImage: `url(${image})`}}>
                <Col className="d-flex justify-content-center h-100 w-100" sm={{ size: 6, offset: 3 }}>
                <Row className="align-items-center">
                    <Card className={cn('mx-auto', { 'text-center' : this.props.centerText })}>
                        <CardBody>
                            <img src={require('../../images/tpi-flow-logo.png')} alt="TPI Flow" />
                            {this.props.children}
                        </CardBody>
                    </Card>
                </Row>                
                </Col>
            </Container>
        )
    }
}