# useState

Reactive state machine for React

# Installation

```js
npm install @revskill10/use-state
```

# Usage

```tsx
import { state$ } from '@revskill10/use-state';

export type ExampleProps = {
  text?: String;
};
interface Message {
  Decrement: {
    amount: number;
  };
  Increment: {};
}
export function Example(props: ExampleProps) {
  const [count, dispatch] = state$<number, Message>(0, [
    {
      messages: ['Increment'],
      handler: (c) => {
        c.set(c.get() + 1);
      },
      onChange: (c) => {
        // eslint-disable-next-line no-console
        console.log(`current count is ${c.get()}`);
      },
    },
    {
      messages: ['Decrement'],
      handler: (c, payload) => {
        if ('amount' in payload) {
          c.set(c.get() - payload.amount ?? 1);
        }
      },
    },
  ]);
  return (
    <>
      {`${props.text} ${count}`}
      <button
        onClick={() => dispatch('Increment', {})}
        type="button"
        id="increment-button"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch('Decrement', { amount: 3 })}
        type="button"
        id="decrement-button"
      >
        Decrement
      </button>
    </>
  );
}
```

## Nested object example:

```tsx
import React from 'react';
import { state$ } from '@revskill10/use-state';

interface NestedExampleProps {
  address: {
    addressLine1: string | undefined;
    addressLine2: string | undefined;
  };
  contact?: {
    email: string | undefined;
    phone: string | undefined;
  };
}
interface Message {
  ChangeAddress: {
    addressLine1?: string;
    addressLine2?: string;
  };
}
export function NestedExample(props: NestedExampleProps) {
  const [state, dispatch] = state$<NestedExampleProps, Message>(props, [
    {
      messages: ['ChangeAddress'],
      handler: (_state, payload) => {
        if ('addressLine1' in payload) {
          _state.address.addressLine1.set(payload.addressLine1);
        }
        if ('addressLine2' in payload) {
          _state.address.addressLine2.set(payload.addressLine2);
        }
      },
    },
  ]);

  return (
    <>
      <p>{state.address.addressLine1}</p>
      <p>{state.address.addressLine2}</p>
      {/* // add form to change address line1 and address line 2 */}
      <p>
        <label htmlFor="addressLine1">Address Line 1:</label>
        <input
          type="text"
          id="addressLine1"
          value={state.address.addressLine1}
          onChange={(e) =>
            dispatch('ChangeAddress', { addressLine1: e.target.value })
          }
        />
      </p>
      <p>
        <label htmlFor="addressLine2">Address Line 2:</label>
        <input
          type="text"
          id="addressLine2"
          value={state.address.addressLine2}
          onChange={(e) =>
            dispatch('ChangeAddress', { addressLine2: e.target.value })
          }
        />
      </p>
    </>
  );
}
```

## Todo App example:

```tsx
import { StateDispatch, state$ } from '@revskill10/use-state';

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
function TodoView({ state, dispatch }: StateDispatch<AppState, Message>) {
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

  return (
    <div>
      <h2>Todo List:</h2>
      <ul>
        {state.todos.map((todo) => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            onClick={() => dispatch('ToggleTodo', { id })}
          >
            {todo.text}
          </li>
        ))}
      </ul>
      <TodoView state={state} dispatch={dispatch} />
    </div>
  );
}
```

# API

- One important thing to remember, is the Message is global.
  That means multiple separate components could listen to the same message and react independently.

- Async handler: You can use async await for handler.

```tsx
const [count, dispatch] = state$<AppState, Message>({ value: 0 }, [
    {
      messages: ['Increment'],
      async handler: async (c) => {
        c.loading.set(true);
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        c.loading.set(false);
        c.value.set(c.value.get() + 1);
      }
```
