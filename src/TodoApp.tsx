/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { state$ } from './hooks';

interface Todo {
  completed: boolean;
  id: number;
  text: string;
}

interface AppState {
  newTodoText?: string;
  todos: Todo[];
}

interface TodoAppProps {
  appState: AppState;
}

interface Message {
  AddTodo: {
    text: string;
  };
  ToggleTodo: {
    id: number;
  };
  UpdateNewTodoText: {
    text: string;
  };
}

export function TodoApp(props: TodoAppProps) {
  const [state, dispatch] = state$<AppState, Message>(props.appState, [
    {
      messages: ['AddTodo'],
      handler: (_state, payload) => {
        if ('text' in payload) {
          const newTodo: Todo = {
            id:
              _state.todos.length > 0
                ? _state.todos[_state.todos.length - 1].id.get() + 1
                : 1,
            text: payload.text,
            completed: false,
          };
          _state.todos.push(newTodo);
        }
      },
      onChange: (_, { emit }) => {
        emit('UpdateNewTodoText', { text: '' });
      },
    },
    {
      messages: ['ToggleTodo'],
      handler: (_state, payload) => {
        if ('id' in payload) {
          const toggledTodo = _state.todos.find(
            (todo) => todo.id.get() === payload.id
          );
          if (toggledTodo) {
            toggledTodo.completed.set(!toggledTodo.completed.get());
          }
        }
      },
    },
    {
      messages: ['UpdateNewTodoText'],
      handler: (_state, payload) => {
        if ('text' in payload) {
          _state.newTodoText.set(payload.text);
        }
      },
    },
  ]);

  const handleAddTodo = () => {
    if (state.newTodoText?.trim() !== '') {
      dispatch('AddTodo', { text: state.newTodoText || '' });
    }
  };

  const handleToggleTodo = (id: number) => {
    dispatch('ToggleTodo', { id });
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    handleAddTodo();
  };

  return (
    <div>
      <h2>Todo List:</h2>
      <ul>
        {state.todos.map((todo) => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            onClick={() => handleToggleTodo(todo.id)}
          >
            {todo.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={state.newTodoText}
          onChange={(e) =>
            dispatch('UpdateNewTodoText', { text: e.target.value })
          }
          placeholder="Enter new todo"
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
