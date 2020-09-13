import React from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import { appMachine } from './appMachine';
import { AppServiceContext } from './reactContexts';
import { MyDialogLayout } from './MyDialogLayout';
import { delay, upperFirst } from 'lodash/fp';
import { inspect } from '@xstate/inspect';

inspect({ iframe: false });

const appMachineWithOptions = appMachine.withConfig({
  services: {
    saveUser: async (context, { firstName }) => {
      return new Promise((resolve, reject) => {
        if (firstName && firstName.startsWith('b')) {
          return reject(Error(`failed with firstName: ${firstName}`));
        }
        delay(2000, () => resolve({ firstName: upperFirst(firstName) }));
      });
    }
  }
});

function App() {
  const [current, send] = useMachine(appMachineWithOptions, {
    devTools: true // required to use inspect
  });

  const myDialogFirstName = current.context.myDialogFirstName;
  const myDialogError = current.context.myDialogError;
  const myDialogTransientData = current.context.myDialogTransientData;
  const myDialogToggleOpen = () => send('MYDIALOG_TOGGLE_OPEN');
  const myDialogEdit = () => send('MYDIALOG_EDIT');
  const myDialogSave = ({ firstName }) => send('MYDIALOG_SAVE', { firstName });
  const myDialogEscape = () => send('MYDIALOG_ESCAPE');
  const myDialogProps = {
    myDialogFirstName,
    myDialogToggleOpen,
    myDialogEdit,
    myDialogSave,
    myDialogError,
    myDialogTransientData,
    myDialogEscape
  };

  console.log('current.value', current.value);
  console.log('state.context', current.context);

  return (
    <AppServiceContext.Provider value={[current, send]}>
      <div className="App">
        <MyDialogLayout {...myDialogProps} />
      </div>
    </AppServiceContext.Provider>
  );
}

export default App;
