import React from 'react';
import { fromPairs, get } from 'lodash/fp';

function Form({ error, section, previous, saveNext, isBeingSaved, saveLabel, children }) {
  return (
    <>
      {error && <div>{error.toString()}</div>}
      <form
        method="post"
        onSubmit={(ev) => {
          ev.preventDefault();
          const formData = new FormData(ev.target);
          const dataObj = fromPairs(Array.from(formData.entries()));
          saveNext(section, dataObj);
        }}
      >
        {children}
        <div className="buttons">
          <button type="button" onClick={previous} disabled={isBeingSaved}>
            Previous
          </button>
          <button disabled={isBeingSaved}>{saveLabel || 'Save'}</button>
        </div>
      </form>
    </>
  );
}

function Input({ name, placeholder, transient, sectionData, isBeingSaved, preText, autoFocus = false }) {
  return (
    <div>
      {preText}
      <input
        name={name}
        defaultValue={get(name, transient) || get(name, sectionData)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={isBeingSaved}
      />
    </div>
  );
}

export function CartItems(cartProps) {
  const { error, transient, isBeingSaved, previous, saveNext } = cartProps;
  const section = 'items';
  const sectionData = cartProps[section];
  const commonProps = { transient, sectionData, isBeingSaved };
  const formProps = { error, section, previous, saveNext, isBeingSaved };
  return (
    <div className="cartPanel">
      <h1>Items</h1>
      <Form {...formProps}>
        <Input name="ebookCount" preText="Fantastic ebook" autoFocus={true} {...commonProps} />
      </Form>
    </div>
  );
}

export function CartDiscounts(cartProps) {
  const { error, transient, isBeingSaved, previous, saveNext } = cartProps;
  const section = 'discounts';
  const sectionData = cartProps[section];
  const commonProps = { transient, sectionData, isBeingSaved };
  const formProps = { error, section, previous, saveNext, isBeingSaved };
  return (
    <div className="cartPanel">
      <h1>Discounts</h1>
      <Form {...formProps}>
        <Input name="code" placeholder="Enter your discount code" autoFocus={true} {...commonProps} />
      </Form>
    </div>
  );
}

export function CartAccount(cartProps) {
  const { error, transient, isBeingSaved, previous, saveNext } = cartProps;
  const section = 'account';
  const sectionData = cartProps[section];
  const commonProps = { transient, sectionData, isBeingSaved };
  const formProps = { error, section, previous, saveNext, isBeingSaved };
  return (
    <div className="cartPanel">
      <h1>Account</h1>
      <Form {...formProps}>
        <Input name="email" placeholder="Enter your email" autoFocus={true} {...commonProps} />
      </Form>
    </div>
  );
}

export function CartShipping(cartProps) {
  const { error, transient, isBeingSaved, previous, saveNext } = cartProps;
  const section = 'shipping';
  const sectionData = cartProps[section];
  const commonProps = { transient, sectionData, isBeingSaved };
  const formProps = { error, section, previous, saveNext, isBeingSaved };
  return (
    <div className="cartPanel">
      <h1>Shipping</h1>
      <Form {...formProps}>
        <Input name="address1" placeholder="Enter your address line 1" autoFocus={true} {...commonProps} />
        <Input name="address2" placeholder="Enter your address line 2" {...commonProps} />
      </Form>
    </div>
  );
}

export function CartPayment(cartProps) {
  const { error, transient, isBeingSaved, previous, saveNext } = cartProps;
  const section = 'payment';
  const sectionData = cartProps[section];
  const commonProps = { transient, sectionData, isBeingSaved };
  const formProps = { error, section, previous, saveNext, isBeingSaved };
  return (
    <div className="cartPanel">
      <h1>Payment</h1>
      <Form {...formProps}>
        <Input name="creditCard" placeholder="Enter your credit card number" autoFocus={true} {...commonProps} />
        <Input name="nameOnCard" placeholder="Enter the name on your card" {...commonProps} />
      </Form>
    </div>
  );
}

export function CartReview(cartProps) {
  const { error, isBeingSaved, previous, saveNext } = cartProps;
  const section = 'review';
  const formProps = {
    error,
    section,
    previous,
    saveNext,
    isBeingSaved,
    saveLabel: 'Pay'
  };
  return (
    <div className="cartPanel">
      <h1>Review</h1>
      <Form {...formProps}>
        <DisplayDetails {...cartProps} />
      </Form>
    </div>
  );
}

export function CartReceipt(cartProps) {
  return (
    <div className="cartPanel">
      <h1>Receipt</h1>
      <p>
        Download link: <a href="foo">Fantastic Ebook</a>
      </p>
      <DisplayDetails {...cartProps} />
    </div>
  );
}

function DisplayDetails(cartProps) {
  const total = 10 * cartProps.items.ebookCount;
  return (
    <>
      <h4>Item Quantity</h4>
      <p>Fantastic Ebook: {cartProps.items.ebookCount}</p>
      <h4>Discounts</h4>
      <p>Discount code: {cartProps.discounts.code}</p>
      <h4>Account</h4>
      <p>Email: {cartProps.account.email}</p>
      <h4>Shipping</h4>
      <p>
        Address Line 1: {cartProps.shipping.address1}
        <br />
        Address Line 2: {cartProps.shipping.address2}
      </p>
      <h4>Shipping</h4>
      <p>
        Credit Card: {cartProps.payment.creditCard}
        <br />
        Name: {cartProps.payment.nameOnCard}
      </p>
      <h4>Total</h4>
      <p>Total: ${total}</p>
    </>
  );
}
