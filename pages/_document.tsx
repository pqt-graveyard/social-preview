import React from 'react';
import Document, { DocumentContext, Head, Html, Main, NextScript, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
