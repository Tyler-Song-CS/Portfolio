import Link from "next/link";
import {
  ProjectDemoVideo,
  type ProjectiveScreenQuad,
} from "../components/ProjectDemoVideo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { withBasePath } from "../lib/site";

const projects = [
  {
    id: "one",
    number: "01",
    title: "Mini Guitar.",
    description: "Built so I can sing and play guitar at the same time, with chord progressions and playable parts in one place.",
    href: "https://tyler-song-cs.github.io/Mini-Guitar/",
  },
  {
    id: "two",
    number: "02",
    title: "ClayForm Designer.",
    description: "Built to design pots around key dimensions—and calculate the clay needed to make them.",
    href: "https://tyler-song-cs.github.io/Pottery-Design/",
  },
];

const activities = [
  {
    id: "tennis",
    number: "01",
    title: "Tennis.",
    label: "Tennis photo gallery",
  },
  {
    id: "pottery",
    number: "02",
    title: "Pottery.",
    label: "Pottery photo gallery",
  },
  {
    id: "shelter",
    number: "03",
    title: "Cat shelter volunteering.",
    label: "Cat shelter volunteering photo gallery",
  },
  {
    id: "travel",
    number: "04",
    title: "Travel.",
    label: "Travel photo gallery",
  },
];

// Measured against the complete generated scene assets—not the card box—so
// both videos remain aligned when the gallery changes size responsively.
const miniGuitarScreen: ProjectiveScreenQuad = [
  [407 / 1086, 744 / 1448],
  [552 / 1086, 689 / 1448],
  [714 / 1086, 963 / 1448],
  [559 / 1086, 1027 / 1448],
];

const clayFormScreen: ProjectiveScreenQuad = [
  [765 / 1448, 195 / 1086],
  [1062 / 1448, 266 / 1086],
  [901 / 1448, 915 / 1086],
  [602 / 1448, 840 / 1086],
];

const iPhone13Aspect = 591 / 1280;

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
            <div className="site-container play-hero__grid play-hero__grid--studio">
              <div className="play-hero__copy">
                <h1 id="play-title" className="editorial-title editorial-title--play">
                  <span className="editorial-title__line motion-intro">A few things I</span>
                  <span className="editorial-title__line motion-intro">
                    <span className="play-hero__accent">make</span> time for.
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
            aria-label="Side projects"
          >
            <div className="site-container">
              <header className="play-section__intro motion-reveal" data-reveal>
                <p className="eyebrow">Side projects</p>
              </header>

              <div className="project-gallery">
                {projects.map((project) => (
                  <article
                    className={`project-card project-card--${project.id}`}
                    key={project.id}
                  >
                    {project.id === "one" ? (
                      <div
                        className="project-card__media project-card__media--mini-guitar"
                        data-demo-reveal
                        data-media-reveal
                        data-reveal
                        data-visual-reveal
                      >
                        <ProjectDemoVideo
                          enableAudioControl
                          label="Mini Guitar app demo showing song sections, chord progressions, and a playable guitar."
                          poster={withBasePath("/mini-guitar-demo-poster.png")}
                          scene="mini-guitar"
                          sceneImage={withBasePath("/side-project-scenes/mini-guitar-iphone13-scene.png")}
                          screenAspect={iPhone13Aspect}
                          screenFill="#7f8084"
                          screenQuad={miniGuitarScreen}
                          src={withBasePath("/mini-guitar-demo.mp4")}
                        />
                      </div>
                    ) : project.id === "two" ? (
                      <div
                        className="project-card__media project-card__media--clayform"
                        data-demo-reveal
                        data-media-reveal
                        data-reveal
                        data-visual-reveal
                      >
                        <ProjectDemoVideo
                          label="Muted ClayForm Designer app demo showing an adjustable vase profile."
                          poster={withBasePath("/clayform-designer-demo-poster.png")}
                          scene="clayform"
                          sceneImage={withBasePath("/side-project-scenes/clayform-iphone13-scene.png")}
                          screenAspect={iPhone13Aspect}
                          screenFill="#7c7c7b"
                          screenQuad={clayFormScreen}
                          src={withBasePath("/clayform-designer-demo.mp4")}
                        />
                      </div>
                    ) : (
                      <div className="project-card__media" data-reveal data-visual-reveal />
                    )}
                    <div className="project-card__copy">
                      <p className="meta-label">{project.number}</p>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <a
                        className="text-link project-card__link"
                        href={project.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        view project <span className="link-mark" aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="play-section play-section--activities" aria-label="Away from the desk">
            <div className="site-container">
              <header className="play-section__intro play-section__intro--activities motion-reveal" data-reveal>
                <p className="eyebrow">Away from the desk</p>
              </header>

              <div className="activity-gallery">
                {activities.map((activity) => (
                  <article
                    className={`activity-card activity-card--${activity.id} motion-reveal`}
                    data-media-reveal
                    data-reveal
                    key={activity.id}
                  >
                    <div className="activity-media" aria-label={activity.label}>
                      {activity.id === "tennis" ? (
                        <>
                          <figure className="activity-media__photo activity-media__photo--primary">
                            <img
                              alt="Tyler and fellow players holding racquets on a tennis court."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/tennis-court.jpg")}
                            />
                          </figure>
                          <figure className="activity-media__photo activity-media__photo--secondary">
                            <img
                              alt="Tyler with friends at Indian Wells Tennis Paradise."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/tennis-paradise.jpg")}
                            />
                          </figure>
                        </>
                      ) : activity.id === "pottery" ? (
                        <>
                          <figure className="activity-media__photo activity-media__photo--four">
                            <img
                              alt="Orange flowers arranged in a handmade white vase."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/pottery-flowers.jpg")}
                            />
                          </figure>
                          <figure className="activity-media__photo activity-media__photo--two">
                            <img
                              alt="A collection of handmade ceramic mugs."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/pottery-mugs.jpg")}
                            />
                          </figure>
                          <figure className="activity-media__photo activity-media__photo--one">
                            <img
                              alt="A red glazed bowl made by Tyler."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/pottery-red-bowl.jpg")}
                            />
                          </figure>
                          <figure className="activity-media__photo activity-media__photo--three">
                            <img
                              alt="A group of handmade ceramic vases in the studio."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/pottery-vases.jpg")}
                            />
                          </figure>
                        </>
                      ) : activity.id === "shelter" ? (
                        <>
                          <figure className="activity-media__photo activity-media__photo--one">
                            <img
                              alt="A shelter kitten reflected in a round mirror."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/cat-shelter-mirror.jpg")}
                            />
                          </figure>
                          <figure className="activity-media__photo activity-media__photo--two">
                            <img
                              alt="A large cat sculpture outside Nine Lives Foundation."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/cat-shelter-mascot.jpg")}
                            />
                          </figure>
                          <figure className="activity-media__photo activity-media__photo--three">
                            <img
                              alt="A shelter kitten wearing a red striped bow tie."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/cat-shelter-bowtie.jpg")}
                            />
                          </figure>
                          <figure className="activity-media__photo activity-media__photo--four">
                            <img
                              alt="Two shelter kittens curled up together beneath a chair."
                              decoding="async"
                              loading="lazy"
                              src={withBasePath("/activities/cat-shelter-nap.jpg")}
                            />
                          </figure>
                        </>
                      ) : (
                        <>
                          <div className="activity-media__column activity-media__column--wide">
                            <figure className="activity-media__photo activity-media__photo--one">
                              <img
                                alt="Tyler reflected in a playful Paint-themed installation."
                                decoding="async"
                                loading="lazy"
                                src={withBasePath("/activities/travel-paint.jpg")}
                              />
                            </figure>
                            <figure className="activity-media__photo activity-media__photo--two">
                              <img
                                alt="Tyler at the Banff sign with mountain scenery behind him."
                                decoding="async"
                                loading="lazy"
                                src={withBasePath("/activities/travel-banff.jpg")}
                              />
                            </figure>
                          </div>
                          <div className="activity-media__column activity-media__column--tall">
                            <figure className="activity-media__photo activity-media__photo--three">
                              <img
                                alt="Tyler standing in a colorful immersive installation."
                                decoding="async"
                                loading="lazy"
                                src={withBasePath("/activities/travel-yellow-gallery.jpg")}
                              />
                            </figure>
                            <figure className="activity-media__photo activity-media__photo--four">
                              <img
                                alt="Tyler surrounded by blue light in an immersive installation."
                                decoding="async"
                                loading="lazy"
                                src={withBasePath("/activities/travel-blue-gallery.jpg")}
                              />
                            </figure>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="activity-card__copy">
                      <p className="meta-label">{activity.number}</p>
                      <h3>{activity.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
