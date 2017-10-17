import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"
import { Observable } from "rxjs/Rx"

import { connect } from "../reactive-state-react"
import { Todo, TodoComponent, TodoComponentProps } from "./todo-component";

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
const addTodoReducer: Reducer<Todo[], Todo> = (state, todo) => [ ...state, todo ]

const mapStateToProps = (state: Todo[]) => ({ todos: state });

const actionMap = {
    setTodoStatus: (todoId: number, status: boolean) => changeTodoStatus.next({ todoId, status })
};

export class TodoExample extends React.Component<TodoProps, {}> {

    private store: Store<Todo[]>;
    private ConnectedTodoComponent: React.ComponentClass<TodoComponentProps>;

    componentWillMount() {
        this.store = this.props.store.createSlice<Todo[]>("todos", [], "delete");

        this.ConnectedTodoComponent = connect(TodoComponent, this.store, mapStateToProps, actionMap)

        this.store.addReducer(changeTodoStatus, changeTodoStatusReducer);
        this.store.addReducer(addTodo, addTodoReducer);

        // add some sample todos via the addTodo action
        Observable.from(sampleTodos).subscribe(n => addTodo.next(n));
    }

    componentWillUnmount() {
        this.store.destroy();
    }

    render() {
        const { ConnectedTodoComponent } = this;
        return (
            <div>
                <h1>Todo</h1>
                <ConnectedTodoComponent todos={this.props.todos || []} />
            </div>
        )
    }
}

const sampleTodos: Todo[] = [
    {
        id: 1,
        title: "Do Homework",
        done: false
    },
    {
        id: 2,
        title: "Walk the dog",
        done: false
    },
    {
        id: 3,
        title: "Get groceries",
        done: false
    }
]