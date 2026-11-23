import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Gift, Mail, CheckCircle2 } from "lucide-react";
import config from "./config";
import {
  getParticipantToken,
  setParticipantToken,
  isInviteDismissed,
  dismissInvite,
  formatCampaignDate,
  activityHeaders,
} from "./rewardsClient";

const COUNTRY_CHOICES = [
  { code: "AE", label: "United Arab Emirates (AE)" },
  { code: "IN", label: "India (IN)" },
  { code: "US", label: "United States (US)" },
  { code: "GB", label: "United Kingdom (GB)" },
  { code: "SA", label: "Saudi Arabia (SA)" },
  { code: "CA", label: "Canada (CA)" },
  { code: "AU", label: "Australia (AU)" },
  { code: "SG", label: "Singapore (SG)" },
  { code: "DE", label: "Germany (DE)" },
];

// Small, dismissible, optional invitation shown after a successful upload or on the transfer page.
// When showInlineEnrollment is false (default), renders NOTHING unless an active funded campaign exists.
// When showInlineEnrollment is true, allows optional email enrollment & activity tracking with an inline email form.
export default function RewardsInvite({ transfer, showInlineEnrollment = false }) {
  const [campaign, setCampaign] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [step, setStep] = useState("email"); // "email" | "verify"
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("AE");
  const [acceptService, setAcceptService] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false); // Strictly unchecked by default
  const [otp, setOtp] = useState("");
  const [pendingToken, setPendingToken] = useState("");
  const [stagingOtpHint, setStagingOtpHint] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [joinedToken, setJoinedToken] = useState(() => getParticipantToken());
  const joined = Boolean(joinedToken);

  useEffect(() => {
    let cancelled = false;
    fetch(`${config.API_BASE_URL}/api/rewards/active-campaign`)
      .then((r) => (r.ok ? r.json() : { active: false }))
      .then((data) => {
        if (cancelled) return;
        setLoaded(true);
        if (data?.active && data.campaign) {
          if (isInviteDismissed(data.campaign.campaignId) && !joined) return;
          setCampaign(data.campaign);
          if (
            Array.isArray(data.campaign.eligibleCountries) &&
            data.campaign.eligibleCountries.length > 0
          ) {
            setCountry(data.campaign.eligibleCountries[0]);
          }
          if (!joined) {
            fetch(`${config.API_BASE_URL}/api/rewards/funnel`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "impression" }),
            }).catch(() => {});
          }
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [joined]);

  const inviteKey = campaign?.campaignId || "cmp_fylshare_activity";

  if (hidden) return null;
  if (!campaign && !showInlineEnrollment) return null;
  if (!loaded && !showInlineEnrollment) return null;
  if (isInviteDismissed(inviteKey) && !joined && !showEmailForm) return null;

  const handleDismiss = () => {
    dismissInvite(inviteKey);
    setHidden(true);
    fetch(`${config.API_BASE_URL}/api/rewards/funnel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dismiss" }),
    }).catch(() => {});
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatusMsg("");
    setStagingOtpHint("");
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/rewards/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...activityHeaders() },
        body: JSON.stringify({
          email,
          declaredCountry: country,
          serviceMessagesAccepted: acceptService,
          marketingOptIn,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      if (!res.ok) {
        setStatusMsg(data.error || "Could not start enrollment.");
        return;
      }
      setPendingToken(data.enrollmentSessionToken || "");
      const previewOtp = data.stagingVerificationOtp || data._testVerification?.otp || "";
      if (previewOtp) {
        setStagingOtpHint(previewOtp);
      }
      setStep("verify");
      setStatusMsg(data.message || "Verification code sent.");
    } catch {
      setBusy(false);
      setStatusMsg("Network error while requesting verification code.");
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatusMsg("");
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/rewards/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...activityHeaders() },
        body: JSON.stringify({
          enrollmentSessionToken: pendingToken,
          otp,
          email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      if (!res.ok) {
        setStatusMsg(data.error || "Invalid or expired verification code.");
        return;
      }
      setParticipantToken(data.participantToken);
      setJoinedToken(data.participantToken);

      // Automatically link the current transfer if we have the uploader's proof-of-ownership (revokeToken)
      if (transfer?.code && transfer?.revokeToken) {
        await fetch(`${config.API_BASE_URL}/api/rewards/claim-transfer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...activityHeaders({ "X-Participant-Token": data.participantToken }),
          },
          body: JSON.stringify({
            code: transfer.code,
            revokeToken: transfer.revokeToken,
          }),
        }).catch(() => {});
      }
    } catch {
      setBusy(false);
      setStatusMsg("Network error while verifying code.");
    }
  };

  if (joined) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-[12px] text-[#1D1D1F] flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>
            <strong>Fylshare Rewards active:</strong> Your verified email is linked for qualifying
            upload &amp; download activity points.
          </span>
        </span>
        <Link to="/rewards" className="text-[#0066CC] font-semibold shrink-0 hover:underline">
          View my points &amp; rank →
        </Link>
      </div>
    );
  }

  const rules = campaign?.scoringRules || {
    pointsPerTransfer: 1,
    pointsPerDelivery: 2,
    maxDeliveriesPerTransfer: 3,
    maxTransfersPerDay: 5,
  };
  const tz = campaign?.timezone || "Asia/Dubai";

  return (
    <div
      role="region"
      aria-label="Optional Fylshare Rewards invitation"
      className="rounded-2xl border border-[#D2D2D7]/80 bg-white p-5 relative shadow-sm"
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss rewards invitation"
        className="absolute top-3 right-3 p-1 rounded-md text-[#6E6E73] hover:bg-[#F5F5F7]"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Gift size={16} className="text-[#0066CC]" />
        <h3 className="text-[15px] font-semibold text-[#1D1D1F]">
          Optional: join Fylshare Rewards
        </h3>
      </div>

      {campaign ? (
        <>
          <p className="text-[13px] text-[#1D1D1F] leading-relaxed mb-3">
            Earn points from qualifying file transfers and recipient downloads between{" "}
            {formatCampaignDate(campaign.startAt, tz)} and {formatCampaignDate(campaign.endAt, tz)}{" "}
            ({tz}). {campaign.prizeCount} eligible participants will receive {campaign.currency}{" "}
            {campaign.rewardValue} {campaign.marketplaceLabel} gift cards under the published
            ranking rules.
          </p>
          <ul className="text-[12px] text-[#6E6E73] space-y-1 mb-4 list-disc pl-4">
            <li>
              Eligible: {(campaign.eligibleCountries || []).join(", ")} ·{" "}
              {campaign.eligibilityRequirements}
            </li>
            <li>
              {rules.pointsPerTransfer} point per qualifying transfer (max{" "}
              {rules.maxTransfersPerDay}/day) · {rules.pointsPerDelivery} points per qualifying
              recipient download (max {rules.maxDeliveriesPerTransfer} per transfer).
            </li>
            <li>
              Joining does not guarantee a reward. Winners are ranked by activity, not signup
              order.
            </li>
            <li>Activity is checked for self-downloads, repeats, and automated abuse.</li>
            <li>
              Approved rewards are emailed to your verified address by{" "}
              {formatCampaignDate(campaign.deliveryDeadline, tz)}.
            </li>
            <li>Amazon is not a sponsor of this promotion.</li>
          </ul>
        </>
      ) : (
        <>
          <p className="text-[13px] text-[#1D1D1F] leading-relaxed mb-2.5">
            Verify your email address to link your uploads and earn activity points ({rules.pointsPerTransfer}{" "}
            pt per qualifying transfer, up to {rules.maxTransfersPerDay}/day ·{" "}
            {rules.pointsPerDelivery} pts per qualifying recipient download, up to{" "}
            {rules.maxDeliveriesPerTransfer} per transfer).
          </p>
          <p className="text-[11.5px] text-[#6E6E73] mb-3.5">
            Regular file sharing works without an email. No funded prize draw is currently active;
            verified participants can track their upload/download points and join upcoming
            campaigns. Winners are ranked by qualifying activity, never by signup order.
          </p>
        </>
      )}

      {!showEmailForm ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                if (transfer?.code && transfer?.revokeToken) {
                  sessionStorage.setItem(
                    "fylshare_pending_claim",
                    JSON.stringify({ code: transfer.code, revokeToken: transfer.revokeToken })
                  );
                }
              } catch {
                // ignore
              }
              setShowEmailForm(true);
            }}
            className="px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white text-[13px] font-semibold flex items-center gap-1.5"
          >
            <Mail size={14} /> Join rewards
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg border border-[#D2D2D7] text-[13px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
          >
            Continue without joining
          </button>
          <Link to="/rewards?join=1" className="text-[12px] text-[#0066CC] ml-auto hover:underline">
            Open full Rewards page →
          </Link>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-[#D2D2D7]/70 space-y-3">
          {step === "email" ? (
            <form onSubmit={handleEnrollSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label htmlFor="invite-email-input" className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Your email address (for verification &amp; reward delivery)
                  </label>
                  <input
                    id="invite-email-input"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D2D2D7] text-[13px] text-[#1D1D1F]"
                  />
                </div>
                <div>
                  <label htmlFor="invite-country-select" className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Country
                  </label>
                  <select
                    id="invite-country-select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#D2D2D7] text-[13px] text-[#1D1D1F] bg-white"
                  >
                    {(campaign?.eligibleCountries?.length
                      ? campaign.eligibleCountries.map((c) => ({ code: c, label: c }))
                      : COUNTRY_CHOICES
                    ).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2 text-[12px] text-[#1D1D1F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptService}
                  onChange={(e) => setAcceptService(e.target.checked)}
                  className="mt-0.5 accent-[#0066CC]"
                />
                <span>
                  I accept the Fylshare Rewards rules and agree to receive necessary verification
                  and reward service emails.
                </span>
              </label>

              <label className="flex items-start gap-2 text-[11.5px] text-[#6E6E73] cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-0.5 accent-[#0066CC]"
                />
                <span>
                  Optional: send me occasional Fylshare product updates (unchecked by default;
                  declining does not affect reward eligibility).
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={busy || !acceptService || !email}
                  className="px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] disabled:opacity-50 text-white text-[12.5px] font-semibold"
                >
                  {busy ? "Sending code..." : "Verify Email & Join"}
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-3 py-2 rounded-lg border border-[#D2D2D7] text-[12px] text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Continue without joining
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-2.5">
              <label htmlFor="invite-otp-input" className="block text-[12px] font-medium text-[#1D1D1F]">
                Enter the 6-digit verification code for <strong>{email}</strong>
              </label>
              {stagingOtpHint && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-900">
                  Verification code (staging / instant preview):{" "}
                  <strong className="font-mono tracking-wider text-[14px]">{stagingOtpHint}</strong>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  id="invite-otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="px-3 py-2 rounded-lg border border-[#D2D2D7] text-[14px] font-mono tracking-[0.25em] w-40"
                />
                <button
                  type="submit"
                  disabled={busy || otp.length !== 6}
                  className="px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] disabled:opacity-50 text-white text-[12.5px] font-semibold"
                >
                  {busy ? "Verifying..." : "Confirm Code"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="px-3 py-2 rounded-lg border border-[#D2D2D7] text-[12px] text-[#6E6E73]"
                >
                  Change email
                </button>
              </div>
            </form>
          )}
          {statusMsg && (
            <p className="text-[11.5px] text-[#6E6E73]" role="status">
              {statusMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
