const trimTrailingSlash = (url: string): string => {
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const useCanonicalUrl = (path = '/'): URL => {
  if (typeof window !== 'undefined') {
    return new URL(window.location.origin + path);
  }

  return new URL(trimTrailingSlash('https://' + process.env.VERCEL_URL));
};
