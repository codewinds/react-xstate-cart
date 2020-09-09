import { Machine, assign } from 'xstate';

const myDialogEditingStates = {
  initial: 'init',
  states: {
    init: {},
    // validating
    saving: {
      entry: ['myDialogRecordTransient'],
      invoke: {
        // id: 'saveUser', // what does this do?
        src: 'saveUser',
        onDone: {
          target: '#app.mydialog.viewing',
          actions: ['myDialogUpdate']
        },
        onError: {
          target: 'errored',
          actions: ['myDialogErrored']
        }
      }
    },
    errored: {
      on: {
        MYDIALOG_SAVE: 'saving'
      }
    }
  }
};

const appMachine = Machine(
  {
    id: 'app',
    type: 'parallel',
    context: {
      myDialogFirstName: '',
      myDialogError: null,
      myDialogTransientData: null
    },
    states: {
      mydialog: {
        initial: 'closed',
        states: {
          viewing: {
            on: {
              MYDIALOG_TOGGLE_OPEN: 'closed',
              MYDIALOG_EDIT: 'editing'
            }
          },
          editing: {
            on: {
              MYDIALOG_TOGGLE_OPEN: 'closed',
              MYDIALOG_ESCAPE: 'viewing',
              MYDIALOG_SAVE: '.saving'
            },
            ...myDialogEditingStates
          },
          closed: {
            on: {
              MYDIALOG_TOGGLE_OPEN: 'viewing'
            }
          }
        }
      }
    }
  },
  {
    actions: {
      myDialogRecordTransient: assign((context, data) => ({
        myDialogTransientData: data,
        myDialogError: null
      })),
      myDialogUpdate: assign((context, { data: { firstName } }) => ({
        myDialogFirstName: firstName,
        myDialogTransientData: null
      })),
      myDialogErrored: assign((context, { data: err }) => ({
        myDialogError: err
      }))
    },
    services: {
      saveUser: async (context, { firstName }) => {
        console.log('in saveUser', firstName);
        return {
          firstName: firstName.toUpperCase()
        };
      }
    }
  }
);

export { appMachine };
