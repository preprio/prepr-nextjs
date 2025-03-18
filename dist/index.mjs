import {
  __async
} from "./chunk-IQXHJV5O.mjs";

// src/index.ts
import { NextResponse } from "next/server";
import { ipAddress } from "@vercel/functions";
import { headers } from "next/headers";

// package.json
var package_default = {
  name: "@preprio/prepr-nextjs",
  version: "1.2.0",
  description: "A next.js package containing helper functions and a preview bar to use in combination with Prepr",
  main: "./dist/index.js",
  types: "./dist/index.d.ts",
  module: "./dist/index.mjs",
  files: [
    "dist",
    "package.json"
  ],
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.js"
    },
    "./components": {
      types: "./dist/components.d.ts",
      import: "./dist/components.js",
      require: "./dist/components.js"
    },
    "./dist/components.css": {
      import: "./dist/components.css",
      require: "./dist/components.css"
    },
    "./dist/main.css": {
      import: "./dist/main.css",
      require: "./dist/main.css"
    }
  },
  scripts: {
    build: "tsup",
    dev: "tsup --watch"
  },
  author: "Prepr",
  license: "ISC",
  devDependencies: {
    "@types/react": "^18.3.3",
    autoprefixer: "^10.4.20",
    postcss: "^8.4.47",
    prettier: "3.3.3",
    tailwindcss: "^3.4.13",
    "ts-node": "^10.9.2",
    tsup: "^8.2.4",
    typescript: "^5.5.4"
  },
  dependencies: {
    "@headlessui/react": "^2.1.8",
    "@vercel/functions": "^1.6.0",
    classnames: "^2.5.1",
    clsx: "^2.1.1",
    micromatch: "^4.0.8",
    next: "^15.2.2",
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.3.0",
    rollup: "^4.22.4"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/preprio/prepr-nextjs.git"
  },
  keywords: [
    "prepr",
    "nextjs"
  ],
  bugs: {
    url: "https://github.com/preprio/prepr-nextjs/issues"
  },
  homepage: "https://github.com/preprio/prepr-nextjs#readme"
};

// src/utils.ts
function getPackageVersion() {
  return package_default.version;
}

// src/index.ts
function PreprMiddleware(request) {
  var _a, _b, _c, _d;
  const newResponse = NextResponse.next();
  const utm_source = request.nextUrl.searchParams.get("utm_source");
  const utm_medium = request.nextUrl.searchParams.get("utm_medium");
  const utm_term = request.nextUrl.searchParams.get("utm_term");
  const utm_content = request.nextUrl.searchParams.get("utm_content");
  const utm_campaign = request.nextUrl.searchParams.get("utm_campaign");
  const initial_referral = request.headers.get("referer");
  const ip = ipAddress(request);
  if (ip) {
    newResponse.headers.set("Prepr-Visitor-IP", ip);
  }
  const hutkCookie = (_a = request.cookies.get("hubspotutk")) == null ? void 0 : _a.value;
  if (utm_source) {
    newResponse.headers.set("Prepr-Context-utm_source", utm_source);
  }
  if (utm_medium) {
    newResponse.headers.set("Prepr-Context-utm_medium", utm_medium);
  }
  if (utm_term) {
    newResponse.headers.set("Prepr-Context-utm_term", utm_term);
  }
  if (utm_content) {
    newResponse.headers.set("Prepr-Context-utm_content", utm_content);
  }
  if (utm_campaign) {
    newResponse.headers.set("Prepr-Context-utm_campaign", utm_campaign);
  }
  if (hutkCookie) {
    newResponse.headers.set("Prepr-Hubspot-Id", hutkCookie);
  }
  if (initial_referral) {
    newResponse.headers.set(
      "prepr-context-initial_referral",
      initial_referral
    );
  }
  let cookie = (_b = request.cookies.get("__prepr_uid")) == null ? void 0 : _b.value;
  if (!cookie) {
    cookie = crypto.randomUUID();
    newResponse.cookies.set("__prepr_uid", cookie, {
      maxAge: 1 * 365 * 24 * 60
      // Set for one year
    });
    newResponse.headers.set("Prepr-Customer-Id-Created", "true");
  }
  newResponse.headers.set("Prepr-Customer-Id", cookie);
  if (process.env.PREPR_ENV === "preview") {
    newResponse.headers.set("Prepr-Preview-Bar", "true");
    if (request.nextUrl.searchParams.has("prepr_preview_segment")) {
      const segments = request.nextUrl.searchParams.get(
        "prepr_preview_segment"
      );
      if (segments) {
        newResponse.headers.set("Prepr-Segments", segments);
        newResponse.cookies.set("Prepr-Segments", segments, {
          maxAge: 60
          // Set for one year
        });
      }
    }
    if (request.nextUrl.searchParams.has("prepr_preview_ab")) {
      const ab_testing = request.nextUrl.searchParams.get("prepr_preview_ab");
      let value = ab_testing == null ? void 0 : ab_testing.toUpperCase();
      if (value === "B") {
        value = "B";
      } else {
        value = "A";
      }
      newResponse.headers.set("Prepr-ABtesting", value);
      newResponse.cookies.set("Prepr-ABtesting", value, {
        maxAge: 60
        // Set for one year
      });
    }
    const segmentCookie = (_c = request.cookies.get("Prepr-Segments")) == null ? void 0 : _c.value;
    if (segmentCookie) {
      newResponse.headers.set("Prepr-Segments", segmentCookie);
    }
    const abCookie = (_d = request.cookies.get("Prepr-ABtesting")) == null ? void 0 : _d.value;
    if (abCookie) {
      newResponse.headers.set("Prepr-ABtesting", abCookie);
    }
  }
  return newResponse;
}
function getPreprUUID() {
  return __async(this, null, function* () {
    const headersList = yield headers();
    return headersList.get("prepr-customer-id");
  });
}
function getActiveSegment() {
  return __async(this, null, function* () {
    const headersList = yield headers();
    return headersList.get("Prepr-Segments");
  });
}
function getActiveVariant() {
  return __async(this, null, function* () {
    const headersList = yield headers();
    return headersList.get("Prepr-ABtesting");
  });
}
function getPreprHeaders() {
  return __async(this, null, function* () {
    let newHeaders = {};
    const headersList = yield headers();
    headersList.forEach((value, key) => {
      if (key.startsWith("prepr")) {
        newHeaders[key] = value;
      }
    });
    return newHeaders;
  });
}
function getPreprEnvironmentSegments(token) {
  return __async(this, null, function* () {
    var _a;
    if (!token) {
      console.error(
        "No token provided, make sure you are using your Prepr GraphQL URL"
      );
      return [];
    }
    if (!token.startsWith("https://")) {
      console.error(
        "Invalid token provided, make sure you are using your Prepr GraphQL URL"
      );
      return [];
    }
    try {
      const response = yield fetch(token, {
        headers: {
          "User-Agent": `Prepr-Preview-Bar/${getPackageVersion()}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          query: `{
                _Segments {
                    _id
                    name
                }
            }`
        })
      });
      try {
        const json = yield response.json();
        if (!json || !json.data || !json.data._Segments) {
          return [];
        }
        return (_a = json.data) == null ? void 0 : _a._Segments;
      } catch (jsonError) {
        console.error("Error parsing JSON, please contact Prepr support");
        return [];
      }
    } catch (error) {
      console.error("Error fetching segments:", error);
      return [];
    }
  });
}
function getPreviewBarProps(token) {
  return __async(this, null, function* () {
    let data = [];
    let activeSegment, activeVariant;
    if (process.env.PREPR_ENV === "preview") {
      data = yield getPreprEnvironmentSegments(token);
      activeSegment = yield getActiveSegment();
      activeVariant = yield getActiveVariant();
    }
    return {
      activeSegment,
      activeVariant,
      data
    };
  });
}
export {
  PreprMiddleware,
  getActiveSegment,
  getActiveVariant,
  getPreprEnvironmentSegments,
  getPreprHeaders,
  getPreprUUID,
  getPreviewBarProps
};
//# sourceMappingURL=index.mjs.map