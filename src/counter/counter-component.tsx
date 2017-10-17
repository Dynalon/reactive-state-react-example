import * as React from "react";

// This is a "dumb" component that does not know anything about reactive-state (or redux at all)

export interface CounterComponentProps {
    counter?: number;
    increment?: () => void;
    decrement?: () => void;
}

export class CounterComponent extends React.Component<CounterComponentProps, {}> {

    increment() {
        if (this.props.increment) {
            this.props.increment();
        }
    }

    decrement() {
        if (this.props.decrement) {
            this.props.decrement();
        }
    }

    render() {
        return (<p>
            Counter is: {this.props.counter} &nbsp;
            <button onClick={this.increment.bind(this)}> + </button>
            <button onClick={this.decrement.bind(this)}> - </button>
        </p>)
    }
}
