import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment, ReactElement } from 'react';
import { useCanonicalUrl } from '../hooks/useCanonicalUrl';
import { ComponentHTMLProps } from './types';

interface LayoutProps extends ComponentHTMLProps {
  description?: string;
  title?: string;
}

export const Layout = ({
  children,
  description = 'Generate a stylish meta social preview for your GitHub repository',
  title = 'Social Preview',
}: LayoutProps): ReactElement => {
  const router = useRouter();
  const canonicalURL = useCanonicalUrl(router.pathname);

  return (
    <Fragment>
      <Head>
        {/* Minimal Requirements */}
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href={`${canonicalURL.origin}/images/favicons/favicon.png`} />

        {/* Open Graph Protocol (Facebook) */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalURL.href} />
        <meta property="og:image" content={`${canonicalURL.origin}/images/meta/facebook/default.png`} />
        <meta property="og:site_name" content={title} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalURL.href} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${canonicalURL.origin}/images/meta/twitter/default.png`} />
        <meta name="twitter:site" content="@pqtdev" />
        <meta name="twitter:creator" content="@pqtdev" />
      </Head>

      <header className="site-header"></header>
      <div className="site-content">{children}</div>
      <footer className="site-footer"></footer>
    </Fragment>
  );
};
