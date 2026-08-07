const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * GitHub Pages serves this site from /Portfolio rather than from the domain
 * root. Next handles <Link /> routes, while this helper keeps raw public
 * assets—screenshots and the résumé—correct in both environments.
 */
export const siteBasePath = rawBasePath.replace(/\/$/, "");

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ??
  "https://tyler-song-cs.github.io/Portfolio").replace(/\/$/, "");

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteBasePath}${normalizedPath}`;
}
