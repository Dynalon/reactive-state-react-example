import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Observable, Subscription, from, zip } from "rxjs"
import { take, map } from "rxjs/operators"

import { connect, ActionMap, WithStore } from "reactive-state/react"
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

const ConnectedTodoComponent = connect(TodoComponent, (store: Store<Todo[]>) => {

    store.addReducer(changeTodoStatus, changeTodoStatusReducer);
    store.addReducer(addTodo, addTodoReducer);

    const actionMap = {
        setTodoStatus: (todoId: number, status: boolean) => changeTodoStatus.next({ todoId, status })
    };

    const mapStateToProps = () => {
        return store.select().pipe(
            map(todos => ({ todos }))
        )
    };

    // add some sample todos via the addTodo action if none present
    store.select().pipe(take(1)).subscribe(todos => {
        const todolistIsEmpty = todos.length === 0;
        if (todolistIsEmpty) {
            from(sampleTodos).subscribe(n => addTodo.next(n));
        }
    });

    return {
        actionMap,
        mapStateToProps,
    }
});

export interface TodoProps {
    store: Store<any>;
    todos?: Todo[],
    openTodos: Todo[];
    doneTodos: Todo[];
}

class TodoOverview extends React.Component<TodoProps> {

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

                        <TodoSummaryComponent open={this.props.openTodos.length} done={this.props.doneTodos.length} />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(TodoOverview, (store: Store<Todo[]>) => {
    // we use RxJS pipe and map to create selectors
    const openTodos = store.select().pipe(map(todos => todos.filter(todo => todo.done === false)))
    const doneTodos = store.select().pipe(map(todos => todos.filter(todo => todo.done === true)))

    const mapStateToProps = () => {
        return zip(openTodos, doneTodos).pipe(
            map(([openTodos, doneTodos]) => ({ openTodos, doneTodos }))
        )
    }

    return {
        mapStateToProps
    }
});