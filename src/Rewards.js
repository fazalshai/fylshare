import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import config from "./config";
import {
  getParticipantToken,
  setParticipantToken,
  activityHeaders,
  formatCampaignDate,
} from "./rewardsClient";

const card = "rounded-2xl border border-[#D2D2D7]/70 bg-white p-6";
const label = "text-[12px] font-medium text-[#6E6E73]";
const input =
  "w-full px-3 py-2 rounded-lg border border-[#D2D2D7] text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30";
const primaryBtn =
  "px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white text-[13px] font-semibold disabled:opacity-50";
const secondaryBtn =
  "px-4 py-2 rounded-lg border border-[#D2D2D7] text-[13px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]";

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${config.API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...activityHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function Stat({ title, value, hint }) {
  return (
    <div className="rounded-xl bg-[#F5F5F7] p-4">
      <p className="text-[11px] uppercase tracking-wider text-[#6E6E73] font-medium">{title}</p>
      <p className="text-[22px] font-semibold text-[#1D1D1F] mt-1">{value}</p>
      {hint && <p className="text-[11px] text-[#6E6E73] mt-1">{hint}</p>}
    </div>
  );
}

function RulesPanel({ campaign }) {
  if (!campaign) {
    return (
      <div className={card}>
        <h2 className="text-[19px] font-semibold mb-2">No rewards campaign is active</h2>
        <p className="text-[14px] text-[#6E6E73] leading-relaxed">
          Fylshare Rewards is optional and only runs during funded, published campaigns. There is
          no campaign right now, so no prizes are on offer. File sharing works exactly the same
          without an account or email.
        </p>
      </div>
    );
  }
  const r = campaign.scoringRules || {};
  const tz = campaign.timezone;
  return (
    <div className={card}>
      <p className="text-[11px] uppercase tracking-wider text-[#6E6E73] font-medium mb-1">
        Official rules · version {campaign.rulesVersion}
      </p>
      <h2 className="text-[22px] font-semibold mb-3">{campaign.name}</h2>
      <p className="text-[14px] text-[#1D1D1F] leading-relaxed mb-4">
        {campaign.generatedCopy?.summary} Email verification is required for participation and
        reward delivery. Regular file sharing remains available without joining.
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
        <div><dt className={label}>Campaign period</dt><dd>{formatCampaignDate(campaign.startAt, tz)} – {formatCampaignDate(campaign.endAt, tz)} ({tz})</dd></div>
        <div><dt className={label}>Rewards</dt><dd>{campaign.prizeCount} × {campaign.currency} {campaign.rewardValue} {campaign.marketplaceLabel} gift card</dd></div>
        <div><dt className={label}>Eligible countries</dt><dd>{(campaign.eligibleCountries || []).join(", ")}</dd></div>
        <div><dt className={label}>Eligibility</dt><dd>{campaign.eligibilityRequirements}</dd></div>
        <div><dt className={label}>Points</dt><dd>{r.pointsPerTransfer} per qualifying transfer (max {r.maxTransfersPerDay} per campaign day) · {r.pointsPerDelivery} per qualifying recipient download (max {r.maxDeliveriesPerTransfer} per transfer)</dd></div>
        <div><dt className={label}>Ranking</dt><dd>Approved points, then qualifying recipient downloads, then qualifying active days. Signup order is never used.</dd></div>
        <div><dt className={label}>Tie at the prize boundary</dt><dd>{String(campaign.tiePolicy || "").replace(/_/g, " ")}</dd></div>
        <div><dt className={label}>Delivery</dt><dd>Approved rewards emailed to your verified address by {formatCampaignDate(campaign.deliveryDeadline, tz)}, after a {campaign.reviewPeriodDays}-day review.</dd></div>
      </dl>
      <div className="mt-5 text-[12px] text-[#6E6E73] space-y-1.5 border-t border-[#D2D2D7]/60 pt-4">
        <p>What doesn't earn points: multiple files in one transfer (one transfer = one transfer point), repeat downloads by the same session, your own downloads, previews, failed uploads, page refreshes, ads, reviews or invitations.</p>
        <p>"Distinct recipient sessions" are an estimate based on short-lived browser sessions. They are not verified distinct people. Fraud checks reduce abuse but cannot eliminate it, so flagged activity may be held for manual review. You can appeal.</p>
        <p>We never ask for Amazon passwords, Amazon OTPs, payment cards or ID documents. Amazon is not a sponsor of this promotion.</p>
        <p>Reward-related personal information (email, activity evidence) is kept for {campaign.personalDataRetentionDays} days after the campaign ends, then deleted or anonymised. Joining does not extend how long your files are stored.</p>
        <p>Questions: {campaign.supportContact}</p>
      </div>
    </div>
  );
}

function JoinPanel({ campaign, onJoined }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState((campaign.eligibleCountries || [])[0] || "");
  const [acceptRules, setAcceptRules] = useState(false);
  const [marketing, setMarketing] = useState(false); // unchecked by default
  const [otp, setOtp] = useState("");
  const [pendingToken, setPendingToken] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const enroll = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const { ok, data } = await api("/api/rewards/enroll", {
      method: "POST",
      body: { email, declaredCountry: country, serviceMessagesAccepted: acceptRules, marketingOptIn: marketing },
    });
    setBusy(false);
    if (!ok) return setMsg(data.error || "Could not start enrollment.");
    setPendingToken(data.enrollmentSessionToken);
    setStep("verify");
    setMsg(data.message);
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { ok, data } = await api("/api/rewards/verify", {
      method: "POST",
      body: { enrollmentSessionToken: pendingToken, otp },
    });
    setBusy(false);
    if (!ok) return setMsg(data.error || "Verification failed.");
    setParticipantToken(data.participantToken);
    onJoined();
  };

  const resend = async () => {
    const { data } = await api("/api/rewards/resend", { method: "POST", body: { enrollmentSessionToken: pendingToken } });
    setMsg(data.message || data.error);
  };

  return (
    <div className={card}>
      <h2 className="text-[18px] font-semibold mb-1">Join rewards</h2>
      <p className="text-[13px] text-[#6E6E73] mb-4">
        Optional. We only need an email to verify you and deliver a reward if you are selected.
      </p>
      {step === "email" ? (
        <form onSubmit={enroll} className="space-y-3">
          <div>
            <label className={label} htmlFor="rw-email">Email address</label>
            <input id="rw-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="rw-country">Country of residence (self-declared)</label>
            <select id="rw-country" value={country} onChange={(e) => setCountry(e.target.value)} className={input}>
              {(campaign.eligibleCountries || []).map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <label className="flex items-start gap-2 text-[13px]">
            <input type="checkbox" checked={acceptRules} onChange={(e) => setAcceptRules(e.target.checked)} className="mt-1" />
            <span>I accept the official rules above and agree to receive necessary campaign service emails (verification, status, reward delivery).</span>
          </label>
          <label className="flex items-start gap-2 text-[13px] text-[#6E6E73]">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1" />
            <span>Optional: send me occasional Fylshare product news. Leaving this unchecked does not affect eligibility.</span>
          </label>
          <button type="submit" disabled={busy || !acceptRules} className={primaryBtn}>Send verification code</button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <label className={label} htmlFor="rw-otp">6-digit code (expires in 30 minutes, single use)</label>
          <input id="rw-otp" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className={`${input} font-mono tracking-[0.3em]`} />
          <div className="flex gap-2">
            <button type="submit" disabled={busy || otp.length !== 6} className={primaryBtn}>Verify</button>
            <button type="button" onClick={resend} className={secondaryBtn}>Resend code</button>
          </div>
        </form>
      )}
      {msg && <p className="text-[12px] text-[#6E6E73] mt-3" role="status">{msg}</p>}
    </div>
  );
}

function SignInPanel({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");

  const request = async (e) => {
    e.preventDefault();
    const { data } = await api("/api/rewards/login-request", { method: "POST", body: { email } });
    setSent(true);
    setMsg(data.message || data.error);
  };
  const verify = async (e) => {
    e.preventDefault();
    const { ok, data } = await api("/api/rewards/login-verify", { method: "POST", body: { email, otp } });
    if (!ok) return setMsg(data.error || "Sign-in failed.");
    setParticipantToken(data.participantToken);
    onSignedIn();
  };

  return (
    <div className={card}>
      <h2 className="text-[16px] font-semibold mb-3">Already joined? Sign in with an email code</h2>
      <form onSubmit={sent ? verify : request} className="flex flex-col sm:flex-row gap-2">
        <input type="email" required placeholder="Verified email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        {sent && <input inputMode="numeric" maxLength={6} placeholder="Code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className={`${input} sm:max-w-[140px] font-mono`} />}
        <button type="submit" className={primaryBtn}>{sent ? "Sign in" : "Email me a code"}</button>
      </form>
      {msg && <p className="text-[12px] text-[#6E6E73] mt-2">{msg}</p>}
    </div>
  );
}

function Dashboard({ onSignOut }) {
  const [state, setState] = useState({ loading: true });
  const [newEmail, setNewEmail] = useState("");
  const [changeOtp, setChangeOtp] = useState("");
  const [appeal, setAppeal] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { ok, status, data } = await api("/api/rewards/me");
    if (status === 401) return onSignOut();
    setState({ loading: false, ok, data });
  }, [onSignOut]);

  useEffect(() => {
    load();
    // Claim the transfer uploaded just before joining, using the uploader's proof of ownership (revokeToken).
    try {
      const pending = JSON.parse(sessionStorage.getItem("fylshare_pending_claim") || "null");
      if (pending?.code && pending?.revokeToken) {
        sessionStorage.removeItem("fylshare_pending_claim");
        api("/api/rewards/claim-transfer", { method: "POST", body: pending }).then(({ data }) => {
          setMsg(data.message || data.error || "");
          load();
        });
      }
    } catch {
      // ignore
    }
  }, [load]);

  if (state.loading) return <div className={card}>Loading your progress…</div>;
  if (!state.ok) return <div className={card}>Could not load your rewards progress. Please refresh.</div>;

  const p = state.data.participant;
  const c = state.data.campaign;
  const raw = p.rawActivity;
  const q = p.qualifyingActivity;
  const pts = p.points;
  const caps = p.applicableCaps;
  const rv = p.reviewAndAppeals;
  const rk = p.ranking;
  const out = p.rewardOutcome;

  const changeEmail = async () => {
    const { data } = await api("/api/rewards/change-email", { method: "POST", body: { newEmail } });
    setMsg(data.message || data.error);
  };
  const confirmEmail = async () => {
    const { data } = await api("/api/rewards/confirm-email-change", { method: "POST", body: { otp: changeOtp } });
    setMsg(data.message || data.error);
    load();
  };
  const sendAppeal = async () => {
    const { data } = await api("/api/rewards/appeal", { method: "POST", body: { message: appeal } });
    setMsg(data.message || data.error);
    load();
  };
  const toggleMarketing = async () => {
    const { data } = await api("/api/rewards/marketing-preference", { method: "POST", body: { marketingOptIn: !p.marketingOptIn } });
    setMsg(data.message || data.error);
    load();
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#6E6E73] font-medium">Your private progress · {c?.name}</p>
            <h2 className="text-[20px] font-semibold">{p.anonymizedLabel}</h2>
            <p className="text-[12px] text-[#6E6E73]">Reward delivery email: {p.email} {p.emailVerified ? "· verified" : "· not verified"}</p>
          </div>
          <button type="button" onClick={onSignOut} className="text-[12px] text-[#0066CC]">Sign out</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat title="Approved points" value={pts.approvedPoints} />
          <Stat title="Pending review" value={pts.pendingReviewPoints} hint="Held until review completes" />
          <Stat title="Provisional rank" value={rk.rankingsEnabled && rk.provisionalRank ? `#${rk.provisionalRank}` : "—"} hint={rk.totalRankedParticipants ? `of ${rk.totalRankedParticipants} · ${rk.prizeCount} rewards` : ""} />
          <Stat title="Reward status" value={String(out.rewardStatus).replace(/_/g, " ")} />
        </div>
        <p className="text-[11px] text-[#6E6E73] mt-3">{rk.disclaimer}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={card}>
          <h3 className="text-[15px] font-semibold mb-3">Raw activity (all counted)</h3>
          <dl className="text-[13px] grid grid-cols-2 gap-y-2">
            <dt className="text-[#6E6E73]">Upload attempts</dt><dd>{raw.uploadAttempts}</dd>
            <dt className="text-[#6E6E73]">Successful transfers</dt><dd>{raw.successfulTransfers}</dd>
            <dt className="text-[#6E6E73]">Files uploaded</dt><dd>{raw.filesUploaded}</dd>
            <dt className="text-[#6E6E73]">Failed / cancelled</dt><dd>{raw.failedUploads}</dd>
            <dt className="text-[#6E6E73]">Download requests</dt><dd>{raw.downloadRequests}</dd>
            <dt className="text-[#6E6E73]">Distinct recipient sessions (est.)</dt><dd>{raw.estimatedDistinctRecipientSessions}</dd>
          </dl>
        </div>
        <div className={card}>
          <h3 className="text-[15px] font-semibold mb-3">Qualifying activity & caps</h3>
          <dl className="text-[13px] grid grid-cols-2 gap-y-2">
            <dt className="text-[#6E6E73]">Qualifying transfers</dt><dd>{q.qualifyingTransfers} ({pts.uploadPoints} pts)</dd>
            <dt className="text-[#6E6E73]">Qualifying recipient downloads</dt><dd>{q.qualifyingRecipientDeliveries} ({pts.deliveryPoints} pts)</dd>
            <dt className="text-[#6E6E73]">Active days</dt><dd>{q.qualifyingActiveDaysCount}</dd>
            <dt className="text-[#6E6E73]">Today ({caps.campaignTimezone})</dt><dd>{caps.todayQualifyingTransfers} / {caps.maxTransfersPerDay} transfers</dd>
            <dt className="text-[#6E6E73]">Per-transfer download cap</dt><dd>{caps.maxDeliveriesPerTransfer}</dd>
            {pts.manualAdjustmentPoints !== 0 && (<><dt className="text-[#6E6E73]">Reviewed adjustments</dt><dd>{pts.manualAdjustmentPoints}</dd></>)}
          </dl>
        </div>
      </div>

      <div className={card}>
        <h3 className="text-[15px] font-semibold mb-2">Review status: {String(rv.fraudStatus).replace(/_/g, " ")}</h3>
        {rv.reviewReason && <p className="text-[13px] text-[#6E6E73] mb-2">{rv.reviewReason}</p>}
        {rv.appealStatus !== "none" ? (
          <p className="text-[13px]">Appeal: {rv.appealStatus}{rv.appealResolutionNote ? ` — ${rv.appealResolutionNote}` : ""}</p>
        ) : (rv.fraudStatus === "pending_review" || rv.fraudStatus === "flagged" || rv.fraudStatus === "disqualified") && (
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <input value={appeal} onChange={(e) => setAppeal(e.target.value)} placeholder="Explain your activity" className={input} />
            <button type="button" onClick={sendAppeal} className={secondaryBtn}>Submit appeal</button>
          </div>
        )}
      </div>

      <div className={card}>
        <h3 className="text-[15px] font-semibold mb-3">Email & preferences</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New reward delivery email" className={input} />
          <button type="button" onClick={changeEmail} className={secondaryBtn}>Send code</button>
        </div>
        {p.pendingNewEmail && (
          <div className="flex gap-2 mb-2">
            <input value={changeOtp} onChange={(e) => setChangeOtp(e.target.value.replace(/\D/g, ""))} placeholder={`Code sent to ${p.pendingNewEmail}`} className={input} />
            <button type="button" onClick={confirmEmail} className={primaryBtn}>Confirm</button>
          </div>
        )}
        <label className="flex items-center gap-2 text-[13px] text-[#6E6E73]">
          <input type="checkbox" checked={p.marketingOptIn} onChange={toggleMarketing} />
          Optional product news (unsubscribing never affects an owed reward)
        </label>
      </div>
      {msg && <p className="text-[12px] text-[#6E6E73]" role="status">{msg}</p>}
    </div>
  );
}

export default function Rewards() {
  const [searchParams] = useSearchParams();
  const [campaign, setCampaign] = useState(undefined);
  const [token, setToken] = useState(getParticipantToken());

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/rewards/active-campaign`)
      .then((r) => r.json())
      .then((d) => setCampaign(d.active ? d.campaign : null))
      .catch(() => setCampaign(null));
  }, []);

  const refreshToken = () => setToken(getParticipantToken());
  const signOut = useCallback(() => {
    setParticipantToken("");
    setToken("");
  }, []);

  return (
    <div className="bg-white text-[#1D1D1F]">
      <section className="max-w-[880px] mx-auto px-4 sm:px-6 pt-10 pb-16 space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight">Fylshare Rewards</h1>
          <p className="text-[15px] text-[#6E6E73]">Optional. Sharing files never requires joining.</p>
        </div>

        {campaign === undefined ? (
          <div className={card}>Loading campaign status…</div>
        ) : token ? (
          <Dashboard onSignOut={signOut} />
        ) : (
          <>
            <RulesPanel campaign={campaign} />
            {campaign && (searchParams.get("join") === "1" ? <JoinPanel campaign={campaign} onJoined={refreshToken} /> : (
              <div className="flex justify-center"><Link to="/rewards?join=1" className={primaryBtn}>Join rewards</Link></div>
            ))}
            <SignInPanel onSignedIn={refreshToken} />
          </>
        )}
        <p className="text-center text-[12px]"><Link to="/" className="text-[#0066CC]">Back to sharing files</Link></p>
      </section>
    </div>
  );
}

