/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export interface Message<M extends Record<string, any>, T extends keyof M> {
  payload: M[T];
  topic: T;
}

export interface PublishOptions {
  targetOrigin: string;
  targetWindow: Window;
}

export interface SubscribeOptions {
  targetWindow: Window;
}

export type Handler<Payload extends any> = (
  topic: string,
  payload: Payload
) => void;
