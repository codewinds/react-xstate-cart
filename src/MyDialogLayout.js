import React from 'react';
import { AppServiceMatches as Matches } from './reactContexts';
import useEventListener from '@use-it/event-listener';
import { MyDialogView, MyDialogEdit } from './MyDialog';

export function MyDialogLayout(myDialogProps) {
  const { myDialogToggleOpen, myDialogEscape } = myDialogProps;
  useEventListener('keydown', ({ keyCode }) => {
    // escape
    if (keyCode === 27) {
      myDialogEscape();
    }
  });
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
