import React, { ReactElement } from 'react';
import { Layout } from '../components/Layout';

export default (): ReactElement => (
  <Layout>
    <div className="flex flex-auto flex-col items-center justify-center text-white dark:bg-black">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/209282/darkmode.svg"
        alt="Forcir Logo"
        className="h-12 hidden dark:block"
      />
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/209282/logo.svg"
        alt="Forcir Logo"
        className="h-12 dark:hidden"
      />
    </div>
  </Layout>
);
