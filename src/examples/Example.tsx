import './Example.css';

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
