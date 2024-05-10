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

# API

One important thing to remember, is the Message is global.
That means multiple separate components could listen to the same message and react independently.
