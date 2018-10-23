import * as React from "react";

interface LoadingIndicatorProps {
    minHeight?: number;
    text?: string;
}

export class LoadingIndicator extends React.Component<LoadingIndicatorProps, {}> {
    render() {
        let minHeight = this.props.minHeight || 400;
        let text = this.props.text || "Loading...";
        return (
            <div className="d-flex align-items-center" style={{ minHeight }}>
                <div className="mx-auto">
                    <SimpleLoadingIndicator />
                    <p className="m-0 mt-2">{text}</p>
                </div>
            </div>
        )
    }
}

export class SimpleLoadingIndicator extends React.Component<{}, {}> {
    render() {
        return (
            <div className="loading" />
        )
    }
}