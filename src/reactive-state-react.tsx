import * as React from "react";
import { Subscription } from "rxjs/Subscription";
import { Observer } from "rxjs/Observer";
import { Action, Store } from "reactive-state";

type ReactComponent<TProps> = React.ComponentClass<TProps> | React.StatelessComponent<TProps>;

type ComponentConstructor<TProps, TState> = new (...args: any[]) => React.Component<TProps, TState>;

// if TS should get Exact Types feature one day (https://github.com/Microsoft/TypeScript/issues/12936)
// we should change Partial<T> to be an Exact<Partial<T>> (so we cannot have excess properties on the returned object
// that do not correspond to any component prop)
export function connect<TOriginalProps, TAppState>(
    ComponentToConnect: ComponentConstructor<TOriginalProps, object>,
    store: Store<TAppState>,
    mapStateToProps: (state: TAppState) => Partial<TOriginalProps> = (state) => ({}),
    actionMap: ActionMap<TOriginalProps> = {}
): React.ComponentClass<TOriginalProps> {

    type MapStateToProps = (store: Store<TAppState>) => TOriginalProps
    return class ConnectedComponent extends React.Component<TOriginalProps, object> {

        private subscription: Subscription
        private actionProps: Partial<TOriginalProps> = {}

        private assembleActionProps() {
            for (let ownProp in actionMap) {
                const field = (actionMap as any)[ownProp];

                if (typeof field === "function") {
                    let func = (actionMap as any)[ownProp];
                    (this.actionProps as any)[ownProp] = func;
                }
                else if (typeof field.next === "function") {
                    (this.actionProps as any)[ownProp] = (arg1: any, ...args: any[]) => field.next(arg1);
                }
            }
        }

        constructor(...args: any[]) {
            super(...args);
        }

        componentWillMount() {
            this.subscription = store.select(s => s).subscribe(state => {
                this.setState((prevState, props) => mapStateToProps(state))
            })

            this.assembleActionProps();
        }

        componentWillUnmount() {
            this.subscription.unsubscribe()
        }

        render() {
            return <ComponentToConnect {...this.props} {...this.state } { ...this.actionProps } />
        }
    }
}


// This will be a function that dispatches actions, but should not return anything
type ActionFunction = (...args: any[]) => any;

export type ActionMap<TProps> = {
    [P in keyof TProps]?: ActionFunction | Observer<any>
}
