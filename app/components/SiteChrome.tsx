import Link from "next/link";
import { withBasePath } from "../lib/site";

type ActiveRoute = "work" | "play";

type SiteHeaderProps = {
  active: ActiveRoute;
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header motion-intro motion-intro--header">
      <div className="site-container site-header__inner">
        <Link className="site-brand" href="/" aria-label="Tyler Song home">
          tyler song <span aria-hidden="true" />
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link
            className={`site-nav__link ${active === "work" ? "is-current" : ""}`}
            href="/#work"
            aria-current={active === "work" ? "page" : undefined}
          >
            work
          </Link>
          <Link
            className={`site-nav__link ${active === "play" ? "is-current" : ""}`}
            href="/play"
            aria-current={active === "play" ? "page" : undefined}
          >
            play
          </Link>
          <a
            className="site-nav__link"
            href={withBasePath("/Tyler-Song-Resume.pdf")}
            download
            aria-label="Download Tyler Song’s résumé PDF"
          >
            résumé
          </a>
          <a className="site-nav__link is-external" href="mailto:tylersongcs@gmail.com">
            email <span className="link-mark" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-container site-footer__grid">
        <div className="footer-intro">
          <p className="eyebrow eyebrow--lime">Let’s connect</p>
          <h2 className="footer-title">
            Open to building
            <br />
            what’s next.
          </h2>
          <a className="footer-email" href="mailto:tylersongcs@gmail.com">
            tylersongcs@gmail.com <span className="link-mark" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="site-container site-footer__bottom">
        <p>© 2026 Tyler Song · Redwood City, CA</p>
        <p>
          <a href="https://www.linkedin.com/in/tyler-song">LinkedIn</a> ·{" "}
          <a href="https://github.com/TylerSongCS">GitHub</a>
        </p>
      </div>
    </footer>
  );
}
