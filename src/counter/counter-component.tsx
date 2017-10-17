import * as React from "react";

export interface CounterComponentProps {
    counter?: number;
    increment?: () => void;
    decrement?: () => void;
}

/**
 * A "dumb" component that just shows a counter and two +/- button. Note how this component does not know
 * anything about stores, reactive-state, actions etc. It is just a component using its props to display data,
 * and to trigger events via functions on its component props.
 */
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
