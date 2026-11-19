// Shared helpers for Fylshare's optional rewards & accurate activity counting.
// - Short-lived first-party session ID (sessionStorage; cleared when the tab closes). No fingerprinting.
// - Participant token is only present if the visitor explicitly joined and verified rewards.
// - Event IDs make retries idempotent so they never inflate counts.

const SESSION_KEY = "fylshare_sid";
const PARTICIPANT_KEY = "fylshare_rewards_token";
const INVITE_DISMISSED_KEY = "fylshare_rewards_invite_dismissed";

function randomId(prefix = "ev") {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`;
    }
  } catch {
    // fall through
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function getSessionId() {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = randomId("sid");
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function newEventId(prefix = "ev") {
  return randomId(prefix);
}

export function getParticipantToken() {
  try {
    return localStorage.getItem(PARTICIPANT_KEY) || "";
  } catch {
    return "";
  }
}

export function setParticipantToken(token) {
  try {
    if (token) localStorage.setItem(PARTICIPANT_KEY, token);
    else localStorage.removeItem(PARTICIPANT_KEY);
  } catch {
    // ignore
  }
}

export function activityHeaders(extra = {}) {
  const headers = { "X-Fylshare-Session": getSessionId(), ...extra };
  const pt = getParticipantToken();
  if (pt) headers["X-Participant-Token"] = pt;
  return headers;
}

// Invitation is shown at most once per campaign per browser — never repeated popups.
export function isInviteDismissed(campaignId) {
  try {
    return localStorage.getItem(INVITE_DISMISSED_KEY) === campaignId;
  } catch {
    return false;
  }
}

export function dismissInvite(campaignId) {
  try {
    localStorage.setItem(INVITE_DISMISSED_KEY, campaignId || "none");
  } catch {
    // ignore
  }
}

export function formatCampaignDate(iso, timezone) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone || "UTC",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return String(iso).slice(0, 10);
  }
}
