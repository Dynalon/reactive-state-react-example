import * as React from "react";

export interface TodoSummaryComponentProps {
    open: number;
    done: number;
}

export class TodoSummaryComponent extends React.Component<TodoSummaryComponentProps, {}> {
    render() {
        return (
            <div>
                <br />#open {this.props.open} | #done {this.props.done}
            </div>
        )
    }
}