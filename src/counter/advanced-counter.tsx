import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { CounterComponent, CounterComponentProps } from "./counter-component"

import { connect, ActionMap } from "reactive-state/dist/react"

export interface AdvancedCounterProps {
    store: Store<any>
}

const incrementReducer: Reducer<number> = (state) => state + 1
const decrementReducer: Reducer<number> = (state) => state - 1

// A function that maps our state of the slice to a matching props object of the component to connect.
// Since we do not need to account for all props of the component to connect, the return type must be
// of type Partial<CounterComponentProps>. Note that the casting of the return type with the 'as' is
// completely optional here and only added for documentation.
const mapStateToProps = (state: number) => ({ counter: state } as Partial<CounterComponentProps>)

const ConnectedCounterComponent = connect(CounterComponent, { mapStateToProps });

export default class extends React.Component<AdvancedCounterProps, {}> {

    private store: Store<number>
    private actionMap: any;

    componentWillMount() {
        // We will use a random-generated string as key on the store; this allows us to
        // have multiples of this component on the same page, using different state slices.
        const randomString = `advanced-counter-${Math.floor(Math.random() * 10000000)}`

        // The "delete" setting on the as cleanup state will remove the state property from the parent alltogether
        // this is perfect to "leave no trace" on the state once this component is unloaded
        this.store = this.props.store.createSlice<number>(randomString, 0, "delete")

        const increment = new Action<void>()
        const decrement = new Action<void>()

        this.store.addReducer(increment, incrementReducer)
        this.store.addReducer(decrement, decrementReducer)

        // instead of functions that dispatch actions, we can just add any RxJS observer here -
        // and since Actions and Subjects are observer, they will dispatch.
        this.actionMap = {
            increment,
            decrement
        }
    }

    componentWillUnmount() {
        this.store.destroy()
    }

    render() {
        return (
            <ConnectedCounterComponent store={this.store} actionMap={this.actionMap} />
        )
    }
}
