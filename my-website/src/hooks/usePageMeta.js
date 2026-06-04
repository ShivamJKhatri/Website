import { useEffect } from "react";

const SITE_NAME = "Shivam Khatri";
const DEFAULT_DESCRIPTION =
  "Mechatronics Engineering student at UWaterloo. Portfolio showcasing software, hardware, robotics, and embedded systems projects.";

const PAGE_META = {
  "/": {
    title: `${SITE_NAME} · Mechatronics Engineer`,
    description: DEFAULT_DESCRIPTION,
  },
  "/projects": {
    title: `Projects · ${SITE_NAME}`,
    description:
      "Selected mechatronics, robotics, and software projects — from active knee braces to autonomous systems.",
  },
  "/experiences": {
    title: `Experience · ${SITE_NAME}`,
    description:
      "Firmware engineering, front-end development, and robotics leadership experience.",
  },
  "/contact": {
    title: `Contact · ${SITE_NAME}`,
    description:
      "Get in touch for internships, collaborations, or conversations about engineering and tech.",
  },
};

function setMetaTag(selector, attr, name, content) {
  if (!content) return;

  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta(path) {
  useEffect(() => {
    const meta = PAGE_META[path] || PAGE_META["/"];
    const origin = window.location.origin;
    const url = `${origin}${path === "/" ? "" : path}`;
    const image = `${origin}/og-image.svg`;

    document.title = meta.title;

    setMetaTag('meta[name="description"]', "name", "description", meta.description);
    setMetaTag('meta[property="og:title"]', "property", "og:title", meta.title);
    setMetaTag(
      'meta[property="og:description"]',
      "property",
      "og:description",
      meta.description
    );
    setMetaTag('meta[property="og:url"]', "property", "og:url", url);
    setMetaTag('meta[property="og:image"]', "property", "og:image", image);
    setMetaTag('meta[property="og:type"]', "property", "og:type", "website");
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    setMetaTag(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      meta.description
    );
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [path]);
}
