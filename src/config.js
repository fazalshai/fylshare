// config.js
// Uses https://filehub-gyll.onrender.com in production, and supports REACT_APP_API_BASE_URL or local staging origin override.

const defaultApiUrl =
  typeof window !== "undefined" &&
  window.location &&
  window.location.port === "5099"
    ? window.location.origin
    : "https://filehub-gyll.onrender.com";

const config = {
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL !== undefined
      ? process.env.REACT_APP_API_BASE_URL
      : defaultApiUrl,
};

export default config;
