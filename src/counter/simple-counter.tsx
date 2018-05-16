import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Subscription, Observable } from "rxjs"
import { map } from "rxjs/operators"

import { CounterComponent, CounterComponentProps } from "./counter-component";
import { connect, ActionMap, MapStateToProps } from "reactive-state/react"

export interface SimpleCounterState {
    counter: number
}

// Reducer function shoule be pure functions; as they are side-effect free we can declare them globally
const incrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter + 1 })
const decrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter - 1 })

// This is the exact equivalent of  "mapStateToProps" in react-redux; We get a State and pick properties
// which should be fed as input to the component as its props. Difference is, that we return an observable
// of input props there (which is derived from the state).
const mapStateToProps = (store: Store<SimpleCounterState>): Observable<CounterComponentProps> => {
    return store.watch().pipe(
        map(state => {
            return {
                // "counter" prop on the component will be connected to the properties counter of our app state
                counter: state.counter
            }
        })
    )
}

export default connect(CounterComponent, (store: Store<SimpleCounterState>) => {
    const cleanup = new Subscription();

    const increment = new Action<void>();
    const decrement = new Action<void>();

    cleanup.add(store.addReducer(increment, incrementReducer))
    cleanup.add(store.addReducer(decrement, decrementReducer))

    const actionMap: ActionMap<CounterComponentProps> = {
        increment: () => increment.next(),
        decrement: () => decrement.next()
    }

    return {
        actionMap,
        mapStateToProps,

        // cleanup Subscription will be auto-unsubscribed when the component unmounts
        cleanup
    }

});
