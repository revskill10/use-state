import { Observable, observe } from '@legendapp/state';
import { useMountOnce, useObservable, observer } from '@legendapp/state/react';
import React from 'react';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { useEventBus } from '../use-event-bus';
// This makes React components automatically track get() calls to re-render
enableReactTracking({ auto: true });
type HandlerCreator<State, T> = (
  state: Observable<State>,
  message: T[keyof T],
  bus?: EventBus<T>
) => void | Promise<void>;
type Listener = {
  unsubscribe: () => void;
};
export type Dispatcher<T> = (message: keyof T, payload: T[keyof T]) => void;
type EventBus<T> = {
  emit: (message: keyof T, payload: T[keyof T]) => void;
};

export type StateDispatch<State, M> = {
  dispatch: Dispatcher<M>;
  state: State;
};

type EffectHandler<T, M> = (
  state: Observable<T>,
  bus: EventBus<M>
) => void | Promise<void>;

type Config<State, T> = Array<{
  handler: HandlerCreator<State, T>;
  messages: Array<keyof T>;
  onChange?: EffectHandler<State, T>;
  onMount?: (state: Observable<State>) => void;
}>;
export function state$<State, T extends Record<keyof T, any>>(
  store: State,
  config: Config<State, T>
) {
  const eventBus = useEventBus<T>();
  const currentMessage = useObservable<string>();
  const state = useObservable(store);
  const emit = (message: keyof T, payload: T[keyof T]) => {
    eventBus.publish({
      payload,
      topic: message,
    });
  };
  const handles = React.useMemo(
    () =>
      config.map((c) => (topic: string, message: T[keyof T]) => {
        currentMessage.set(topic);
        c.handler(state, message as T[typeof message], {
          emit,
        });
      }),
    [config]
  );

  observe(() => {
    for (let i = 0; i < config.length; i++) {
      const cfg = config[i];
      const cfgMessages = cfg.messages.map(String);
      if (cfg.onChange && cfgMessages.includes(currentMessage.get())) {
        cfg.onChange(state, { emit });
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

  return [state.get(), emit] as [State, Dispatcher<T>];
}

export { observer };
export type { Observable };
