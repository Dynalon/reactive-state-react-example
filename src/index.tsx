import * as React from "react";
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { render } from "react-dom";
import { Store } from 'reactive-state';

import { SimpleCounter, SimpleCounterState } from "./counter/simple-counter";
import { AdvancedCounter } from "./counter/advanced-counter";
import { TodoExample } from "./todo/todo";

const appState = {
    counter: 0
}

export class AppRoot extends React.Component<{}, {}> {

    store: Store<any>

    constructor(...args: any[]) {
        super(...args)
        this.store = Store.create(appState)

        this.store.select(state => state, true).subscribe(state => console.log("ROOT STATE CHANGE:", state))
    }

    render() {
        return (
            <Router>
                <div>
                    <nav>
                        <Link to="/simplecounter">Simple Counter</Link> |
                        <Link to="/advancedcounter"> Advanced Counter</Link> |
                        <Link to="/todos"> Todo Example</Link>
                    </nav>

                    <Route exact path="/" render={() => (
                        <Redirect to="/simplecounter" />
                    )} />
                    <Route exact path="/simplecounter" render={() => (<SimpleCounter store={this.store} />)} />
                    <Route exact path="/advancedcounter" render={() => (<AdvancedCounter store={this.store} />)} />
                    <Route exact path="/todos" render={() => (<TodoExample store={this.store} />)} />
                </div>
            </Router>
        )
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const rootNode = document.getElementById('root')
    render(<AppRoot />, rootNode)
})
