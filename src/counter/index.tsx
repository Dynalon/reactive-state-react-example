import * as React from "react";
import { Action, Reducer, Store } from "reactive-state";

import { Observable } from "rxjs/Rx";

export interface CounterModuleProps {
    store: Store<any>
}

export interface CounterModuleState {
    counter: number;
}

export interface ICounterState {
    counter: number;
}

export const initialCounterState: ICounterState = {
    counter: 0
}

const incrementAction = new Action<void>("COUNTER_INCREMENT");
const decrementAction = new Action<void>("COUNTER_DECREMENT");

const incrementReducer: Reducer<number> = (state) => state + 1;
const decrementReducer: Reducer<number> = (state) => state - 1;

function connect<T>(obs: Observable<T>, component: React.Component<any, T>) {
    obs.subscribe(t => {
        component.setState(t);
    });
}

export class CounterModule extends React.Component<CounterModuleProps, CounterModuleState> {

    private store: Store<number>;

    state = {
        counter: 0
    }

    componentDidMount() {
        const initialState = 0;
        this.store = this.props.store.createSlice<number>('counter', initialState);

        this.store.addReducer(incrementAction, incrementReducer);
        this.store.addReducer(decrementAction, decrementReducer);

        this.store.select(s => s).subscribe(counter => this.setState(({ counter })));
        // connect(this.store.select(s => s), this);

        Observable.timer(0, 5000).subscribe(n => incrementAction.next());

    }

    componentWillUnmount() {
        this.store.destroy();
        this.store = undefined;
    }

    render() {
        return (<div>
            <input type="text" value={this.state.counter} />
        </div>)
    }
}
