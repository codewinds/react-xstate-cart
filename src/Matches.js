import React, { useContext } from 'react';
import { AppServiceContext } from './reactContexts';

export function Matches({ children, state }) {
  const [current /*, send */] = useContext(AppServiceContext);
  const matchStates = Array.isArray(state) ? state : [state];

  return matchStates.some((ms) => current.matches(ms)) ? <>{children}</> : null;
}
