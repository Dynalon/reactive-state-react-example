import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { CounterComponent, CounterComponentProps } from "./counter-component"

import { connect } from "../reactive-state-react"

export interface AdvancedCounterProps {
    store: Store<any>
}

const increment = new Action<void>()
const decrement = new Action<void>()

const incrementReducer: Reducer<number> = (state) => state + 1
const decrementReducer: Reducer<number> = (state) => state - 1

const mapStateToProps = (state: number) => ({ counter: state })

const actionMap = {
    increment,
    decrement
};

export class AdvancedCounter extends React.Component<AdvancedCounterProps, {}> {

    private store: Store<number>
    private ConnectedCounterComponent: React.ComponentClass<CounterComponentProps>

    componentWillMount() {
        // setting "delete" as cleanup state will remove the state property from the parent alltogether
        // this is perfect to "leave no trace" on the state once this component is unloaded
        this.store = this.props.store.createSlice<number>("advancedCounter", 0, "delete")

        this.ConnectedCounterComponent = connect(CounterComponent, this.store, mapStateToProps, actionMap)

        this.store.addReducer(increment, incrementReducer)
        this.store.addReducer(decrement, decrementReducer)
    }

    componentWillUnmount() {
        this.store.destroy()
    }

    render() {
        const { ConnectedCounterComponent } = this
        return (
            <div>
                <h1>Advanced Counter Example</h1>
                <ConnectedCounterComponent />
            </div>
        )
    }
}
