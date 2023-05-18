import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { mergeToBasename } from './utils';

export const AppLink = (props: LinkProps) => (
  <Link {...props} to={mergeToBasename(props.to)} />
);
