/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { StateDispatch, observer, state$ } from '../hooks';

interface Todo {
  completed: boolean;
  id: number;
  text: string;
}

type AppState = {
  newTodoText?: string;
  todos: Todo[];
};

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
const TodoView = observer(
  ({ state, dispatch }: StateDispatch<AppState, Message>) => {
    const handleAddTodo = () => {
      if (state.newTodoText?.trim() !== '') {
        dispatch('AddTodo', { text: state.newTodoText || '' });
      }
    };

    const handleSubmit = (evt: React.FormEvent) => {
      evt.preventDefault();
      handleAddTodo();
    };
    return (
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
    );
  }
);
export const TodoApp = observer((props: TodoAppProps) => {
  const [state, dispatch] = state$<AppState, Message>({ ...props.appState }, [
    {
      messages: ['AddTodo'],
      handler: (_state, payload) => {
        // eslint-disable-next-line no-console
        console.log(`payload`, payload);
        if ('text' in payload) {
          const currentTodos = _state.todos.get();
          const newTodo: Todo = {
            id:
              currentTodos.length > 0
                ? currentTodos[currentTodos.length - 1].id + 1
                : 1,
            text: payload.text,
            completed: false,
          };
          currentTodos.push(newTodo);
          console.log(`xxx`, currentTodos);
          _state.todos.set(currentTodos);
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

  const handleToggleTodo = (id: number) => {
    dispatch('ToggleTodo', { id });
  };

  const { todos } = state;

  return (
    <div>
      <h2>Todo List:</h2>
      {todos.length}
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
            }}
            onClick={() => handleToggleTodo(todo.id)}
          >
            {todo.text}
          </li>
        ))}
      </ul>

      <TodoView state={state} dispatch={dispatch} />
    </div>
  );
});
