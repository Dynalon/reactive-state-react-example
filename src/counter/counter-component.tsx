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
export const CounterComponent: React.SFC<CounterComponentProps> = (props: CounterComponentProps) => {

    function increment() {
        if (props.increment) {
            props.increment();
        }
    }

    function decrement() {
        if (props.decrement) {
            props.decrement();
        }
    }

    return (<p>
        Counter is: {props.counter} &nbsp;
        <button onClick={increment}> + </button>
        <button onClick={decrement}> - </button>
    </p>)
}

export default CounterComponent;