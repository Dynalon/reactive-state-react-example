import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Observable, Subscription } from "rxjs/Rx"

import {  withStore } from "reactive-state/react/connect";
import { connect, unpackToState, ActionMap } from "reactive-state/react"
import { Todo, TodoComponent, TodoComponentProps } from "./todo-component";
import { TodoSummaryComponent } from "./todo-summary";
import { sampleTodos } from "./sample-todos"

interface ChangeTodoStatusPayload {
    todoId: number
    status: boolean;
}

const changeTodoStatus = new Action<ChangeTodoStatusPayload>()

// we use a single reducer for marking as done, and marking as undone
const changeTodoStatusReducer: Reducer<Todo[], ChangeTodoStatusPayload> = (state, payload) => {
    return state.map(todo => {
        if (todo.id !== payload.todoId)
            return todo;
        else
            return { ...todo, done: payload.status }
    })
}

const addTodo = new Action<Todo>()
const addTodoReducer: Reducer<Todo[], Todo> = (state, todo) => [...state, todo]

export interface TodoState {
    openTodos: Todo[],
    doneTodos: Todo[]
}

const ConnectedTodoComponent = connect(TodoComponent, (store: Store<{ todos: Todo[] }>) => {

    const cleanupSubscription = new Subscription();
    const slice = store.createSlice("todos");
    cleanupSubscription.add(() => store.destroy())

    cleanupSubscription.add(slice.addReducer(changeTodoStatus, changeTodoStatusReducer));
    cleanupSubscription.add(slice.addReducer(addTodo, addTodoReducer));

    const actionMap = {
        setTodoStatus: (todoId: number, status: boolean) => changeTodoStatus.next({ todoId, status })
    };

    const mapStateToProps = (state: Todo[]) => ({ todos: state })

    // add some sample todos via the addTodo action if none present
    slice.select().take(1).subscribe(state => {
        const todolistIsEmpty = state.length === 0;
        if (todolistIsEmpty) {
            Observable.from(sampleTodos).subscribe(n => addTodo.next(n));
        }
    });

    return {
        actionMap,
        cleanupSubscription,
        mapStateToProps,
        store: slice,
    }
});

export interface TodoProps {
    store: Store<any>;
    todos?: Todo[]
}

class EnhancedTodoComponent extends React.Component<TodoProps, TodoState> {

    public state: TodoState = {
        openTodos: [],
        doneTodos: []
    }

    private store?: Store<Todo[]>

    private setupComputedValues() {
        // Using RxJS operators we can transform/map/accumulate values (=computed values) into
        // new Observables...
        const openComputed = this.store!.select(todos => todos)
            .map(todos => todos.filter(todo => todo.done === false))
        const doneComputed = this.store!.select(todos => todos)
            .map(todos => todos.filter(todo => todo.done === true))

        // ...and use the unpackToState() helper function to unpack the observables last emitted values
        // automatically to the components internal state
        const unpackMap = { openTodos: openComputed, doneTodos: doneComputed }
        unpackToState(this, unpackMap)
    }

    componentWillMount() {
        this.store = this.props.store.createSlice("todos", []);

        this.setupComputedValues();
    }

    componentWillUnmount() {
        // Important: Allways destroy a slice to make sure all subscriptions are unsubscribed.
        // This also unsubscribes any subscriptions to our computed observables doneTodos or openTodos!
        this.store.destroy();
    }

    render() {
        return (
            <div>
                <h1>Todo</h1>
                <div className="container">
                    <ConnectedTodoComponent />
                </div>
                <div>
                    <div className="container box">
                        Using <code>store.select()</code> and built-in RxJS operators we can create new observables to
                        create "computed" values, completely eliminating the need to use <a href="https://github.com/reactjs/reselect"
                            target="_blank">Reselect</a> or <a href="https://github.com/mobxjs/mobx" target="_blank">MobX</a>.

                        The auxiliary function <code>unpackToState()</code> can be used to unpack Observables into a component's own state.

                        <TodoSummaryComponent open={this.state.openTodos.length} done={this.state.doneTodos.length} />
                    </div>
                </div>
            </div>
        )
    }
}

export default withStore(store => <EnhancedTodoComponent store={store} />);