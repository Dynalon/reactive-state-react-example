import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Observable } from "rxjs/Rx"

import { connect, unpackToState, Optional } from "reactive-state/dist/react"
import { Todo, TodoComponent, TodoComponentProps } from "./todo-component";
import { TodoSummaryComponent } from "./todo-summary";
import { sampleTodos } from "./sample-todos"

export interface TodoProps {
    store: Store<any>,
    todos?: Todo[]
}

interface MarkAsDonePayload {
    todoId: number
    status: boolean;
}

const changeTodoStatus = new Action<MarkAsDonePayload>()

// we use a single reducer for marking as done, and marking as undone
const changeTodoStatusReducer: Reducer<Todo[], MarkAsDonePayload> = (state, payload) => {
    return state.map(todo => {
        if (todo.id !== payload.todoId)
            return todo;
        else
            return { ...todo, done: payload.status }
    })
}

const addTodo = new Action<Todo>()
const addTodoReducer: Reducer<Todo[], Todo> = (state, todo) => [...state, todo]

export interface TState {
    openTodos: Todo[],
    doneTodos: Todo[]
}

export default class extends React.Component<TodoProps, TState> {

    public state: TState = {
        openTodos: [],
        doneTodos: []
    }

    private store: Store<Todo[]>
    private ConnectedTodoComponent: React.ComponentClass<Optional<TodoComponentProps>>

    // derived observales from our state
    private openTodos: Observable<Todo[]>
    private doneTodos: Observable<Todo[]>

    private connectComponent() {

        const mapStateToProps = (state: Todo[]) => ({ todos: state });
        const actionMap = {
            setTodoStatus: (todoId: number, status: boolean) => changeTodoStatus.next({ todoId, status })
        };

        this.ConnectedTodoComponent = connect(TodoComponent, { store: this.store, mapStateToProps, actionMap })
    }

    private setupComputedValues() {
        // Using RxJS operators we can transform/map/accumulate values (=computed values) into
        // new Observables...
        this.openTodos = this.store.select(todos => todos)
            .map(todos => todos.filter(todo => todo.done === false))
        this.doneTodos = this.store.select(todos => todos)
            .map(todos => todos.filter(todo => todo.done === true))

        // ...and use the unpackToState() helper function to unpack the observable values automatically to
        // the components internal state
        const unpackMap = { openTodos: this.openTodos, doneTodos: this.doneTodos }
        unpackToState(this, unpackMap)
    }

    componentWillMount() {
        this.store = this.props.store.createSlice<Todo[]>("todos", [], "delete");

        this.connectComponent();

        this.setupComputedValues();

        this.store.addReducer(changeTodoStatus, changeTodoStatusReducer);
        this.store.addReducer(addTodo, addTodoReducer);

        // add some sample todos via the addTodo action
        Observable.from(sampleTodos).subscribe(n => addTodo.next(n));
    }

    componentWillUnmount() {
        // Important: Allways destroy a slice to make sure all subscriptions are unsubscribed.
        // This also unsubscribes any subscriptions to doneTodos or openTodos!
        this.store.destroy();
    }

    render() {
        const { ConnectedTodoComponent } = this;
        return (
            <div>
                <h1>Todo</h1>
                <div className="container">
                    <ConnectedTodoComponent todos={this.props.todos || []} />
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
