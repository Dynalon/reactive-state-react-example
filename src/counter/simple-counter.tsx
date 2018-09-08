import { Reducer, Store } from "reactive-state";
import { ActionMap, connect } from "reactive-state/react";
import { Observable, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { CounterComponent, CounterComponentProps } from "./counter-component";

export interface SimpleCounterState {
    counter: number
}

// Reducer function shoule be pure functions; as they are side-effect free we can declare them globally
const incrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter + 1 })
const decrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter - 1 })

export default connect(CounterComponent, (store: Store<SimpleCounterState>) => {


    const cleanup = new Subscription();

    const increment = new Subject<void>();
    const decrement = new Subject<void>();

    cleanup.add(store.addReducer(increment, incrementReducer))
    cleanup.add(store.addReducer(decrement, decrementReducer))

    // This is the equivalent of  "mapStateToProps" in react-redux; We use the state observable to derive the input
    // propds that we connect to our component
    const props = store.watch(state => {
        return {
            // "counter" prop on the component will be connected to the property counter of our app state
            counter: state.counter
        }
    })

    const actionMap: ActionMap<CounterComponentProps> = {
        increment: () => increment.next(),
        decrement: () => decrement.next()
    }

    return {
        actionMap,
        props,

        // cleanup Subscription will be auto-unsubscribed when the component unmounts
        cleanup
    }

});
