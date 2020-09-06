import React from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import { appMachine } from './appMachine';
import { AppServiceContext } from './reactContexts';
import { MyDialogLayout } from './MyDialogLayout';
import { delay, upperFirst } from 'lodash/fp';

const appMachineWithOptions = appMachine.withConfig({
  services: {
    saveUser: async (context, { firstName }) => {
      return new Promise((resolve, reject) => {
        delay(2000, () =>
          // reject(Error(`failed with firstName: ${firstName}`))
          resolve({ firstName: upperFirst(firstName) })
        );
      });
    }
  }
});

function App() {
  const [current, send] = useMachine(appMachineWithOptions);

  const myDialogFirstName = current.context.myDialogFirstName;
  const myDialogError = current.context.myDialogError;
  const myDialogTransientData = current.context.myDialogTransientData;
  const myDialogToggleOpen = () => send('MYDIALOG_TOGGLE_OPEN');
  const myDialogEdit = () => send('MYDIALOG_EDIT');
  const myDialogSave = ({ firstName }) => send('MYDIALOG_SAVE', { firstName });
  const myDialogProps = {
    myDialogFirstName,
    myDialogToggleOpen,
    myDialogEdit,
    myDialogSave,
    myDialogError,
    myDialogTransientData
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
