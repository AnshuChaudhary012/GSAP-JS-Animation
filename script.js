if (typeof gsap === "undefined") {
  throw new Error("GSAP did not load. Check the script links in index.html.");
}

gsap.registerPlugin(ScrollTrigger, Draggable, SplitText, MorphSVGPlugin);

// Level 1: basic tweens
gsap.to(".to-box", {
  x: 120,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
});

gsap.from(".from-box", {
  x: 120,
  opacity: 0,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
});

gsap.fromTo(
  ".fromto-box",
  { x: 0, rotation: 0 },
  { x: 120, rotation: 360, duration: 1.5, repeat: -1, yoyo: true }
);

// Level 2: animation controls and callbacks
const controlStatus = document.querySelector("#control-status");
let controlTween;

function createControlTween() {
  gsap.set(".control-box", { x: 0, rotation: 0 });

  controlTween = gsap.to(".control-box", {
    x: 180,
    rotation: 180,
    duration: 2,
    repeat: 2,
    yoyo: true,
    paused: true,
    onStart: () => {
      controlStatus.textContent = "onStart: the animation started.";
    },
    onUpdate: () => {
      controlStatus.textContent = `onUpdate: ${Math.round(controlTween.progress() * 100)}% complete.`;
    },
    onComplete: () => {
      controlStatus.textContent = "onComplete: the animation finished.";
    },
  });
}

createControlTween();

document.querySelectorAll(".control-button").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.control;

    if (action === "kill") {
      controlTween.kill();
      controlStatus.textContent = "kill(): the animation has been stopped and removed.";
      return;
    }

    if (action === "restart" && controlTween.parent === null) {
      createControlTween();
    }

    controlTween[action]();
    controlStatus.textContent = `${action}() called.`;
  });
});

document.querySelector("#speed-control").addEventListener("input", (event) => {
  const speed = Number(event.target.value);
  controlTween.timeScale(speed);
  document.querySelector("#speed-value").textContent = `${speed}x`;
});

// Level 3: timeline, labels, position parameters, and a nested timeline
const nestedTimeline = gsap.timeline();
nestedTimeline
  .to(".timeline-box:nth-child(2)", { y: -16, duration: 0.3 })
  .to(".timeline-box:nth-child(2)", { y: 0, duration: 0.3 });

const demoTimeline = gsap.timeline({ paused: true });
demoTimeline
  .to(".timeline-box:nth-child(1)", { x: 180, duration: 0.7 })
  .addLabel("middle", "<")
  .to(".timeline-box:nth-child(2)", { x: 180, duration: 0.7 }, "<")
  .to(".timeline-box:nth-child(3)", { x: 180, duration: 0.7 }, "-=0.5")
  .add(nestedTimeline, ">")
  .addLabel("finish", "+=1");

document.querySelectorAll(".timeline-control").forEach((button) => {
  button.addEventListener("click", () => {
    demoTimeline[button.dataset.action]();
  });
});

document.querySelector("#timeline-label").addEventListener("click", () => {
  demoTimeline.tweenTo("middle");
});

// Level 4: grid-based stagger. Change the start point with the buttons.
function playGridStagger(from) {
  gsap.killTweensOf(".grid-box");
  gsap.set(".grid-box", { scale: 1, rotation: 0 });

  gsap.to(".grid-box", {
    scale: 0.35,
    rotation: 90,
    duration: 0.45,
    repeat: 1,
    yoyo: true,
    stagger: {
      grid: [4, 4],
      from,
      amount: 0.8,
    },
    ease: "power1.inOut",
  });
}

document.querySelectorAll(".stagger-button").forEach((button) => {
  button.addEventListener("click", () => {
    playGridStagger(button.dataset.from);
  });
});

playGridStagger("center");

// Level 5: trigger, start/end, markers, toggleActions, and toggleClass.
gsap.fromTo(
  ".scroll-reveal",
  { x: 180, autoAlpha: 0 },
  {
    x: 0,
    autoAlpha: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scroll-reveal-section",
      start: "top 70%",
      end: "bottom 30%",
      toggleActions: "play none none reverse",
      markers: true,
    },
  }
);

gsap.to(".scrub-box", {
  x: () => (window.innerWidth < 640 ? 120 : 260),
  rotation: 360,
  ease: "none",
  scrollTrigger: {
    trigger: ".scrub-area",
    start: "top 75%",
    end: "bottom 25%",
    scrub: true,
    invalidateOnRefresh: true,
  },
});

gsap.to(".pin-section", {
  scrollTrigger: {
    trigger: ".pin-section",
    start: "top center",
    end: "+=350",
    pin: true,
    scrub: true,
  },
});

gsap.to(".toggle-area-box", {
  x: 120,
  scrollTrigger: {
    trigger: ".toggle-area-box",
    start: "top 75%",
    toggleClass: "scale-110",
  },
});

// Level 6: horizontal scroll, snapping, containerAnimation, and parallax.
const horizontalTrack = document.querySelector(".horizontal-track");
const horizontalPanels = gsap.utils.toArray(".horizontal-panel");

const horizontalTween = gsap.to(horizontalTrack, {
  x: () => -(horizontalTrack.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-section",
    start: "top top",
    end: () => `+=${horizontalTrack.scrollWidth - window.innerWidth}`,
    pin: true,
    scrub: 1,
    snap: 1 / (horizontalPanels.length - 1),
    invalidateOnRefresh: true,
  },
});

gsap.from(".horizontal-highlight", {
  scaleX: 0,
  transformOrigin: "left center",
  scrollTrigger: {
    trigger: horizontalPanels[0],
    containerAnimation: horizontalTween,
    start: "left center",
    end: "right center",
    scrub: true,
  },
});

gsap.to(".parallax-circle", {
  y: 90,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-area",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

document.querySelector("#refresh-scroll").addEventListener("click", () => {
  ScrollTrigger.refresh();
});

// Level 7: utilities, quick methods, responsive motion, context, and SVG.
const clamp = gsap.utils.clamp(0, 100);
const mapRange = gsap.utils.mapRange(0, 100, 0, 1);
const randomNumber = gsap.utils.random(1, 100, true);
const wrapNumber = gsap.utils.wrap(0, 10);

document.querySelector("#random-button").addEventListener("click", () => {
  const number = randomNumber();
  const output = document.querySelector("#random-value");
  output.textContent = `Random: ${number} · clamped: ${clamp(number)} · mapped: ${mapRange(number).toFixed(2)} · wrapped: ${wrapNumber(number)}`;
});

const quickMove = gsap.quickTo(".quick-box", "x", {
  duration: 0.3,
  ease: "power2.out",
});
const quickRotate = gsap.quickSetter(".quick-box", "rotation", "deg");
const quickArea = document.querySelector(".quick-area");

quickArea.addEventListener("pointermove", (event) => {
  const bounds = quickArea.getBoundingClientRect();
  const maxX = bounds.width - 48;
  const x = gsap.utils.clamp(0, maxX, event.clientX - bounds.left - 24);
  const rotation = gsap.utils.mapRange(bounds.top, bounds.bottom, -30, 30, event.clientY);

  quickMove(x);
  quickRotate(rotation);
});

const media = gsap.matchMedia();
media.add("(min-width: 640px)", () => {
  gsap.to(".responsive-box", { x: 220, duration: 1.5, repeat: -1, yoyo: true });
});
media.add("(max-width: 639px)", () => {
  gsap.to(".responsive-box", { x: 120, duration: 1.5, repeat: -1, yoyo: true });
});

gsap.to(".svg-circle", {
  attr: { r: 12, cx: 48 },
  duration: 1,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
});

let context = gsap.context(() => {
  gsap.to(".context-box", { x: 160, duration: 1, repeat: -1, yoyo: true });
});
let contextRunning = true;

document.querySelector("#context-button").addEventListener("click", (event) => {
  if (contextRunning) {
    context.revert();
    event.target.textContent = "Start animation";
  } else {
    context = gsap.context(() => {
      gsap.to(".context-box", { x: 160, duration: 1, repeat: -1, yoyo: true });
    });
    event.target.textContent = "Stop animation";
  }
  contextRunning = !contextRunning;
});

// Level 8: pointer, hover, click, drag, text, and SVG interactions.
const cursorArea = document.querySelector(".cursor-area");
const cursor = document.querySelector(".custom-cursor");
const moveCursorX = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power2.out" });
const moveCursorY = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power2.out" });
gsap.set(cursor, { xPercent: -50, yPercent: -50 });

cursorArea.addEventListener("pointermove", (event) => {
  const bounds = cursorArea.getBoundingClientRect();
  moveCursorX(event.clientX - bounds.left);
  moveCursorY(event.clientY - bounds.top);
});

document.querySelector(".hover-box").addEventListener("pointerenter", (event) => {
  gsap.to(event.currentTarget, { scale: 1.1, y: -4, duration: 0.2 });
});
document.querySelector(".hover-box").addEventListener("pointerleave", (event) => {
  gsap.to(event.currentTarget, { scale: 1, y: 0, duration: 0.2 });
});

let clickBoxExpanded = false;
document.querySelector("#click-box").addEventListener("click", (event) => {
  clickBoxExpanded = !clickBoxExpanded;
  gsap.to(event.currentTarget, {
    rotation: clickBoxExpanded ? 12 : 0,
    scale: clickBoxExpanded ? 1.2 : 1,
    duration: 0.3,
    ease: "back.out(2)",
  });
});

Draggable.create(".drag-box", {
  type: "x,y",
  bounds: ".drag-area",
});

const splitText = SplitText.create(".split-text", { type: "chars" });
gsap.from(splitText.chars, {
  y: 30,
  autoAlpha: 0,
  stagger: 0.04,
  duration: 0.6,
  ease: "back.out(1.7)",
});

gsap.to(".morph-shape", {
  duration: 1.5,
  morphSVG: "#star-shape",
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
