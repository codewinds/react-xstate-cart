import React, { useContext } from 'react';
import { partial } from 'lodash/fp';

function Matches(reactContext, { children, state }) {
  const [current /*, send */] = useContext(reactContext);
  const matchStates = Array.isArray(state) ? state : [state];

  return matchStates.some((ms) => current.matches(ms)) ? <>{children}</> : null;
}

function DoesNotMatch(reactContext, { children, state }) {
  const [current /*, send */] = useContext(reactContext);
  const matchStates = Array.isArray(state) ? state : [state];

  return matchStates.every((ms) => !current.matches(ms)) ? (
    <>{children}</>
  ) : null;
}

const AppServiceContext = React.createContext();
const AppServiceMatches = partial(Matches, [AppServiceContext]);
const AppServiceDoesNotMatch = partial(DoesNotMatch, [AppServiceContext]);

export { AppServiceContext, AppServiceMatches, AppServiceDoesNotMatch };
