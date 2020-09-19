import React from 'react';
import { fromPairs, get } from 'lodash/fp';

export function MyDialogView({ myDialogData, myDialogEdit }) {
  return (
    <div className="myDialogPanel">
      <p>First Name: {get('firstName', myDialogData) || 'Anonymous'}</p>
      <button onClick={myDialogEdit}>Edit</button>
    </div>
  );
}
export function MyDialogEdit({
  myDialogData,
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
          const formData = new FormData(ev.target);
          const dataObj = fromPairs(Array.from(formData.entries()));
          myDialogSave(dataObj);
        }}
      >
        <input
          name="firstName"
          defaultValue={
            get('firstName', myDialogTransientData) ||
            get('firstName', myDialogData)
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
