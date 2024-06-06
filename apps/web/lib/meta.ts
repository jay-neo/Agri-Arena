const APP_NAME = "AgriArena";
const APP_DEFAULT_TITLE = "AgriArena";
const APP_TITLE_TEMPLATE = "%s - AgriArena";
const APP_DESCRIPTION =
  "The smart agriculture web application integrating machine learning and image processing features.";
const APP_URL = process.env.NEXT_PUBLIC_SITE_URL! || "http://localhost:3000";
const APP_TAGLINE = "";

export const meta = {
  APP_NAME,
  APP_URL,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_DEFAULT_TITLE,
  APP_TITLE_TEMPLATE,
} as const;
