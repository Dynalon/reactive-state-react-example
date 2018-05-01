import * as React from "react";
import { Action, Reducer, Store } from "reactive-state";
import { CounterComponent } from "./counter-component";

import { connect, ActionMap, MapStateToProps } from "reactive-state/react";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

const incrementReducer: Reducer<number> = (state) => state + 1;
const decrementReducer: Reducer<number> = (state) => state - 1;

export default connect(CounterComponent, (store: Store<any>) => {

    // We will use a random-generated string as key on the store; this allows us to
    // have multiples of this component on the same page, using different state slices.
    const randomString = `advanced-counter-${Math.floor(Math.random() * 10000000)}`;

    // The "delete" setting on the as cleanup state will remove the state property from the parent alltogether
    // this is perfect to "leave no trace" on the state once this component is unloaded
    const slice = store.createSlice(randomString, 0, "delete");

    const cleanupSubscription = new Subscription();
    cleanupSubscription.add(() => slice.destroy());

    const increment = new Action<void>();
    const decrement = new Action<void>();

    slice.addReducer(increment, incrementReducer);
    slice.addReducer(decrement, decrementReducer);

    // A function that maps our state of the slice to a matching props object of the component to connect.
    // Since we do not need to account for all props of the component to connect, the return type must be
    // of type Partial<CounterComponentProps>. Note that the casting of the return type with the 'as' is
    // completely optional here and only added for documentation.
    const mapStateToProps = () => {
        return slice.select().pipe(
            map(counter => {
                return ({ counter });
            })
        )
    }

    // instead of functions that dispatch actions, we can just add any RxJS observer here -
    // and since Actions and Subjects are observer, they will dispatch.
    const actionMap = {
        increment,
        decrement
    }

    return {
        actionMap,
        mapStateToProps,
        cleanupSubscription
    }
})