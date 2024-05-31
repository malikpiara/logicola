import dynamic from 'next/dynamic';
import React from 'react';

export interface NoSSRProps {
  children: JSX.Element;
}

const NoSSR = (props: NoSSRProps) => (
  <React.Fragment>{props.children}</React.Fragment>
);

/**
 * based on https://stackoverflow.com/a/57173209
 */
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
