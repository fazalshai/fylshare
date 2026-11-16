// Privacy-conscious Google Analytics 4 (G-03C72HRYJG) & Consent Module
// - Enforces an explicit allowlist of event names and safe parameters.
// - Never sends filenames, transfer labels, emails, 6-digit codes, workspace PINs, tokens, or download URLs.
// - Excludes /admin and strips query parameters / credentials from page paths before reporting.

export const GA4_MEASUREMENT_ID = "G-03C72HRYJG";
const CONSENT_STORAGE_KEY = "fylshare_analytics_consent_v1";

export const ALLOWED_EVENTS = new Set([
  "page_view",
  "upload_started",
  "upload_completed",
  "upload_failed",
  "retrieval_succeeded",
  "download_requested",
  "transfer_expired",
  "deletion_completed",
]);

export const ALLOWED_PARAM_KEYS = new Set([
  "page_path",
  "page_title",
  "file_count",
  "size_bucket",
  "transfer_type",
  "status",
  "error_category",
]);

export const FORBIDDEN_PARAM_KEYS = new Set([
  "code",
  "token",
  "shareToken",
  "revokeToken",
  "workspaceToken",
  "pin",
  "password",
  "name",
  "label",
  "filename",
  "fileName",
  "files",
  "email",
  "url",
  "downloadUrl",
  "ip",
  "clientIp",
]);

let gaInitialized = false;

export function getAnalyticsConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null; // "granted" | "denied" | null (undecided)
    const parsed = JSON.parse(raw);
    return parsed?.choice === "granted" ? "granted" : parsed?.choice === "denied" ? "denied" : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(choice) {
  const normalized = choice === "granted" ? "granted" : "denied";
  try {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        choice: normalized,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch {
    // Ignore storage errors in private browsing
  }

  if (normalized === "granted") {
    initGa4IfConsented();
  } else if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  return normalized;
}

// Sanitize any URL or path so 6-digit codes, tokens, box names, or query parameters are never sent to GA4
export function sanitizeUrlForAnalytics(pathname = "/") {
  if (!pathname || typeof pathname !== "string") return "/";
  // Strip query string and hash completely
  const cleanPath = pathname.split("?")[0].split("#")[0];

  // Exclude admin routes completely
  if (cleanPath.startsWith("/admin")) {
    return null;
  }

  // Redact any 6-digit numerical segments or long tokens in path segments
  const segments = cleanPath
    .split("/")
    .map((seg) => {
      if (!seg) return "";
      if (/^\d{6}$/.test(seg)) return "[redacted_code]";
      if (seg.length >= 16 && /^[A-Za-z0-9_-]+$/.test(seg)) return "[redacted_token]";
      return seg;
    });

  return segments.join("/") || "/";
}

export function getSizeBucket(bytes) {
  const n = Number(bytes) || 0;
  if (n <= 0) return "0B";
  if (n < 1024 * 1024) return "<1MB";
  if (n < 10 * 1024 * 1024) return "1-10MB";
  if (n < 100 * 1024 * 1024) return "10-100MB";
  return "100MB-1GB";
}

export function sanitizeEventParams(rawParams = {}) {
  const safe = {};
  if (!rawParams || typeof rawParams !== "object") return safe;

  for (const [key, value] of Object.entries(rawParams)) {
    if (FORBIDDEN_PARAM_KEYS.has(key)) continue;
    if (!ALLOWED_PARAM_KEYS.has(key)) continue;
    if (value === null || value === undefined) continue;

    if (typeof value === "number" && Number.isFinite(value)) {
      safe[key] = value;
    } else if (typeof value === "string") {
      // Redact if string accidentally looks like a 6-digit code, email, or URL
      if (/^\d{6}$/.test(value.trim())) continue;
      if (value.includes("@") || /^https?:\/\//i.test(value.trim())) continue;
      safe[key] = value.slice(0, 64);
    }
  }
  return safe;
}

export function initGa4IfConsented() {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (window.location?.pathname?.startsWith("/admin")) return false;
  if (getAnalyticsConsent() !== "granted") return false;
  if (gaInitialized) return true;

  gaInitialized = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.gtag("js", new Date());
  // Disable automatic enhanced measurement features that could capture filenames, search codes, or outbound URLs
  window.gtag("config", GA4_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: `https://fylshare.com${sanitizeUrlForAnalytics(window.location.pathname) || "/"}`,
    page_referrer: "",
  });

  const scriptId = "fylshare-ga4-script";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  return true;
}

export function trackPageView(pathname, pageTitle = "") {
  const safePath = sanitizeUrlForAnalytics(pathname);
  if (!safePath) return null; // Excluded route (e.g., /admin)

  const payload = sanitizeEventParams({
    page_path: safePath,
    page_title: pageTitle || (typeof document !== "undefined" ? document.title : "Fylshare"),
  });

  if (getAnalyticsConsent() === "granted") {
    initGa4IfConsented();
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: payload.page_path,
        page_title: payload.page_title,
        page_location: `https://fylshare.com${payload.page_path}`,
      });
    }
  }

  return { event: "page_view", params: payload };
}

export function trackEvent(eventName, rawParams = {}) {
  if (!ALLOWED_EVENTS.has(eventName)) return null;
  if (typeof window !== "undefined" && window.location?.pathname?.startsWith("/admin")) {
    return null;
  }

  const safeParams = sanitizeEventParams(rawParams);

  if (getAnalyticsConsent() === "granted") {
    initGa4IfConsented();
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, safeParams);
    }
  }

  return { event: eventName, params: safeParams };
}

const analyticsService = {
  GA4_MEASUREMENT_ID,
  ALLOWED_EVENTS,
  ALLOWED_PARAM_KEYS,
  FORBIDDEN_PARAM_KEYS,
  getAnalyticsConsent,
  setAnalyticsConsent,
  sanitizeUrlForAnalytics,
  sanitizeEventParams,
  getSizeBucket,
  trackPageView,
  trackEvent,
};

export default analyticsService;
