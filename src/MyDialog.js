import React from 'react';
import { get } from 'lodash/fp';

export function MyDialogView({ myDialogFirstName, myDialogEdit }) {
  return (
    <div className="myDialogPanel">
      <p>First Name: {myDialogFirstName || 'Anonymous'}</p>
      <button onClick={myDialogEdit}>Edit</button>
    </div>
  );
}
export function MyDialogEdit({
  myDialogFirstName,
  myDialogSave,
  myDialogError,
  myDialogTransientData,
  isBeingSaved
}) {
  return (
    <>
      {myDialogError && <div>{myDialogError.toString()}</div>}
      <form
        method="post"
        onSubmit={(ev) => {
          ev.preventDefault();
          myDialogSave({ firstName: ev.target.firstName.value });
          return false;
        }}
      >
        <input
          name="firstName"
          defaultValue={
            get('firstName', myDialogTransientData) || myDialogFirstName
          }
          placeholder="Enter your first name"
          autoFocus={true}
          disabled={isBeingSaved}
        />
        <button disabled={isBeingSaved}>Save</button>
      </form>
    </>
  );
}
