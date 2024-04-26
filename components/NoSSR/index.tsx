import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const NoSSR = ({ children }: { children: ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
);

/**
 * based on https://stackoverflow.com/a/57173209
 */
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
