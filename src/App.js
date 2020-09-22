import React from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import { appMachine } from './appMachine';
import { AppServiceContext } from './reactContexts';
import { CartLayout } from './CartLayout';
import { delay } from 'lodash/fp';
import { inspect } from '@xstate/inspect';
import { toPairs } from 'lodash/fp';

inspect({ iframe: false });

const appMachineWithOptions = appMachine.withConfig({
  services: {
    saveData: async (context, { section, data }) => {
      console.log('overriden saveData', { section, data });
      return new Promise((resolve, reject) => {
        const dataPairs = toPairs(data);
        if (dataPairs.length && dataPairs.every(([k, v]) => v === '')) {
          reject(Error('all values cannot be empty'));
        }

        delay(2000, () => resolve({ section, data }));
      });
    }
  }
});

function App() {
  const [current, send] = useMachine(appMachineWithOptions, {
    devTools: true // required to use inspect
  });

  const { error, transient, items, discounts, account, shipping, receipt } = current.context;
  const toggleOpen = () => send('CART_TOGGLE_OPEN');
  const previous = () => send('CART_PREVIOUS');
  const saveNext = (section, data) => send('CART_SAVE', { section, data });
  const escape = () => send('CART_ESCAPE');
  const isBeingSaved = current.matches('formState.isBeingSaved');

  console.log('isBeingSaved', isBeingSaved);

  const cartProps = {
    error,
    transient,
    isBeingSaved,
    items,
    discounts,
    account,
    shipping,
    receipt,
    toggleOpen,
    previous,
    saveNext,
    escape
  };

  console.log('current.value', current.value);
  console.log('state.context', current.context);

  return (
    <AppServiceContext.Provider value={[current, send]}>
      <div className="App">
        <CartLayout {...cartProps} />
      </div>
    </AppServiceContext.Provider>
  );
}

export default App;
