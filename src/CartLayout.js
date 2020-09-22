import React from 'react';
import {
  AppServiceMatches as Matches,
  AppServiceDoesNotMatch as DoesNotMatch
} from './reactContexts';
import useEventListener from '@use-it/event-listener';
import {
  CartItems,
  CartDiscounts,
  CartAccount,
  CartShipping,
  CartReview,
  CartReceipt
} from './Cart';

export function CartLayout(cartProps) {
  const { toggleOpen, escape } = cartProps;
  useEventListener('keydown', ({ keyCode }) => {
    // escape
    if (keyCode === 27) {
      escape();
    }
  });
  return (
    <div className="cart">
      <button onClick={toggleOpen}>Toggle Cart</button>
      <DoesNotMatch state={['cart.closed']}>
        <div className="cartBody">
          <Matches state={'cart.items'}>
            <CartItems {...cartProps} />
          </Matches>
          <Matches state={'cart.discounts'}>
            <CartDiscounts {...cartProps} />
          </Matches>
          <Matches state={'cart.account'}>
            <CartAccount {...cartProps} />
          </Matches>
          <Matches state={'cart.shipping'}>
            <CartShipping {...cartProps} />
          </Matches>
          <Matches state={'cart.review'}>
            <CartReview {...cartProps} />
          </Matches>
          <Matches state={'cart.receipt'}>
            <CartReceipt {...cartProps} />
          </Matches>
          {/* <Matches state={'cart.viewing'}>
            <CartView {...cartProps} />
          </Matches>
          <Matches state={'cart.editing.init'}>
            <CartEdit {...cartProps} />
          </Matches>
          <Matches state={'cart.editing.saving'}>
            <p>saving...</p>
            <CartEdit {...cartProps} isBeingSaved={true} />
          </Matches>
          <Matches state={'cart.editing.errored'}>
            <p>An error was enountered while saving!</p>
            <CartEdit {...cartProps} />
          </Matches> */}
        </div>
      </DoesNotMatch>
    </div>
  );
}
