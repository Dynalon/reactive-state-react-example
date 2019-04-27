import * as React from "react";
import { Reducer, Store } from "reactive-state";
import { connect } from "reactive-state/react";
import { from, Subject, zip } from "rxjs";
import { map, take } from "rxjs/operators";
import { sampleTodos } from "./sample-todos";
import { Todo, TodoComponent } from "./todo-component";
import { TodoSummaryComponent } from "./todo-summary";

interface ChangeTodoStatusPayload {
    todoId: number;
    status: boolean;
}

const changeTodoStatus = new Subject<ChangeTodoStatusPayload>();

// we use a single reducer for marking as done, and marking as undone
const changeTodoStatusReducer: Reducer<Todo[], ChangeTodoStatusPayload> = (state, payload) => {
    return state.map(todo => {
        if (todo.id !== payload.todoId) return todo;
        else return { ...todo, done: payload.status };
    });
};

const addTodo = new Subject<Todo>();
const addTodoReducer: Reducer<Todo[], Todo> = (state, todo) => [...state, todo];

const ConnectedTodoComponent = connect(
    TodoComponent,
    (store: Store<Todo[]>) => {
        // the strings are just for debugging/devtool and completely optional
        store.addReducer(changeTodoStatus, changeTodoStatusReducer, "CHANGE_TODO_STATUS");
        store.addReducer(addTodo, addTodoReducer, "ADD_TODO");

        const actionMap = {
            setTodoStatus: (todoId: number, status: boolean) => changeTodoStatus.next({ todoId, status }),
        };

        // the input props to our connected component, derived from the state observable
        const props = store.watch(todos => ({ todos }));

        // add some sample todos via the addTodo action if none present
        store
            .watch()
            .pipe(take(1))
            .subscribe(todos => {
                const todolistIsEmpty = todos.length === 0;
                if (todolistIsEmpty) {
                    from(sampleTodos).subscribe(n => addTodo.next(n));
                }
            });

        return {
            actionMap,
            props,
        };
    },
);

export interface TodoProps {
    todos?: Todo[];
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
                        <code>store.watch()</code> returns an observable of the state. Using <code>.pipe()</code> and
                        built-in RxJS operators we can create new observables from the state to create "computed"
                        values, completely eliminating the need to use{" "}
                        <a href="https://github.com/reactjs/reselect" target="_blank">
                            Reselect
                        </a>
                        /
                        <a href="https://github.com/mobxjs/mobx" target="_blank">
                            MobX
                        </a>
                        .
                        <TodoSummaryComponent open={this.props.openTodos.length} done={this.props.doneTodos.length} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    TodoOverview,
    (store: Store<Todo[]>) => {
        // we use RxJS pipe and map to create selectors
        const openTodos = store.watch().pipe(map(todos => todos.filter(todo => todo.done === false)));
        const doneTodos = store.watch().pipe(map(todos => todos.filter(todo => todo.done === true)));

        const props = zip(openTodos, doneTodos).pipe(map(([openTodos, doneTodos]) => ({ openTodos, doneTodos })));

        return {
            props,
        };
    },
);
