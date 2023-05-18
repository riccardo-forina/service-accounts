import { To } from 'react-router-dom';

export const linkBasename = '/application-services/service-accounts';
export const mergeToBasename = (
  to: To,
  basename: string = linkBasename
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
