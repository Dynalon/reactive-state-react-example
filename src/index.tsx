import * as React from "react";
import { HashRouter as Router, Route, withRouter } from "react-router-dom";
import { render } from "react-dom";
import { Store } from 'reactive-state';

import { CounterModule, CounterModuleState } from "./counter/index";
// import { TodoModule } from "./todo/index";

const appState: CounterModuleState = {
    counter: 0
};

export class AppRoot extends React.Component<{}, {}> {

    store: Store<typeof appState>;

    constructor(props: {}) {
        super(props)
        this.store = Store.create(appState);

        this.store.select(state => state, true).subscribe(state => console.log("STATE CHANGE", state));
    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/page1" render={() => (<CounterModule store={this.store} />)} />
                    {/* <Route exact path="/page2" component={Page2} /> */}
                </div>
            </Router>
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const rootNode = document.getElementById('root');
    render(<AppRoot />, rootNode);
});
