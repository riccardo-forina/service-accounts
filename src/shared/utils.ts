import { To } from 'react-router-dom';

const pkg = require('../../package.json');

export const mergeToBasename = (
  to: To,
  basename: string = pkg.insights.appUrl
): To => {
  if (typeof to === 'string') {
    // replace possible "//" after basename
    return `${basename}/${to}`.replace(`^${basename}//`, '/');
  }

  return {
    ...to,
    pathname: `${basename}/${to.pathname}`.replace(`^${basename}//`, '/'),
  };
};

export const appendTo = () =>
  document.getElementById('chrome-app-render-root')!;
