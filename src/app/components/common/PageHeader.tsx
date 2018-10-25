import * as React from "react";
import { Row } from "reactstrap";
import * as cn from "classnames";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    icon?: string;
    children?: React.ReactNode;
    className?: string;
    noYPadding?: boolean;
    style?: React.CSSProperties;
}

export const PageHeader: React.SFC<PageHeaderProps> = (props) => {
    let icon = props.icon && (<i className={`${props.icon} mr-1`}></i>)
    return (
        <Row noGutters className={cn('page-header w-100 justify-items-between', props.className, { 'py-3': !props.noYPadding })} style={props.style}>
            <div className="text-center text-md-left mb-0 flex-grow-1">
                <span className="text-uppercase page-subtitle">{icon}{props.subtitle}</span>
                <h3 className="page-title text-nowrap text-truncate pb-1">{props.title}</h3>
            </div>
            {props.children != null ? (
                <div className="d-flex align-items-center">
                    {props.children}
                </div>
            ) : null }            
        </Row>
    );
}