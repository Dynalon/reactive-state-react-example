import { Reducer, Store } from "reactive-state";
import { ActionMap, connect } from "reactive-state/react";
import { Subject } from "rxjs";
import { CounterComponent, CounterComponentProps } from "./counter-component";

export interface SimpleCounterState {
    counter: number
}

// Reducer function shoule be pure functions; as they are side-effect free we can declare them globally
const incrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter + 1 })
const decrementReducer: Reducer<SimpleCounterState> = (state) => ({ ...state, counter: state.counter - 1 })

export default connect(CounterComponent, (store: Store<SimpleCounterState>) => {

    const increment = new Subject<void>();
    const decrement = new Subject<void>();

    store.addReducer(increment, incrementReducer)
    store.addReducer(decrement, decrementReducer)


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
    }

});
