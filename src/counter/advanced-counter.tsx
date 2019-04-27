import { Reducer, Store } from "reactive-state";
import { connect } from "reactive-state/react";
import { Observable, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { CounterComponent, CounterComponentProps } from "./counter-component";

const incrementReducer: Reducer<number> = state => state + 1;
const decrementReducer: Reducer<number> = state => state - 1;

export default connect(
    CounterComponent,
    (store: Store<any>) => {
        // We will use a random-generated string as key on the store; this allows us to
        // have multiples of this component on the same page, using different state slices.
        const randomString = `advanced-counter-${Math.floor(Math.random() * 10000000)}`;

        // The "delete" setting on the as cleanup state will remove the state property from the parent alltogether
        // this is perfect to "leave no trace" on the state once this component is unloaded
        const slice = store.createSlice(randomString, 0, "delete");

        // the store we got as 1st argument is a clone and automatically destryoed when the
        // connected component gets unmounted. We create a slice here, which is also destroyed
        // since its a child store of the destroyed instance. To verify, we log it to the devtools :)
        slice.destroyed.subscribe(() =>
            console.info("slice store for advanced counter got destroyed, all reducers on this slice removed"),
        );

        const increment = new Subject<void>();
        const decrement = new Subject<void>();

        slice.addReducer(increment, incrementReducer);
        slice.addReducer(decrement, decrementReducer);

        // An observable of the input props connected to the component. We derive the props from the state observable
        const props = slice.watch(counter => ({ counter }));

        // instead of functions that dispatch actions (see simple-counter), we can just add any RxJS observer
        // here - and since Subjects are observers, they will "fire" (dispatch).
        const actionMap = {
            increment,
            decrement,
        };

        return {
            actionMap,
            props,
        };
    },
);
