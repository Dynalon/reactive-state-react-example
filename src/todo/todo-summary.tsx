import * as React from "react";

// This file is a 'dumb' or 'presentational' component with no dependencies except for React itself

export interface TodoSummaryComponentProps {
    open: number;
    done: number;
}

export const TodoSummaryComponent: React.StatelessComponent<TodoSummaryComponentProps> = (props) => {
    return <div>
        <br />#open {props.open} | #done {props.done}
    </div>
}