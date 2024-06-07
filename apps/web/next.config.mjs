const isApp = process.env.PROFILE === "app" || false;
const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  console.log(
    ">>>>--------------------- Development Profile ==================>>>>>>",
    isApp ? "App" : "Web"
  );
}

import AppConfig from "./next.config.app.mjs";
import WebConfig from "./next.config.web.mjs";

export default isApp ? AppConfig : WebConfig;
