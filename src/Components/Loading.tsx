import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { VoidFunctionComponent } from 'react';

export const Loading: VoidFunctionComponent = () => (
  <Bullseye>
    <Spinner isSVG aria-label="Loading service accounts" />
  </Bullseye>
);
