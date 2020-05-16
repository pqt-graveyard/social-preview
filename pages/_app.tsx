import { AppProps } from 'next/app';
import React from 'react';
import { defaultValue, NotificationContext } from '../contexts/NotificationContext';
import '../styles/base.css';
import '../styles/tw.css';

// Will be called once for every metric that has to be reported.
// export function reportWebVitals(metric: any): void {
//   // These metrics can be sent to any analytics service
//   console.log(metric);
// }

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <NotificationContext.Provider value={defaultValue}>
      <Component {...pageProps} />
    </NotificationContext.Provider>
  );
}

export default App;
