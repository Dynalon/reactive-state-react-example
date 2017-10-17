import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Subscription } from "rxjs/Subscription"
import { CounterComponent, CounterComponentProps } from "./counter-component";

import { connect } from "../reactive-state-react"

export interface SimpleCounterProps {
    store: Store<SimpleCounterState>
}

export interface SimpleCounterState {
    counter: number
}

const incrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter + 1 })
const decrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter - 1 })

const incrementAction = new Action<void>()
const decrementAction = new Action<void>()

const mapStateToProps = (state: SimpleCounterState) => state;

// similar to "mapDispatchToProps" in Redux
const actionMap = {
    increment: () => incrementAction.next(),
    decrement: () => decrementAction.next(),
}

export class SimpleCounter extends React.Component<SimpleCounterProps, {}> {

    private ConnectedCounterComponent: React.ComponentClass<CounterComponentProps>;
    private cleanupSubscription = new Subscription();

    componentWillMount() {

        this.ConnectedCounterComponent = connect(CounterComponent, this.props.store, mapStateToProps, actionMap)

        const subscription1 = this.props.store.addReducer(incrementAction, incrementReducer)
        const subscription2 = this.props.store.addReducer(decrementAction, decrementReducer)

        this.cleanupSubscription.add(subscription1);
        this.cleanupSubscription.add(subscription2);
    }

    componentWillUnmount() {
        this.cleanupSubscription.unsubscribe();
    }

    render() {
        const { ConnectedCounterComponent } = this;
        return (
            <div>
                <h1>Simple Counter Example</h1>
                <ConnectedCounterComponent />
            </div>
        )
    }
}
