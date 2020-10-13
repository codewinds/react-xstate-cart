import { Machine, assign, send } from 'xstate';

const cartEditingStates = {
  initial: 'init',
  states: {
    init: {},
    saving: {
      entry: ['cartSetIsSaving', 'cartRecordTransient'],
      exit: ['cartClearIsSaving'],
      invoke: {
        id: 'saveData',
        src: 'saveData',
        onDone: {
          actions: ['cartUpdate', 'cartNext']
        },
        onError: {
          target: 'errored',
          actions: ['cartErrored']
        }
      }
    },
    errored: {
      exit: ['cartClearError'],
      on: {
        CART_SAVE: 'saving'
      }
    }
  }
};

const appMachine = Machine(
  {
    id: 'app',
    type: 'parallel',
    context: {
      error: null,
      transient: {},
      items: {},
      discounts: {},
      account: {},
      shipping: {},
      payment: {},
      receipt: {}
    },
    states: {
      formState: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              CART_FORM_SAVING: 'isBeingSaved'
            }
          },
          isBeingSaved: {
            on: {
              CART_FORM_IDLE: 'idle'
            }
          }
        }
      },
      cart: {
        initial: 'closed',
        states: {
          closed: {
            on: {
              CART_TOGGLE_OPEN: 'items'
            }
          },
          items: {
            ...cartEditingStates,
            on: {
              CART_PREVIOUS: 'closed',
              CART_SAVE: '.saving',
              CART_NEXT: 'discounts'
            }
          },
          discounts: {
            ...cartEditingStates,
            on: {
              CART_PREVIOUS: 'items',
              CART_SAVE: '.saving',
              CART_NEXT: 'account'
            }
          },
          account: {
            ...cartEditingStates,
            on: {
              CART_PREVIOUS: 'discounts',
              CART_SAVE: '.saving',
              CART_NEXT: 'shipping'
            }
          },
          shipping: {
            ...cartEditingStates,
            on: {
              CART_PREVIOUS: 'account',
              CART_SAVE: '.saving',
              CART_NEXT: 'payment'
            }
          },
          payment: {
            ...cartEditingStates,
            on: {
              CART_PREVIOUS: 'shipping',
              CART_SAVE: '.saving',
              CART_NEXT: 'review'
            }
          },
          review: {
            ...cartEditingStates,
            on: {
              CART_PREVIOUS: 'payment',
              CART_SAVE: '.saving',
              CART_NEXT: 'receipt'
            }
          },
          receipt: {
            ...cartEditingStates,
            exit: ['cartClearData']
          }
        },
        on: {
          CART_TOGGLE_OPEN: '.closed'
        }
      }
    }
  },
  {
    actions: {
      cartRecordTransient: assign((context, { data: { section, data } }) => ({
        transient: data,
        cartError: null
      })),
      cartSetIsSaving: send((context, event) => ({
        type: 'CART_FORM_SAVING'
      })),
      cartClearIsSaving: send((context, event) => ({
        type: 'CART_FORM_IDLE'
      })),
      cartUpdate: assign((context, { data: { section, data } }) => {
        console.log('cartUpdate', { section, data });
        return {
          [section]: data,
          transient: null
        };
      }),
      cartNext: send((context, event) => ({
        type: 'CART_NEXT'
      })),
      cartClearError: assign((context, event) => ({
        error: null
      })),
      cartErrored: assign((context, { data: err }) => ({
        error: err
      })),
      cartClearData: assign((context, event) => ({
        items: {},
        discounts: {},
        shipping: {},
        payment: {}
      }))
    },
    services: {
      saveData: async (context, { section, data }) => {
        console.log('in saveData', { section, data });
        return { section, data };
      }
    }
  }
);

export { appMachine };
