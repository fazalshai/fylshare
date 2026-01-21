// config.js
// Change this URL to your deployed backend URL (e.g., on Render) when ready.
// For local development, keep it as "http://localhost:5001".

const config = {
    API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5001",
};

export default config;
