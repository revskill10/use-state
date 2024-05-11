import React from 'react';
import { state$ } from '../hooks';

export type ExampleProps = {
  text?: String;
};
interface Message {
  Decrement: {
    amount: number;
  };
  Increment: {};
}
interface AppState {
  loading?: boolean;
  value: number;
}
export function AsyncExample(props: ExampleProps) {
  const [count, dispatch] = state$<AppState, Message>({ value: 0 }, [
    {
      messages: ['Increment'],
      handler: async (c) => {
        c.loading.set(true);
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        c.loading.set(false);
        c.value.set(c.value.get() + 1);
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
          c.value.set(c.value.get() - payload.amount ?? 1);
        }
      },
    },
  ]);
  return (
    <>
      {`${props.text} ${count.value}`}
      <button
        onClick={() => dispatch('Increment', {})}
        type="button"
        id="increment-button"
        disabled={count.loading}
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
