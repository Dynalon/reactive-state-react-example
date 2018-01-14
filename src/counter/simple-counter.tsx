import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Subscription } from "rxjs/Subscription"

import { CounterComponent, CounterComponentProps } from "./counter-component";
import { connect, ActionMap } from "reactive-state/react"

export interface SimpleCounterProps {
    store: Store<SimpleCounterState>
}

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

// Create a "connected" component - we will pass arguments as props to it later on
const ConnectedCounterComponent = connect(CounterComponent);

export default class extends React.Component<SimpleCounterProps, {}> {

    private cleanupSubscription = new Subscription();

    private actionMap: ActionMap<CounterComponentProps>;

    componentWillMount() {

        // Actions can be any Observable and - of course - Subjects, too. We use a custom Action class that derives
        // from Subject but accepts a string name for debugging - but names are completely optional!
        const incrementAction = new Action<void>("INCREMENT")
        const decrementAction = new Action<void>("DECREMENT")

        // we register an action and a reducer on the store to wire them together
        const subscription1 = this.props.store.addReducer(incrementAction, incrementReducer)
        const subscription2 = this.props.store.addReducer(decrementAction, decrementReducer)

        this.cleanupSubscription.add(subscription1);
        this.cleanupSubscription.add(subscription2);

        // This is the equivalent of "mapDispatchToProps" - the keys of the map match the function props of the
        // connected component, the right hand side triggers the corresponding action
        this.actionMap = {
            increment: () => incrementAction.next(),
            decrement: () => decrementAction.next()
        }
    }

    componentWillUnmount() {
        this.cleanupSubscription.unsubscribe();
    }

    render() {
        return (
            <div>
                <h1>Simple Counter</h1>

                <ConnectedCounterComponent
                    store={this.props.store}
                    mapStateToProps={mapStateToProps}
                    actionMap={this.actionMap}
                />

            </div>
        )
    }
}
