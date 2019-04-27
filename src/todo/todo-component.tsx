import * as React from "react";

// This file is a 'dumb' or 'presentational' component with no dependencies except for React itself

export interface Todo {
    id: number;
    title: string;
    done: boolean;
}

export interface TodoComponentProps {
    todos: Todo[];
    setTodoStatus: (todoId: number, status: boolean) => void;
}

export class TodoComponent extends React.Component<TodoComponentProps, {}> {
    public static defaultProps = {
        todos: [],
    };

    private toggleTodo = (todo: Todo) => {
        this.props.setTodoStatus(todo.id, !todo.done);
    };

    render() {
        return (
            <div className="link">
                {this.props.todos.map(todo => (
                    <div key={todo.id} onClick={() => this.toggleTodo(todo)}>
                        <input type="checkbox" checked={todo.done} onChange={() => undefined} />
                        <span style={{ textDecoration: todo.done ? "line-through" : "none" }}> {todo.title}</span>
                    </div>
                ))}
            </div>
        );
    }
}
