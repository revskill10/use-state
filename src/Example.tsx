import './Example.css';

import React from 'react';
import { state$ } from './hooks';

export type ExampleProps = {
  text?: String;
};
interface Message {
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
  ]);
  return (
    <button
      onClick={() => dispatch('Increment')}
      type="button"
      id="example-button"
    >
      {`${props.text} ${count}`}
    </button>
  );
}
