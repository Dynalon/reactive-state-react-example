import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { CounterComponent, CounterComponentProps } from "./counter-component"

import { connect } from "reactive-state/dist/react";

export interface AdvancedCounterProps {
    store: Store<any>
}

const incrementReducer: Reducer<number> = (state) => state + 1
const decrementReducer: Reducer<number> = (state) => state - 1

// A function that maps our state of the slice to a matching props object of the connected component
// the "as CounterComponentProps" is not needed, but added here to express the aforementioned comment.
const mapStateToProps = (state: number) => ({ counter: state }) as CounterComponentProps

export class AdvancedCounter extends React.Component<AdvancedCounterProps, {}> {

    private store: Store<number>
    private ConnectedCounterComponent: React.ComponentClass<CounterComponentProps>

    componentWillMount() {
        // We will use a random-generated string as key on the store; this allows us to
        // have multiples of this component on the same page, using different state slices.
        const randomString = `advanced-counter-${Math.floor(Math.random() * 10000000)}`;

        // The "delete" setting on the as cleanup state will remove the state property from the parent alltogether
        // this is perfect to "leave no trace" on the state once this component is unloaded
        this.store = this.props.store.createSlice<number>(randomString, 0, "delete")

        const increment = new Action<void>()
        const decrement = new Action<void>()

        this.store.addReducer(increment, incrementReducer)
        this.store.addReducer(decrement, decrementReducer)

        // instead of functions that dispatch actions, we can just add any RxJS observer here -
        // and since Actions and Subjects are observer, they will dispatch.
        const actionMap = {
            increment,
            decrement
        };

        this.ConnectedCounterComponent = connect(CounterComponent, this.store, mapStateToProps, actionMap)
    }

    componentWillUnmount() {
        this.store.destroy()
    }

    render() {
        const { ConnectedCounterComponent } = this
        return (
            <ConnectedCounterComponent />
        )
    }
}
