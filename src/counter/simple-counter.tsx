import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Subscription } from "rxjs"

import { CounterComponent, CounterComponentProps } from "./counter-component";
import { connect, ActionMap, MapStateToProps } from "reactive-state/react"

export interface SimpleCounterState {
    counter: number
}

// We define the reducers outside of a class or function; since Reducer function shoule be pure functions
// this is perfectly fine as they will never depend on outside mutable values.
const incrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter + 1 })
const decrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter - 1 })

// This is the exact equivalent of  "mapStateToProps" in react-redux; We get a State and pick properties which should
// be fed as input to the component as its props
const mapStateToProps = (state: SimpleCounterState) => {
    return {
        // "counter" prop on the component will be connected to the properties counter of our app state
        counter: state.counter
    }
}

export default connect(CounterComponent, (store: Store<SimpleCounterState>) => {
    const cleanupSubscription = new Subscription();

    const increment = new Action<void>();
    const decrement = new Action<void>();

    cleanupSubscription.add(store.addReducer(increment, incrementReducer))
    cleanupSubscription.add(store.addReducer(decrement, decrementReducer))

    const actionMap: ActionMap<CounterComponentProps> = {
        increment: () => increment.next(),
        decrement: () => decrement.next()
    }

    return {
        actionMap,
        mapStateToProps,
        store,
        cleanupSubscription
    }

});
