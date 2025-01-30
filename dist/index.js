var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PreprMiddleware: () => PreprMiddleware,
  getActiveSegment: () => getActiveSegment,
  getActiveVariant: () => getActiveVariant,
  getPreprEnvironmentSegments: () => getPreprEnvironmentSegments,
  getPreprHeaders: () => getPreprHeaders,
  getPreprUUID: () => getPreprUUID,
  getPreviewBarProps: () => getPreviewBarProps
});
module.exports = __toCommonJS(src_exports);
var import_server = require("next/server");
var import_functions = require("@vercel/functions");
var import_headers = require("next/headers");
function PreprMiddleware(request, response) {
  var _a, _b, _c, _d;
  const newResponse = response || import_server.NextResponse.next();
  const utm_source = request.nextUrl.searchParams.get("utm_source");
  const utm_medium = request.nextUrl.searchParams.get("utm_medium");
  const utm_term = request.nextUrl.searchParams.get("utm_term");
  const utm_content = request.nextUrl.searchParams.get("utm_content");
  const utm_campaign = request.nextUrl.searchParams.get("utm_campaign");
  const initial_referral = request.headers.get("referer");
  const ip = (0, import_functions.ipAddress)(request);
  if (ip) {
    newResponse.headers.set("Prepr-Visitor-IP", ip);
  }
  let cookie = (_a = request.cookies.get("__prepr_uid")) == null ? void 0 : _a.value;
  const hutkCookie = (_b = request.cookies.get("hubspotutk")) == null ? void 0 : _b.value;
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
  if (!cookie) {
    cookie = crypto.randomUUID();
    newResponse.cookies.set("__prepr_uid", cookie, {
      maxAge: 1 * 365 * 24 * 60
      // Set for one year
    });
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
    const headersList = yield (0, import_headers.headers)();
    return headersList.get("prepr-customer-id");
  });
}
function getActiveSegment() {
  return __async(this, null, function* () {
    const headersList = yield (0, import_headers.headers)();
    return headersList.get("Prepr-Segments");
  });
}
function getActiveVariant() {
  return __async(this, null, function* () {
    const headersList = yield (0, import_headers.headers)();
    return headersList.get("Prepr-ABtesting");
  });
}
function getPreprHeaders() {
  return __async(this, null, function* () {
    let newHeaders = {};
    const headersList = yield (0, import_headers.headers)();
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
    const response = yield fetch("https://api.eu1.prepr.io/segments", {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Prepr-Preview-Bar/1.0"
      }
    });
    return response.json();
  });
}
function getPreviewBarProps(token) {
  return __async(this, null, function* () {
    const data = yield getPreprEnvironmentSegments(token);
    const activeSegment = yield getActiveSegment();
    const activeVariant = yield getActiveVariant();
    return {
      activeSegment,
      activeVariant,
      data
    };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PreprMiddleware,
  getActiveSegment,
  getActiveVariant,
  getPreprEnvironmentSegments,
  getPreprHeaders,
  getPreprUUID,
  getPreviewBarProps
});
//# sourceMappingURL=index.js.map