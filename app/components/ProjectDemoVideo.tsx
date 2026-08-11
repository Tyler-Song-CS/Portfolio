"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type NormalizedPoint = readonly [x: number, y: number];

/**
 * Screen corners expressed against the full scene image, in this order:
 * top-left, top-right, bottom-right, bottom-left.
 *
 * A projective transform—not a rotated rectangle—maps the video into these
 * coordinates. That means the recording follows the phone's perspective in
 * the source photograph instead of being cropped into an approximation.
 */
export type ProjectiveScreenQuad = readonly [
  NormalizedPoint,
  NormalizedPoint,
  NormalizedPoint,
  NormalizedPoint,
];

type ProjectDemoVideoProps = {
  src: string;
  poster: string;
  label: string;
  scene: "mini-guitar" | "clayform";
  sceneImage: string;
  /** A four-corner, normalized map of the physical screen in `sceneImage`. */
  screenQuad?: ProjectiveScreenQuad;
  /** Original scene image width ÷ height, used to mirror `object-fit: cover`. */
  sceneAspect?: number;
  /** Physical display width ÷ height; used to letterbox rather than crop. */
  screenAspect?: number;
  /** The screen colour visible before the demo loads and around letterboxing. */
  screenFill?: string;
  /** Adds an explicit, user-initiated sound toggle for a demo with audio. */
  enableAudioControl?: boolean;
};

type SceneDefaults = {
  screenQuad: ProjectiveScreenQuad;
  sceneAspect: number;
  screenAspect: number;
  screenFill: string;
};

// These are measured against the complete, card-ratio scene images. The photo
// and canvas are always the same aspect ratio, so a normalized point stays in
// exactly the same place at every responsive card size.
const sceneDefaults: Record<ProjectDemoVideoProps["scene"], SceneDefaults> = {
  "mini-guitar": {
    screenQuad: [
      [407 / 1086, 744 / 1448],
      [552 / 1086, 689 / 1448],
      [714 / 1086, 963 / 1448],
      [559 / 1086, 1027 / 1448],
    ],
    sceneAspect: 1086 / 1448,
    screenAspect: 591 / 1280,
    screenFill: "#7f8084",
  },
  clayform: {
    screenQuad: [
      // Extended straight inner-glass edges, measured from the final pottery
      // scene. These are deliberately not the bezel or the rounded-corner
      // pixels: the shader masks those separately after the projection.
      [765 / 1448, 195 / 1086],
      [1062 / 1448, 266 / 1086],
      [901 / 1448, 915 / 1086],
      [602 / 1448, 840 / 1086],
    ],
    sceneAspect: 1448 / 1086,
    screenAspect: 591 / 1280,
    screenFill: "#7c7c7b",
  },
};

const vertexShaderSource = `
  attribute vec2 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform mat3 uInverseHomography;
  uniform vec2 uCanvasSize;
  uniform vec2 uContentScale;
  uniform vec3 uScreenFill;
  uniform float uScreenAspect;
  uniform float uSceneAspect;
  uniform int uHasTexture;

  float roundedBoxDistance(vec2 point, vec2 halfSize, float radius) {
    vec2 distance = abs(point) - halfSize + radius;
    return min(max(distance.x, distance.y), 0.0) + length(max(distance, 0.0)) - radius;
  }

  void main() {
    // gl_FragCoord is bottom-left based; the supplied scene coordinates are
    // conventional image coordinates, with 0,0 in the top-left corner.
    vec2 scenePosition = vec2(
      gl_FragCoord.x / uCanvasSize.x,
      1.0 - (gl_FragCoord.y / uCanvasSize.y)
    );

    // The scene photograph is centered with object-fit: cover, while this
    // canvas fills the card. Convert card coordinates back to the complete
    // source-photo plane before applying the measured homography so the video
    // follows the same crop as the underlying photograph.
    float canvasAspect = uCanvasSize.x / max(uCanvasSize.y, 1.0);
    if (canvasAspect > uSceneAspect) {
      float renderedHeight = canvasAspect / uSceneAspect;
      scenePosition.y = (scenePosition.y - (1.0 - renderedHeight) * 0.5) / renderedHeight;
    } else if (canvasAspect < uSceneAspect) {
      float renderedWidth = uSceneAspect / canvasAspect;
      scenePosition.x = (scenePosition.x - (1.0 - renderedWidth) * 0.5) / renderedWidth;
    }

    vec3 projected = uInverseHomography * vec3(scenePosition, 1.0);
    vec2 screenUv = projected.xy / projected.z;

    if (screenUv.x < 0.0 || screenUv.x > 1.0 || screenUv.y < 0.0 || screenUv.y > 1.0) {
      discard;
    }

    // The edited source photos already contain the physical device bezel. We
    // only paint the glass surface, preserving its rounded corners instead of
    // placing a rectangular video on top of the phone.
    vec2 phonePlane = (screenUv - 0.5) * vec2(uScreenAspect, 1.0);
    if (roundedBoxDistance(phonePlane, vec2(uScreenAspect * 0.5, 0.5), 0.052) > 0.0) {
      discard;
    }

    vec2 padding = (vec2(1.0) - uContentScale) * 0.5;
    bool inContent =
      screenUv.x >= padding.x && screenUv.x <= 1.0 - padding.x &&
      screenUv.y >= padding.y && screenUv.y <= 1.0 - padding.y;

    vec3 colour = uScreenFill;

    if (uHasTexture == 1 && inContent) {
      vec2 textureUv = (screenUv - padding) / uContentScale;
      // Texels from HTML video arrive with their first source row at v = 0.
      // screenUv uses that same top-left convention, so a second vertical
      // flip here would turn the demo upside down.
      colour = texture2D(uTexture, textureUv).rgb;
    }

    // Keep the iPhone 13 notch visible above the video plane. It is drawn in
    // the same canonical screen coordinates as the texture, so it naturally
    // follows the perspective of each photographed device.
    vec2 notchPlane = vec2((screenUv.x - 0.5) * uScreenAspect, screenUv.y - 0.012);
    if (roundedBoxDistance(notchPlane, vec2(uScreenAspect * 0.145, 0.038), 0.026) < 0.0) {
      colour = vec3(0.018, 0.019, 0.022);
    }

    gl_FragColor = vec4(colour, 1.0);
  }
`;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function parseCssColour(colour: string): [number, number, number] {
  // Let the browser parse CSS colours so callers can use a normal token (hex,
  // rgb(), hsl(), named colour, etc.) rather than a bespoke WebGL format.
  const parser = document.createElement("canvas");
  parser.width = 1;
  parser.height = 1;
  const context = parser.getContext("2d", { willReadFrequently: true });

  if (!context) return [248 / 255, 242 / 255, 233 / 255];

  context.fillStyle = "#f8f2e9";
  context.fillStyle = colour;
  context.fillRect(0, 0, 1, 1);

  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  return [red / 255, green / 255, blue / 255];
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Unable to compile project video shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Unable to link project video program:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

/** Solve an 8-variable linear system using Gaussian elimination. */
function solveLinearSystem(rows: number[][]) {
  const size = rows.length;

  for (let pivotColumn = 0; pivotColumn < size; pivotColumn += 1) {
    let pivotRow = pivotColumn;

    for (let row = pivotColumn + 1; row < size; row += 1) {
      if (Math.abs(rows[row][pivotColumn]) > Math.abs(rows[pivotRow][pivotColumn])) {
        pivotRow = row;
      }
    }

    if (Math.abs(rows[pivotRow][pivotColumn]) < 1e-9) return null;

    [rows[pivotColumn], rows[pivotRow]] = [rows[pivotRow], rows[pivotColumn]];

    const pivot = rows[pivotColumn][pivotColumn];
    for (let column = pivotColumn; column <= size; column += 1) {
      rows[pivotColumn][column] /= pivot;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === pivotColumn) continue;
      const factor = rows[row][pivotColumn];
      if (factor === 0) continue;

      for (let column = pivotColumn; column <= size; column += 1) {
        rows[row][column] -= factor * rows[pivotColumn][column];
      }
    }
  }

  return rows.map((row) => row[size]);
}

/**
 * Returns a row-major 3×3 homography that maps [0,1]² to the supplied screen.
 */
function createScreenHomography(quad: ProjectiveScreenQuad) {
  const source: readonly NormalizedPoint[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const equations: number[][] = [];

  source.forEach(([sourceX, sourceY], index) => {
    const [destinationX, destinationY] = quad[index];

    equations.push([
      sourceX,
      sourceY,
      1,
      0,
      0,
      0,
      -destinationX * sourceX,
      -destinationX * sourceY,
      destinationX,
    ]);
    equations.push([
      0,
      0,
      0,
      sourceX,
      sourceY,
      1,
      -destinationY * sourceX,
      -destinationY * sourceY,
      destinationY,
    ]);
  });

  const result = solveLinearSystem(equations);
  if (!result) return null;

  return [
    result[0], result[1], result[2],
    result[3], result[4], result[5],
    result[6], result[7], 1,
  ];
}

function invertMatrix3(matrix: number[]) {
  const [a, b, c, d, e, f, g, h, i] = matrix;
  const determinant = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

  if (Math.abs(determinant) < 1e-10) return null;

  const inverseDeterminant = 1 / determinant;
  return [
    (e * i - f * h) * inverseDeterminant,
    (c * h - b * i) * inverseDeterminant,
    (b * f - c * e) * inverseDeterminant,
    (f * g - d * i) * inverseDeterminant,
    (a * i - c * g) * inverseDeterminant,
    (c * d - a * f) * inverseDeterminant,
    (d * h - e * g) * inverseDeterminant,
    (b * g - a * h) * inverseDeterminant,
    (a * e - b * d) * inverseDeterminant,
  ];
}

function toColumnMajor(matrix: number[]) {
  return new Float32Array([
    matrix[0], matrix[3], matrix[6],
    matrix[1], matrix[4], matrix[7],
    matrix[2], matrix[5], matrix[8],
  ]);
}

function getContainScale(videoAspect: number, screenAspect: number): [number, number] {
  if (!Number.isFinite(videoAspect) || videoAspect <= 0 || !Number.isFinite(screenAspect) || screenAspect <= 0) {
    return [1, 1];
  }

  if (videoAspect > screenAspect) {
    return [1, clamp(screenAspect / videoAspect, 0, 1)];
  }

  return [clamp(videoAspect / screenAspect, 0, 1), 1];
}

/**
 * A muted, in-view demo: it plays only while the project card is on screen
 * and stays still for visitors who request reduced motion. Its texture is
 * projected via an inverse homography in the fragment shader, which keeps all
 * four screen corners attached to the photographed device.
 */
export function ProjectDemoVideo({
  src,
  poster,
  label,
  scene,
  sceneImage,
  screenQuad,
  sceneAspect,
  screenAspect,
  screenFill,
  enableAudioControl = false,
}: ProjectDemoVideoProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isSceneImageReady, setIsSceneImageReady] = useState(false);
  const [isPosterReady, setIsPosterReady] = useState(false);
  const defaults = sceneDefaults[scene];
  const resolvedQuad = screenQuad ?? defaults.screenQuad;
  const resolvedSceneAspect = sceneAspect ?? defaults.sceneAspect;
  const resolvedAspect = screenAspect ?? defaults.screenAspect;
  const resolvedFill = screenFill ?? defaults.screenFill;
  const quadKey = useMemo(() => resolvedQuad.flat().join(","), [resolvedQuad]);

  useEffect(() => {
    const sceneElement = sceneRef.current;
    const image = sceneElement?.querySelector<HTMLImageElement>(".project-demo-scene__image");

    if (!image) {
      // A missing image is still a settled fallback state: do not leave the
      // surrounding card hidden forever if its markup changes unexpectedly.
      setIsSceneImageReady(true);
      return;
    }

    let isCurrent = true;
    const markReady = () => {
      if (isCurrent) setIsSceneImageReady(true);
    };
    const decodeImage = () => {
      // `decode()` ensures a cached image has actually been decoded before
      // the card's reveal can run. A decode failure is equivalent to the
      // image error fallback for readiness purposes.
      if (typeof image.decode !== "function") {
        markReady();
        return;
      }

      void image.decode().catch(() => undefined).then(markReady);
    };
    const handleLoad = () => decodeImage();
    const handleError = () => markReady();

    setIsSceneImageReady(false);

    if (image.complete) {
      if (image.naturalWidth > 0) {
        decodeImage();
      } else {
        handleError();
      }
    } else {
      image.addEventListener("load", handleLoad);
      image.addEventListener("error", handleError);
    }

    return () => {
      isCurrent = false;
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };
  }, [sceneImage]);

  useEffect(() => {
    const video = videoRef.current;
    const sceneElement = sceneRef.current;

    if (!video || !sceneElement) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;
    let hasBeenVisible = false;

    const syncPlayback = () => {
      if (reducedMotion.matches || !isVisible) {
        // The initial observer callback often runs before a button-triggered
        // scroll finishes. Only clear sound after a card has actually been in
        // view, so that callback cannot race an intentional tap on the
        // control itself.
        if (hasBeenVisible) {
          // Audio always requires a fresh, intentional tap when the demo
          // comes back into view. The projected visual can resume silently.
          video.muted = true;
          setAudioEnabled(false);
        }
        video.pause();
        return;
      }

      hasBeenVisible = true;
      void video.play().catch(() => {
        // Browsers may still decline autoplay; the poster remains a complete
        // visual fallback in that case.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.35 },
    );

    const handleMotionChange = () => syncPlayback();

    observer.observe(sceneElement);
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
      video.pause();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) {
      // If the projected poster cannot initialize, the scene image remains a
      // complete fallback. Treat this as a settled error rather than keeping
      // its parent card hidden indefinitely.
      setIsPosterReady(true);
      return;
    }

    const homography = createScreenHomography(resolvedQuad);
    const inverseHomography = homography && invertMatrix3(homography);
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });

    if (!gl || !inverseHomography) {
      setIsPosterReady(true);
      return;
    }

    const program = createProgram(gl);
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();

    if (!program || !buffer || !texture) {
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      setIsPosterReady(true);
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const inverseLocation = gl.getUniformLocation(program, "uInverseHomography");
    const canvasSizeLocation = gl.getUniformLocation(program, "uCanvasSize");
    const contentScaleLocation = gl.getUniformLocation(program, "uContentScale");
    const screenFillLocation = gl.getUniformLocation(program, "uScreenFill");
    const screenAspectLocation = gl.getUniformLocation(program, "uScreenAspect");
    const sceneAspectLocation = gl.getUniformLocation(program, "uSceneAspect");
    const hasTextureLocation = gl.getUniformLocation(program, "uHasTexture");
    const textureLocation = gl.getUniformLocation(program, "uTexture");

    if (
      positionLocation < 0 ||
      !inverseLocation ||
      !canvasSizeLocation ||
      !contentScaleLocation ||
      !screenFillLocation ||
      !screenAspectLocation ||
      !sceneAspectLocation ||
      !hasTextureLocation ||
      !textureLocation
    ) {
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      setIsPosterReady(true);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Keep the source-row orientation unchanged. `screenUv` is explicitly
    // top-left based, so applying UNPACK_FLIP_Y_WEBGL here would invert the
    // video once the texture is projected into the phone.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.uniform1i(textureLocation, 0);
    gl.uniformMatrix3fv(inverseLocation, false, toColumnMajor(inverseHomography));

    const fill = parseCssColour(resolvedFill);
    let frameRequest: number | null = null;
    let posterLoaded = false;
    let posterAspect = resolvedAspect;
    let canvasIsSized = false;
    let posterSettled = false;
    let hasReportedPosterReady = false;

    const reportPosterReady = () => {
      if (hasReportedPosterReady) return;

      hasReportedPosterReady = true;
      setIsPosterReady(true);
    };

    const uploadPoster = (image: HTMLImageElement) => {
      try {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        posterAspect = image.naturalWidth / image.naturalHeight;
        posterLoaded = true;
      } catch {
        posterLoaded = false;
      }
    };

    const draw = () => {
      if (!canvasIsSized) return false;

      const hasVideoFrame =
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        video.videoWidth > 0 &&
        video.videoHeight > 0;
      let activeAspect = posterAspect;
      let hasTexture = posterLoaded;

      if (hasVideoFrame) {
        try {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          activeAspect = video.videoWidth / video.videoHeight;
          hasTexture = true;
        } catch {
          // A frame can occasionally be unavailable during a seek; retain the
          // previous texture rather than flashing a blank rectangle.
        }
      }

      const [contentWidth, contentHeight] = getContainScale(activeAspect, resolvedAspect);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(canvasSizeLocation, canvas.width, canvas.height);
      gl.uniform2f(contentScaleLocation, contentWidth, contentHeight);
      gl.uniform3f(screenFillLocation, fill[0], fill[1], fill[2]);
      gl.uniform1f(screenAspectLocation, resolvedAspect);
      gl.uniform1f(sceneAspectLocation, resolvedSceneAspect);
      gl.uniform1i(hasTextureLocation, hasTexture ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (posterSettled) reportPosterReady();

      return true;
    };

    const drawNextVideoFrame = () => {
      draw();
      if (!video.paused && !video.ended) {
        frameRequest = window.requestAnimationFrame(drawNextVideoFrame);
      } else {
        frameRequest = null;
      }
    };

    const startFrameLoop = () => {
      if (frameRequest === null) {
        frameRequest = window.requestAnimationFrame(drawNextVideoFrame);
      }
    };

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      canvasIsSized = rect.width > 0 && rect.height > 0;
      draw();
    };

    const posterImage = new Image();
    const handlePosterLoad = () => {
      uploadPoster(posterImage);
      posterSettled = true;
      draw();
    };
    const handlePosterError = () => {
      // The scene photograph and shader's fill colour remain intentional
      // fallbacks when a poster request fails.
      posterSettled = true;
      reportPosterReady();
      draw();
    };

    posterImage.addEventListener("load", handlePosterLoad);
    posterImage.addEventListener("error", handlePosterError);
    posterImage.src = poster;

    const handleFrameReady = () => {
      draw();
      startFrameLoop();
    };
    const handleVideoPause = () => draw();

    video.addEventListener("loadeddata", handleFrameReady);
    video.addEventListener("canplay", handleFrameReady);
    video.addEventListener("play", startFrameLoop);
    video.addEventListener("pause", handleVideoPause);
    video.addEventListener("seeked", draw);

    const resizeObserver = new ResizeObserver(sizeCanvas);
    resizeObserver.observe(canvas);
    sizeCanvas();

    return () => {
      if (frameRequest !== null) window.cancelAnimationFrame(frameRequest);
      posterImage.removeEventListener("load", handlePosterLoad);
      posterImage.removeEventListener("error", handlePosterError);
      resizeObserver.disconnect();
      video.removeEventListener("loadeddata", handleFrameReady);
      video.removeEventListener("canplay", handleFrameReady);
      video.removeEventListener("play", startFrameLoop);
      video.removeEventListener("pause", handleVideoPause);
      video.removeEventListener("seeked", draw);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [poster, quadKey, resolvedAspect, resolvedFill, resolvedQuad, resolvedSceneAspect]);

  useEffect(() => {
    const mediaElement = sceneRef.current?.closest<HTMLElement>(
      ".project-card__media[data-demo-reveal]",
    );

    if (!mediaElement) return;

    mediaElement.classList.remove("is-demo-ready");

    if (isSceneImageReady && isPosterReady) {
      mediaElement.classList.add("is-demo-ready");
    }

    return () => {
      mediaElement.classList.remove("is-demo-ready");
    };
  }, [isPosterReady, isSceneImageReady]);

  const toggleAudio = () => {
    const video = videoRef.current;

    if (!video) return;

    const shouldEnableAudio = !audioEnabled;

    // Update both the media element and the control immediately. The click is
    // the user gesture browsers require for audible playback; the existing
    // in-view visual playback continues uninterrupted either way.
    video.muted = !shouldEnableAudio;
    video.defaultMuted = !shouldEnableAudio;
    video.volume = 1;
    setAudioEnabled(shouldEnableAudio);

    if (!shouldEnableAudio) return;

    void video.play().catch(() => {
      // If a browser still declines audible playback, return the control to
      // its truthful muted state without affecting the visual fallback.
      video.muted = true;
      video.defaultMuted = true;
      setAudioEnabled(false);
    });
  };

  return (
    <>
      <div ref={sceneRef} className={`project-demo-scene project-demo-scene--${scene}`}>
        <img className="project-demo-scene__image" src={sceneImage} alt="" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="project-demo-scene__canvas"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "block",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
        <video
          ref={videoRef}
          aria-label={label}
          loop
          muted={!audioEnabled}
          playsInline
          poster={poster}
          preload="metadata"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>

      {enableAudioControl ? (
        <button
          aria-label={audioEnabled ? "Mute Mini Guitar demo sound" : "Play Mini Guitar demo sound"}
          aria-pressed={audioEnabled}
          className="project-demo-scene__audio-toggle"
          data-audio-toggle="mini-guitar"
          onClick={toggleAudio}
          type="button"
        >
          <span aria-hidden="true" className="project-demo-scene__audio-icon">
            {audioEnabled ? (
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M4 10v4h4l5 4V6L8 10H4Z" />
                <path d="m17 9 4 4m0-4-4 4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="m8 5 11 7-11 7V5Z" />
              </svg>
            )}
          </span>
        </button>
      ) : null}
    </>
  );
}
