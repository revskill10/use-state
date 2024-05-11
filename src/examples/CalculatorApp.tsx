/* eslint-disable react/button-has-type */
import React from 'react';
import { StateDispatch, state$ } from '../hooks';

// Define types
interface CalculatorState {
  display: string;
  memory: string;
  operator: string | null;
  waitingForOperand: boolean;
}

// Define messages
interface CalculatorMessage {
  Clear: {};
  Digit: {
    digit: string;
  };
  Equals: {};
  Operator: {
    operator: string;
  };
}

// Calculator view component
function CalculatorView({
  state,
  dispatch,
}: StateDispatch<CalculatorState, CalculatorMessage>) {
  const handleDigitClick = (digit: string) => {
    dispatch('Digit', { digit });
  };

  const handleOperatorClick = (operator: string) => {
    dispatch('Operator', { operator });
  };

  const handleClearClick = () => {
    dispatch('Clear', {});
  };

  const handleEqualsClick = () => {
    dispatch('Equals', {});
  };

  return (
    <div className="calculator">
      <input type="text" readOnly value={state.display} />
      <div className="buttons">
        <button onClick={() => handleDigitClick('7')}>7</button>
        <button onClick={() => handleDigitClick('8')}>8</button>
        <button onClick={() => handleDigitClick('9')}>9</button>
        <button onClick={() => handleOperatorClick('+')}>+</button>
        <button onClick={() => handleDigitClick('4')}>4</button>
        <button onClick={() => handleDigitClick('5')}>5</button>
        <button onClick={() => handleDigitClick('6')}>6</button>
        <button onClick={() => handleOperatorClick('-')}>-</button>
        <button onClick={() => handleDigitClick('1')}>1</button>
        <button onClick={() => handleDigitClick('2')}>2</button>
        <button onClick={() => handleDigitClick('3')}>3</button>
        <button onClick={() => handleOperatorClick('*')}>*</button>
        <button onClick={() => handleDigitClick('0')}>0</button>
        <button onClick={() => handleClearClick()}>C</button>
        <button onClick={() => handleEqualsClick()}>=</button>
        <button onClick={() => handleOperatorClick('/')}>/</button>
      </div>
      <div className="result">Result: {state.display}</div>
    </div>
  );
}

// Calculator app component
export function CalculatorApp() {
  // Initial state
  const initialState: CalculatorState = {
    display: '0',
    memory: '',
    operator: null,
    waitingForOperand: false,
  };

  // Reducer function
  const [state_, dispatch] = state$<CalculatorState, CalculatorMessage>(
    initialState,
    [
      {
        messages: ['Digit'],
        handler: (state, payload) => {
          if (!('digit' in payload)) {
            return;
          }
          const { digit } = payload;
          if (state.display.get() === '0' || state.waitingForOperand.get()) {
            state.display.set(digit);
            state.waitingForOperand.set(false);
          } else {
            state.display.set(state.display.get() + digit);
          }
        },
      },
      {
        messages: ['Operator'],
        handler: (state, payload) => {
          if (!('operator' in payload)) {
            return;
          }
          const { operator } = payload;
          if (state.operator !== null) {
            dispatch('Equals', {});
          }
          state.memory.set(state.display.get());
          state.operator.set(operator);
          state.waitingForOperand.set(true);
        },
      },
      {
        messages: ['Clear'],
        handler: (state) => {
          state.display.set('0');
          state.memory.set('');
          state.operator.set(null);
          state.waitingForOperand.set(false);
        },
      },
      {
        messages: ['Equals'],
        handler: (state) => {
          const current = parseFloat(state.display.get());
          const memory = parseFloat(state.memory.get());
          let result;
          switch (state.operator.get()) {
            case '+':
              result = memory + current;
              break;
            case '-':
              result = memory - current;
              break;
            case '*':
              result = memory * current;
              break;
            case '/':
              result = memory / current;
              break;
            default:
              result = current;
          }
          state.display.set(result.toString());
          state.memory.set('');
          state.operator.set(null);
          state.waitingForOperand.set(true);
        },
      },
    ]
  );

  return <CalculatorView state={state_} dispatch={dispatch} />;
}
