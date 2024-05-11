/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { state$ } from '../hooks';

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
