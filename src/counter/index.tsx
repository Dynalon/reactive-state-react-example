import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import CounterComponent from "./CounterComponent";

import { connect } from "../reactive-state-react"

export interface CounterModuleProps {
    store: Store<CounterModuleState>
}

export interface CounterModuleState {
    counter: number
}

const incrementAction = new Action<void>("COUNTER_INCREMENT")
const decrementAction = new Action<void>("COUNTER_DECREMENT")

const incrementReducer: Reducer<CounterModuleState> = (state) => ({ ...state, counter: state.counter + 1 })
const decrementReducer: Reducer<CounterModuleState> = (state) => ({ ...state, counter: state.counter - 1 })

const mapStateToProps = (state: CounterModuleState) => state;

const mapDispatchToProps = {
    increment: () => incrementAction.next(),
    decrement: () => decrementAction.next(),
}

export class CounterModule extends React.Component<CounterModuleProps, {}> {

    // TODO: eliminate any
    private ConnectedCounterComponent: any;

    componentWillMount() {

        // const mapDispatchToProps = { increment, decrement };
        this.ConnectedCounterComponent = connect(CounterComponent, this.props.store, mapStateToProps, mapDispatchToProps)

        this.props.store.addReducer(incrementAction, incrementReducer)
        this.props.store.addReducer(decrementAction, decrementReducer)
    }

    render() {
        const { ConnectedCounterComponent } = this;
        return <ConnectedCounterComponent />
    }
}
