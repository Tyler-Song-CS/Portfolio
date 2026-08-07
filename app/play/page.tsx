import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export default function PlayPage() {
  return (
    <div className="site-shell play-page">
      <div className="top-field">
        <SiteHeader active="play" />
        <main>
          <section
            className="play-hero play-hero--editorial"
            data-play-hero
            aria-labelledby="play-title"
          >
            <div className="site-container play-hero__grid play-hero__grid--editorial">
              <div className="play-hero__copy">
                <h1 id="play-title" className="editorial-title editorial-title--play">
                  <span className="editorial-title__line motion-intro">A few things I</span>
                  <span className="editorial-title__line motion-intro">
                    <em className="editorial-title__script">make</em> time for.
                  </span>
                </h1>
                <Link className="text-link motion-intro motion-intro--actions" href="/#work">
                  back to work <span className="link-mark" aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </section>

          <section
            className="play-section play-section--projects"
            data-play-projects
            aria-labelledby="projects-title"
          >
            <div className="site-container">
              <header className="side-projects-intro motion-reveal" data-reveal>
                <p className="eyebrow">Side projects</p>
                <h2 id="projects-title" className="section-display">
                  Small ideas beyond the day job.
                </h2>
              </header>

              <div className="side-project-gallery">
                <article className="side-project side-project--feature motion-reveal" data-reveal>
                  <div className="side-project__visual play-visual" data-play-visual>
                    <div
                      className="side-project__media side-project__media--feature side-project__media--one side-project__media--placeholder play-visual__source"
                      role="img"
                      aria-label="Project one image placeholder"
                    >
                      <span className="meta-label">Image / project 01</span>
                    </div>
                    <div className="play-visual__caption" aria-hidden="true">
                      <p className="play-visual__title">Project title to come.</p>
                      <p className="play-visual__summary">
                        A future screenshot, photograph, or project artifact.
                      </p>
                    </div>
                  </div>
                  <div className="side-project__copy">
                    <p className="meta-label">01 / project placeholder</p>
                    <h3>Project title to come.</h3>
                    <p>A place for a screenshot, photograph, or project artifact.</p>
                  </div>
                </article>

                <article className="side-project side-project--secondary motion-reveal" data-reveal>
                  <div className="side-project__visual play-visual" data-play-visual>
                    <div
                      className="side-project__media side-project__media--secondary side-project__media--two side-project__media--placeholder play-visual__source"
                      role="img"
                      aria-label="Project two image placeholder"
                    >
                      <span className="meta-label">Image / project 02</span>
                    </div>
                    <div className="play-visual__caption" aria-hidden="true">
                      <p className="play-visual__title">Project title to come.</p>
                      <p className="play-visual__summary">
                        Another compact visual story to share here.
                      </p>
                    </div>
                  </div>
                  <div className="side-project__copy">
                    <p className="meta-label">02 / project placeholder</p>
                    <h3>Project title to come.</h3>
                    <p>A space for another project image and a concise introduction.</p>
                  </div>
                </article>

                <article className="side-project side-project--secondary motion-reveal" data-reveal>
                  <div className="side-project__visual play-visual" data-play-visual>
                    <div
                      className="side-project__media side-project__media--secondary side-project__media--three side-project__media--placeholder play-visual__source"
                      role="img"
                      aria-label="Project three image placeholder"
                    >
                      <span className="meta-label">Image / project 03</span>
                    </div>
                    <div className="play-visual__caption" aria-hidden="true">
                      <p className="play-visual__title">Project title to come.</p>
                      <p className="play-visual__summary">
                        A visual placeholder for something still taking shape.
                      </p>
                    </div>
                  </div>
                  <div className="side-project__copy">
                    <p className="meta-label">03 / project placeholder</p>
                    <h3>Project title to come.</h3>
                    <p>A third visual space for something you are still shaping.</p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="play-section play-section--activities" aria-labelledby="activities-title">
            <div className="site-container">
              <header className="activities-intro motion-reveal" data-reveal>
                <p className="eyebrow">Outside work</p>
                <h2 id="activities-title" className="section-display">
                  A few things I come back to.
                </h2>
              </header>

              <div className="activities-grid">
                <article className="activity-card activity-card--tennis motion-reveal" data-reveal>
                  <div className="activity-card__copy">
                    <p className="meta-label">01 / tennis</p>
                    <h3>Tennis.</h3>
                  </div>
                  <div className="activity-card__visual play-visual" data-play-visual>
                    <div className="activity-card__photos play-visual__source" aria-label="Tennis photo placeholders">
                      <figure className="activity-card__image activity-card__image--primary">
                      <span className="meta-label">Photo 01 / tennis</span>
                      </figure>
                      <figure className="activity-card__image activity-card__image--secondary">
                      <span className="meta-label">Photo 02 / tennis</span>
                      </figure>
                    </div>
                    <div className="play-visual__caption" aria-hidden="true">
                      <p className="play-visual__title">Tennis</p>
                      <p className="play-visual__summary">Two photo spots for courts, rallies, and match days.</p>
                    </div>
                  </div>
                </article>

                <article className="activity-card activity-card--pottery motion-reveal" data-reveal>
                  <div className="activity-card__copy">
                    <p className="meta-label">02 / pottery</p>
                    <h3>Pottery.</h3>
                  </div>
                  <div className="activity-card__visual play-visual" data-play-visual>
                    <div className="activity-card__photos play-visual__source" aria-label="Pottery photo placeholders">
                      <figure className="activity-card__image activity-card__image--primary">
                      <span className="meta-label">Photo 01 / pottery</span>
                      </figure>
                      <figure className="activity-card__image activity-card__image--secondary">
                      <span className="meta-label">Photo 02 / pottery</span>
                      </figure>
                    </div>
                    <div className="play-visual__caption" aria-hidden="true">
                      <p className="play-visual__title">Pottery</p>
                      <p className="play-visual__summary">Two photo spots for pieces, clay, and studio time.</p>
                    </div>
                  </div>
                </article>

                <article className="activity-card activity-card--shelter motion-reveal" data-reveal>
                  <div className="activity-card__copy">
                    <p className="meta-label">03 / cat shelter volunteering</p>
                    <h3>Cat shelter volunteering.</h3>
                  </div>
                  <div className="activity-card__visual play-visual" data-play-visual>
                    <div className="activity-card__photos play-visual__source" aria-label="Cat shelter volunteering photo placeholders">
                      <figure className="activity-card__image activity-card__image--primary">
                      <span className="meta-label">Photo 01 / shelter</span>
                      </figure>
                      <figure className="activity-card__image activity-card__image--secondary">
                      <span className="meta-label">Photo 02 / shelter</span>
                      </figure>
                    </div>
                    <div className="play-visual__caption" aria-hidden="true">
                      <p className="play-visual__title">Cat shelter volunteering</p>
                      <p className="play-visual__summary">Two photo spots for shelter days and the cats who make them.</p>
                    </div>
                  </div>
                </article>

                <article className="activity-card activity-card--next motion-reveal" data-reveal>
                  <div className="activity-card__copy">
                    <p className="meta-label">04 / to be added</p>
                    <h3>Something next.</h3>
                  </div>
                  <div className="activity-card__visual play-visual" data-play-visual>
                    <div className="activity-card__photos play-visual__source" aria-label="Fourth activity photo placeholders">
                      <figure className="activity-card__image activity-card__image--primary">
                      <span className="meta-label">Photo 01 / to be added</span>
                      </figure>
                      <figure className="activity-card__image activity-card__image--secondary">
                      <span className="meta-label">Photo 02 / to be added</span>
                      </figure>
                    </div>
                    <div className="play-visual__caption" aria-hidden="true">
                      <p className="play-visual__title">Something next</p>
                      <p className="play-visual__summary">Two photo spots for another thing worth making time for.</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
