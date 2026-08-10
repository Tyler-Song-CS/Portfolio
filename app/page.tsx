import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { withBasePath } from "./lib/site";

export default function Home() {
  return (
    <div className="site-shell home-page">
      <div className="top-field">
        <SiteHeader active="work" />
        <main>
          <section
            className="home-hero home-hero--editorial"
            data-home-hero
            aria-labelledby="home-title"
          >
            <div className="site-container home-hero__editorial">
              <p className="eyebrow motion-intro motion-intro--eyebrow">
                Senior software engineer / based in the SF Bay Area
              </p>
              <h1
                id="home-title"
                className="editorial-title editorial-title--developer"
                aria-label="Developer who ships, designs, builds, and solves."
              >
                <span className="editorial-title__line motion-intro" aria-hidden="true">
                  Developer who
                </span>
                <span
                  className="editorial-title__line editorial-title__rotator motion-intro"
                  aria-hidden="true"
                >
                  <span className="editorial-title__rotator-track">
                    <span>ships.</span>
                    <span>designs.</span>
                    <span>builds.</span>
                    <span>solves.</span>
                    <span>ships.</span>
                  </span>
                </span>
              </h1>
              <div className="hero-actions motion-intro motion-intro--actions">
                <a className="text-link" href="#work">
                  scroll to see work <span className="link-mark" aria-hidden="true">↓</span>
                </a>
                <Link className="text-link text-link--quiet" href="/play">
                  or see what I’m into <span className="link-mark" aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </section>

          <div className="work-stage" data-work-stage>
            <section
              className="work-intro work-intro--editorial about-intro"
              id="work"
              data-work-intro
              aria-labelledby="about-title"
            >
              <div className="site-container work-intro__inner">
                <div className="about-intro__content">
                  <h2 id="about-title" className="work-intro__title motion-reveal" data-reveal>
                    Six years of building modern, reliable applications with an eye for
                    detail—across enterprise workflows, CNC simulation, and data analysis.
                  </h2>
                  <p className="about-intro__summary motion-reveal motion-reveal--copy" data-reveal>
                    <strong>
                      I believe the best software makes consequential work feel a little more
                      straightforward.
                    </strong>
                  </p>
                </div>
              </div>
            </section>

            <section className="site-container work-list" aria-label="Work">
              <article className="work-project work-project--oracle">
              <header className="work-project__header motion-reveal" data-reveal>
                <div>
                  <p className="eyebrow">01 / Oracle · 2022—present</p>
                  <p className="meta-label">Enterprise workflows</p>
                </div>
                <p className="meta-label">01 / 03</p>
              </header>
              <div className="work-visual work-visual--oracle" data-reveal data-work-visual>
                <div className="visual-frame visual-frame--oracle">
                  <img
                    className="oracle-approval-screenshot"
                    src={withBasePath("/oracle-approval-routing.png")}
                    alt="Oracle approval configuration interface showing a rule for San Francisco distribution amounts over ten thousand dollars routed to Max Gray."
                  />
                  <div className="work-visual__caption" aria-hidden="true">
                    <p className="work-visual__title">Oracle</p>
                    <p className="work-visual__summary">
                      Approval configuration for Oracle Fusion.
                    </p>
                  </div>
                </div>
                <p className="work-visual__touch-summary sr-only">
                  <strong>Oracle.</strong> Approval configuration for Oracle Fusion.
                </p>
              </div>
              <div
                className="work-project__copy work-project__copy--editorial motion-reveal motion-reveal--copy"
                data-reveal
              >
                <h3>A clearer way to route approvals.</h3>
                <div>
                  <p>
                    At Oracle, I built a next-generation approval configuration application from
                    scratch for Fusion Applications with JavaScript, HTML, and CSS, including
                    AI-assisted analysis and TypeScript-based test automation.
                  </p>
                </div>
              </div>
              <dl className="project-proof motion-reveal" data-reveal>
                <div>
                  <dt>Role</dt>
                  <dd>Senior software engineer</dd>
                </div>
                <div>
                  <dt>Product</dt>
                  <dd>Fusion approval configuration</dd>
                </div>
                <div>
                  <dt>Platform</dt>
                  <dd>Web</dd>
                </div>
              </dl>
              </article>

              <article className="work-project work-project--cgtech">
              <header className="work-project__header motion-reveal" data-reveal>
                <div>
                  <p className="eyebrow">02 / CGTech · 2020—2022</p>
                  <p className="meta-label">Manufacturing software</p>
                </div>
                <p className="meta-label">02 / 03</p>
              </header>
              <div className="work-visual work-visual--cgtech" data-reveal data-work-visual>
                <div className="visual-frame visual-frame--cgtech">
                  <img
                    className="work-screenshot work-screenshot--cgtech"
                    src={withBasePath("/cgtech-vericut-optimization.png")}
                    alt="VERICUT machining simulation showing a tool cutting an aerospace bracket alongside optimization charts."
                  />
                  <div className="work-visual__caption" aria-hidden="true">
                    <p className="work-visual__title">Vericut</p>
                    <p className="work-visual__summary">
                      CNC simulation that catches issues before machining.
                    </p>
                  </div>
                </div>
                <p className="work-visual__touch-summary sr-only">
                  <strong>Vericut.</strong> CNC simulation that catches issues before machining.
                </p>
              </div>
              <div
                className="work-project__copy work-project__copy--editorial motion-reveal motion-reveal--copy"
                data-reveal
              >
                <h3>Catch machining issues before the machine does.</h3>
                <div>
                  <p>
                    Built C++ and Java desktop software for CNC simulation, helping surface errors
                    and collision risks before machining.
                  </p>
                </div>
              </div>
              <dl className="project-proof motion-reveal" data-reveal>
                <div>
                  <dt>Role</dt>
                  <dd>Software engineer</dd>
                </div>
                <div>
                  <dt>Product</dt>
                  <dd>VERICUT</dd>
                </div>
                <div>
                  <dt>Platform</dt>
                  <dd>Windows desktop</dd>
                </div>
              </dl>
              </article>

              <article className="work-project work-project--ucsd">
              <header className="work-project__header motion-reveal" data-reveal>
                <div>
                  <p className="eyebrow">03 / UC San Diego Academic Services · 2017</p>
                  <p className="meta-label">Academic data systems</p>
                </div>
                <p className="meta-label">03 / 03</p>
              </header>
              <div className="work-visual work-visual--ucsd" data-reveal data-work-visual>
                <div className="visual-frame visual-frame--ucsd">
                  <img
                    className="work-screenshot work-screenshot--ucsd"
                    src={withBasePath("/ucsd-cognos-performance-dashboard.png")}
                    alt="IBM Cognos Analytics sales performance dashboard with revenue charts and country and retailer breakdowns."
                  />
                  <div className="work-visual__caption" aria-hidden="true">
                    <p className="work-visual__title">Donation data workflows</p>
                    <p className="work-visual__summary">
                      Faster processing for UC San Diego donation data.
                    </p>
                  </div>
                </div>
                <p className="work-visual__touch-summary sr-only">
                  <strong>Donation data workflows.</strong> Faster processing for UC San Diego
                  donation data.
                </p>
              </div>
              <div
                className="work-project__copy work-project__copy--editorial motion-reveal motion-reveal--copy"
                data-reveal
              >
                <h3>Process large data sets faster.</h3>
                <div>
                  <p>
                    Processed UCSD donation data with Cognos Analytics and modernized JavaScript
                    handling hundreds of thousands of rows, reducing load times by up to 50%.
                  </p>
                </div>
              </div>
              <dl className="project-proof motion-reveal" data-reveal>
                <div>
                  <dt>Role</dt>
                  <dd>Software engineer intern</dd>
                </div>
                <div>
                  <dt>Project</dt>
                  <dd>Donation data workflows</dd>
                </div>
                <div>
                  <dt>Focus</dt>
                  <dd>Data processing &amp; analysis</dd>
                </div>
              </dl>
              </article>
            </section>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
