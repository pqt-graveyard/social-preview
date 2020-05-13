import React, { ReactElement } from 'react';
import { Layout } from '../components/Layout';

export default (): ReactElement => (
  <Layout>
    <div className="flex flex-auto flex-col items-center justify-center text-white dark:bg-black">
      <h1>Social Preview</h1>
    </div>
  </Layout>
);
