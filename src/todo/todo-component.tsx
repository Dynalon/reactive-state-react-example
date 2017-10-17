import * as React from "react"
import { Action, Reducer, Store } from "reactive-state"

export interface Todo {
    id: number;
    title: string
    done: boolean
}

export interface TodoComponentProps {
    todos: Todo[],
    setTodoStatus?: (todoId: number, status: boolean) => void
}

export class TodoComponent extends React.Component<TodoComponentProps, {}> {

    private toggleTodo = (todo: Todo) => {
        if (this.props.setTodoStatus) {
            this.props.setTodoStatus(todo.id, !todo.done);
        }
    }

    render() {
        return (
            <div>
                {this.props.todos.map(todo => (<div key={todo.id} onClick={() => this.toggleTodo(todo)} >
                    <input type="checkbox" checked={todo.done} />
                    <span style={ {textDecoration: todo.done ? "line-through" : "none" } } > {todo.title}</span>
                </div>)
                )}
            </div>
        )
    }
}