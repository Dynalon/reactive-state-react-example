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

export const TodoComponent: React.FC<TodoComponentProps> = (props) => {
    const toggleTodo = React.useCallback(
        (todo: Todo) => {
            props.setTodoStatus(todo.id, !todo.done);
        },
        [props.setTodoStatus],
    );

    return (
        <div className="link">
            {props.todos.map((todo) => (
                <div key={todo.id} onClick={() => toggleTodo(todo)}>
                    <input type="checkbox" checked={todo.done} onChange={() => undefined} />
                    <span style={{ textDecoration: todo.done ? "line-through" : "none" }}> {todo.title}</span>
                </div>
            ))}
        </div>
    );
};

TodoComponent.defaultProps = {
    todos: [],
};
