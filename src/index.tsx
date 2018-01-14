import * as React from "react";
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { render } from "react-dom";
import { Store } from "reactive-state";
import { enableDevTool } from "reactive-state/src/devtool";

import SimpleCounter, { SimpleCounterState } from "./counter/simple-counter";
import AdvancedCounter from "./counter/advanced-counter";
import Todo from "./todo";
import Dogs from "./dogs";

// This is our global AppState. We use this syntax to clearify that it is an intersection of sub-slices
// used my app modules. We also omit some state slices alltogether for modules that create their own
// (i.e. AdvancedCounter and Todo)
const initialAppState = Object.assign(
    {},
    { counter: 0 } as SimpleCounterState,

    // add any other slices here...
);

// Main App entry point
export class AppRoot extends React.Component<{}, {}> {

    // The root store. Note that even if we work with "slices" in reactive-state, there is only a
    // single store throughout the application just as in Redux.
    // By using typeof initialAppState as a type, we make sure the type matches the initialState instance above
    store: Store<typeof initialAppState>

    componentWillMount() {

        // Creates an instance of the root store.
        this.store = Store.create(initialAppState)

        enableDevTool(this.store);

        // We subscribe to the global store on every change, which you wouldn't usually do
        // (hence the true flag as second argument that would most of the times be omitted)
        // But for this demo and debugging, we want to log each and every single state change
        this.store.select(state => state, true).subscribe(state => console.log("ROOT STATE CHANGE:", state))
    }

    render() {
        return (
            <Router>
                <div>
                    <nav>
                        <Link to="/simplecounter">Simple Counter</Link> |
                        <Link to="/advancedcounter"> Advanced Counter</Link> |
                        <Link to="/todos"> Todo Example</Link> |
                        <Link to="/dogs"> Dog Breeds</Link>
                    </nav>

                    <Route exact path="/" render={() => (
                        <Redirect to="/simplecounter" />
                    )} />

                    <Route exact path="/simplecounter" render={() => (<SimpleCounter store={this.store} />)} />

                    <Route exact path="/advancedcounter" render={() => (<div>
                        <h1>Advanced Counter</h1>
                        <AdvancedCounter store={this.store} />
                        <AdvancedCounter store={this.store} />
                        <AdvancedCounter store={this.store} />
                    </div>
                    )} />

                    <Route exact path="/todos" render={() => (<Todo store={this.store} />)} />

                    <Route exact path="/dogs" render={() => (<Dogs store={this.store} />)} />

                    <div style= {{ "fontSize": "smaller" }}>
                        (if you have the <a target="_new" href="https://github.com/facebook/react-devtools">
                        Redux Devtool Browser Extension</a> installed, you can use it with this app)
                    </div>

                </div>
            </Router>
        )
    }
}

// Bootstrap the App when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const rootNode = document.getElementById("root")
    render(<AppRoot />, rootNode)
})
