self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/0gkvxyri8qpkk.js"
  ],
  "/_error": [
    "static/chunks/2-n8r_08rm7t9.js"
  ],
  "/integrations-auth-callback": [
    "static/chunks/2uq45183ui7c-.js"
  ],
  "/onedrive-auth-callback": [
    "static/chunks/0vnkhw5kb2l8y.js"
  ],
  "/review/configure": [
    "static/chunks/30idax_oew821.js"
  ],
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/unsupported-browser",
        "destination": "/error-pages/unsupported-browser/index.html"
      },
      {
        "source": "/cookies-disabled",
        "destination": "/error-pages/cookies-disabled/index.html"
      },
      {
        "source": "/content/:path*",
        "destination": "/api/content-library"
      },
      {
        "source": "/api/:path*",
        "destination": "/api/:path*"
      },
      {
        "source": "/health",
        "destination": "/api/health"
      },
      {
        "source": "/:path*",
        "destination": "/"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/analytics",
    "/api/content-library",
    "/api/health",
    "/api/lighthouse/packages",
    "/api/lighthouse/packages/handoff",
    "/api/lighthouse/packages/[id]/share",
    "/api/lighthouse/sources",
    "/api/lighthouse/sources/[id]",
    "/api/lighthouse/sources/[id]/extractions",
    "/api/lighthouse/sources/[id]/from-course-file",
    "/api/lighthouse/sources/[id]/status",
    "/api/lighthouse/sources/[id]/transcode",
    "/api/lighthouse/sources/[id]/transcode/upload-url",
    "/api/self/credits",
    "/api/self/[subId]/membershipsStartDate",
    "/integrations-auth-callback",
    "/onedrive-auth-callback",
    "/review/configure"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()