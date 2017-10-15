import * as React from "react";

// This is a "dumb" component that does not know anything about reactive-state (or redux at all)

interface CounterComponentProps {
    counter?: number;
    increment?: () => void;
    decrement?: () => void;
}

export default class CounterComponent extends React.Component<CounterComponentProps, {}> {

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
        return (<div>
            <input type="text" value={this.props.counter} />
            <input type="button" value="+" onClick={this.increment.bind(this)} />
            <input type="button" value="-" onClick={this.decrement.bind(this)} />
        </div>)
    }
}
