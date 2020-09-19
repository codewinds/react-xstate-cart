import { Machine, assign, send } from 'xstate';

const myDialogEditingStates = {
  initial: 'init',
  states: {
    init: {},
    saving: {
      entry: ['myDialogRecordTransient'],
      invoke: {
        id: 'saveUser',
        src: 'saveUser',
        onDone: {
          actions: ['myDialogUpdate', 'myDialogNext']
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
      myDialogData: { firstName: '' },
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
              MYDIALOG_SAVE: '.saving',
              MYDIALOG_NEXT: 'viewing'
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
      myDialogUpdate: assign((context, { data }) => ({
        myDialogData: data,
        myDialogTransientData: null
      })),
      myDialogNext: send((context, event) => ({
        type: 'MYDIALOG_NEXT'
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
