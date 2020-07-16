import * as React from "react";
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { render } from "react-dom";
import { Store } from "reactive-state";
import { StoreProvider, StoreSlice } from "reactive-state/react";
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

// The root store. Note that even if we work with "slices" in reactive-state, there is only a
// single store throughout the application just as in Redux.
const store = Store.create(initialAppState);
enableDevTool(store);

// Main App entry point
export const AppRoot: React.FC = () => {
    React.useEffect(() => {
        // For this demo and debugging, we want to log each and every single state change
        const subscription = store.select().subscribe((state) => console.log("ROOT STATE CHANGE:", state));
        return () => subscription.unsubscribe();
    }, []);

    return (
        <Router>
            <div>
                <StoreProvider store={store}>
                    <nav>
                        <Link to="/simplecounter">Simple Counter</Link>
                        <Link to="/advancedcounter"> Advanced Counter</Link>
                        <Link to="/todos"> Todo Example</Link>
                        <Link to="/dogs"> Dog Breeds</Link>
                    </nav>

                    <Route exact path="/" render={() => <Redirect to="/simplecounter" />} />

                    <Route exact path="/simplecounter" render={() => <SimpleCounter />} />

                    <Route
                        exact
                        path="/advancedcounter"
                        render={() => (
                            <div>
                                <h1>Advanced Counter</h1>
                                <AdvancedCounter />
                                <AdvancedCounter />
                                <AdvancedCounter />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path="/todos"
                        render={() => {
                            {
                                /* store slice create a slice of the store for us */
                            }
                            return (
                                <StoreSlice
                                    slice={(store: Store<any>) => "todos"}
                                    initialState={[]}
                                    cleanupState={"delete"}
                                >
                                    <Todo />
                                </StoreSlice>
                            );
                        }}
                    />

                    <Route exact path="/dogs" render={() => <Dogs />} />

                    <div style={{ fontSize: "smaller" }}>
                        (if you have the{" "}
                        <a target="_new" href="https://github.com/facebook/react-devtools">
                            Redux Devtool Browser Extension
                        </a>{" "}
                        installed, you can use it with this app)
                    </div>
                </StoreProvider>
            </div>
        </Router>
    );
};

// Bootstrap the App when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const rootNode = document.getElementById("root");
    render(<AppRoot />, rootNode);
});
