# useState

Reactive state machine for React

# Installation

```js
npm install @revskill10/use-state
```

# Usage

```js
import { state$ } from '@revskill10/use-state';

export type ExampleProps = {
  text?: String;
};
interface Message {
  Increment: {};
  IncrementAnother: {};
}
export function Example(props: ExampleProps) {
  const [count, dispatch] = state$<number, Message>(0, [
    {
      messages: ['Increment'],
      handler: (c, _, { emit }) => {
        c.set(c.get() + 1);
        emit('IncrementAnother', {});
      },
      onChange: (c) => {
        // eslint-disable-next-line no-console
        console.log(`current count is ${c.get()}`);
      },
    },
  ]);
  const [count2] = state$<number, Message>(count + 12, [
    {
      messages: ['IncrementAnother'],
      handler: (c) => {
        c.set(c.get() * 2 + 1);
      },
    },
  ]);
  return (
    <>
      <button
        onClick={() => dispatch('Increment')}
        type="button"
        id="example-button"
      >
        {`${props.text} ${count}`}
      </button>
      <div>{count2}</div>
    </>
  );
}

```
