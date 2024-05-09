import { Observable, observe } from '@legendapp/state';
import { useMountOnce, useObservable } from '@legendapp/state/react';
import React from 'react';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { useEventBus } from '../use-event-bus';
// This makes React components automatically track get() calls to re-render
enableReactTracking({ auto: true });
type HandlerCreator<State, T> = (
  state: Observable<State>,
  message: T[keyof T]
) => void;
type Listener = {
  unsubscribe: () => void;
};

type EffectHandler<T> = (state: Observable<T>) => void | Promise<void>;

type Config<State, T> = Array<{
  handler: HandlerCreator<State, T>;
  messages: Array<keyof T>;
  onChange?: EffectHandler<State>;
  onMount?: (state: Observable<State>) => void;
}>;

export function state$<State, T extends Record<keyof T, any>>(
  store: State,
  config: Config<State, T>
) {
  const eventBus = useEventBus<T>();
  const state = useObservable(store);
  const handles = config.map((c) => (message: T[keyof T]) => {
    c.handler(state, message);
  });

  observe(() => {
    for (let i = 0; i < config.length; i++) {
      const cfg = config[i];
      if (cfg.onChange) {
        cfg.onChange(state);
      }
    }
  });

  useMountOnce(() => {
    for (let i = 0; i < config.length; i++) {
      const cfg = config[i];
      if (cfg.onMount) {
        cfg.onMount(state);
      }
    }
  });

  const dispatch = (message: keyof T, payload: T[keyof T]) => {
    eventBus.publish({
      payload,
      topic: message,
    });
  };

  React.useEffect(() => {
    const listeners: Array<Listener> = [];
    for (let i = 0; i < config.length; i++) {
      const handle = handles[i];
      const cfg = config[i];
      const tmp = cfg.messages.map((message) =>
        eventBus.subscribe(message, handle)
      );
      for (let tidx = 0; tidx < tmp.length; tidx++) {
        listeners.push(tmp[tidx]);
      }
    }

    return () => {
      listeners.forEach((listener) => listener.unsubscribe());
    };
  }, [eventBus, config]);

  return [state.get(), dispatch];
}
