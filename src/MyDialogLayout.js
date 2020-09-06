import React from 'react';
import { Matches } from './Matches';
import { MyDialogView, MyDialogEdit } from './MyDialog';

export function MyDialogLayout(myDialogProps) {
  const { myDialogToggleOpen } = myDialogProps;
  return (
    <div className="myDialog">
      <button onClick={myDialogToggleOpen}>Toggle MyDialog</button>
      <Matches state={['mydialog.viewing', 'mydialog.editing']}>
        <div className="myDialogBody">
          <Matches state={'mydialog.viewing'}>
            <MyDialogView {...myDialogProps} />
          </Matches>
          <Matches state={'mydialog.editing.init'}>
            <MyDialogEdit {...myDialogProps} />
          </Matches>
          <Matches state={'mydialog.editing.saving'}>
            <p>saving...</p>
            <MyDialogEdit {...myDialogProps} isBeingSaved={true} />
          </Matches>
          <Matches state={'mydialog.editing.errored'}>
            <p>An error was enountered while saving!</p>
            <MyDialogEdit {...myDialogProps} />
          </Matches>
        </div>
      </Matches>
    </div>
  );
}
